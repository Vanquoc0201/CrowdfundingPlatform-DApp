// src/components/custom/create-campaign/CreateCampaignForm.tsx
"use client";

import * as React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCampaignSchema, CreateCampaignFormValues } from "@/lib/validation/campaign";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Loader2, UploadCloud } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import { parseEther } from "viem";
import campaignfactoryabi from "@/abis/CampaignFactory.json";
import { CONTRACT_ADDRESSES } from "@/abis/address";
import { Address, Abi } from "viem";
import { uploadFileToIpfs, uploadJsonToIpfs } from '@/lib/ipfs';
import { Card, CardHeader } from '@/components/ui/card';

const FACTORY_ADDRESS = CONTRACT_ADDRESSES.localhost.CampaignFactory as Address;
const factoryABI = campaignfactoryabi.abi as Abi;

export function CreateCampaignForm() {
  const { address, isConnected } = useAccount();
  const form = useForm<CreateCampaignFormValues>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      title: "",
      description: "",
      goal: 1,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      minimumContribution: 0.01,
    },
  });

  const {
    writeContract,
    data: hash,
    isPending: isCreatePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const onSubmit = async (values: CreateCampaignFormValues) => {
    if (!isConnected || !address) {
      toast.error("Wallet Not Connected", { description: "Please connect your wallet to create a campaign." });
      return;
    }

    try {
      let imageUrl = "";
      if (values.image) {
        toast.info("Uploading image to IPFS...", { duration: 5000 });
        imageUrl = await uploadFileToIpfs(values.image); 
        toast.success("Image uploaded to IPFS!", { description: `URL: ${imageUrl.slice(0, 30)}...` });
      }

      toast.info("Creating IPFS metadata...", { duration: 3000 });
      const metadata = {
        title: values.title,
        description: values.description,
        imageUrl: imageUrl || "/placeholder.png",
      };
      const metaDataURI = await uploadJsonToIpfs(metadata, `${values.title}-metadata`); // Gọi hàm mới
      toast.success("Metadata uploaded to IPFS!", { description: `URI: ${metaDataURI.slice(0, 30)}...` });


      // 3. Prepare contract arguments
      const _title = values.title;
      const _goalWei = parseEther(values.goal.toString());
      const _deadlineTs = BigInt(Math.floor(values.deadline.getTime() / 1000));
      const _metaDataURI = metaDataURI;
      const _minimumContribution = parseEther(values.minimumContribution.toString());


      // 4. Send transaction
      writeContract({
        address: FACTORY_ADDRESS,
        abi: factoryABI,
        functionName: "createCampaign",
        args: [_title, _goalWei, _deadlineTs, _metaDataURI, _minimumContribution],
      });
    } catch (e: any) {
      toast.error("Campaign Creation Failed", { description: e.shortMessage || e.message || "An unknown error occurred during IPFS upload or transaction." });
      console.error("Create campaign error:", e);
    }
  };

  React.useEffect(() => {
    if (isConfirmed) {
      toast.success("Campaign Created!", { description: `Your campaign has been successfully launched. Transaction hash: ${hash}` });
      form.reset();
    }
    if (writeError || confirmError) {
      const errorMsg = writeError?.message || confirmError?.message || writeError?.message || confirmError?.message || "An unknown error occurred.";
      toast.error("Campaign Creation Failed", { description: errorMsg });
    }
  }, [isConfirmed, writeError, confirmError, hash, form, address]);


  return (
    <Card className="max-w-3xl mx-auto p-6">
      <CardHeader className="text-center">
        <h1 className="text-3xl font-bold">Launch Your Campaign</h1>
        <p className="text-muted-foreground">Start a new decentralized crowdfunding campaign on our platform.</p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Title</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Build a Decentralized Social Media App" {...field} />
                </FormControl>
                <FormDescription>
                  This is the public name for your crowdfunding campaign.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us more about your project and vision." {...field} rows={5} />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of your project. This will be stored on IPFS.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Campaign Image</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      onChange(event.target.files && event.target.files[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload an image for your campaign (max 5MB). This will be stored on IPFS.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funding Goal (ETH)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 10.0"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    step="0.001"
                    min="0.001"
                  />
                </FormControl>
                <FormDescription>
                  The total amount of ETH you aim to raise for your project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimumContribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Contribution (ETH)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 0.01"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    step="0.0001"
                    min="0.0001"
                  />
                </FormControl>
                <FormDescription>
                  The minimum amount of ETH a user must contribute to your campaign.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Campaign Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(Date.now() + 5 * 60 * 1000)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The date by which your campaign must reach its goal.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={!isConnected || isCreatePending || isConfirming || !form.formState.isValid}
          >
            {isCreatePending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isCreatePending ? "Confirming..." : "Processing..."}
              </>
            ) : (
              "Create Campaign"
            )}
          </Button>
          {!isConnected && (
            <p className="text-sm text-destructive text-center">Please connect your wallet to create a campaign.</p>
          )}
          {!form.formState.isValid && form.formState.isSubmitted && (
             <p className="text-sm text-destructive text-center">Please fill out all required fields correctly.</p>
          )}
        </form>
      </Form>
    </Card>
  );
}