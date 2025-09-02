"use client";

import { useEffect, useState } from "react";
import { Address, parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import campaignabi from "@/abis/Campaign.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { CampaignData } from "@/types/campaign";
import { toast } from "sonner";

interface ContributeFormProps {
  campaignAddress: Address;
  campaignStatus: CampaignData["status"];
  minimumContribution: bigint;
}

export function ContributeForm({
  campaignAddress,
  campaignStatus,
  minimumContribution,
}: ContributeFormProps) {
  const [amount, setAmount] = useState("");
  const { address, isConnected } = useAccount();

  const {
    writeContract,
    data: hash,
    isPending: isContributePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleContribute = async () => {
    if (!isConnected || !address) {
      toast.error("Wallet not connected. Please connect your wallet.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Invalid amount. Please enter a valid number.");
      return;
    }

    if (campaignStatus !== "Ongoing") {
      toast.error("Campaign is not active. You cannot contribute now.");
      return;
    }

    try {
      writeContract({
        address: campaignAddress,
        abi: campaignabi.abi,
        functionName: "contribute",
        value: parseEther(amount),
      });
    } catch (e: any) {
      toast.error(e.shortMessage || e.message || "Failed to initiate contribution.");
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toast.success(
        `You contributed ${amount} ETH successfully!\nTx hash: ${hash}`
      );
      setAmount("");
    }

    if (writeError || confirmError) {
      const errorMsg =
        writeError?.message ||
        confirmError?.message ||
        "An unknown error occurred.";
      toast.error(errorMsg);
    }
  }, [isConfirmed, writeError, confirmError, hash, amount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribute to this Campaign</CardTitle>
        <CardDescription>
          Support this project by contributing ETH. Every contribution helps!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="e.g., 0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.001"
            step="0.001"
            disabled={
              campaignStatus !== "Ongoing" ||
              !isConnected ||
              isContributePending ||
              isConfirming
            }
          />
        </div>
        <Button
          onClick={handleContribute}
          className="w-full"
          disabled={
            !isConnected ||
            isContributePending ||
            isConfirming ||
            campaignStatus !== "Ongoing"
          }
        >
          {isContributePending || isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isContributePending ? "Confirming..." : "Processing..."}
            </>
          ) : (
            "Contribute"
          )}
        </Button>
        {!isConnected && (
          <p className="text-sm text-destructive text-center">
            Please connect your wallet.
          </p>
        )}
        {campaignStatus !== "Ongoing" && (
          <p className="text-sm text-destructive text-center">
            Campaign is not active for contributions.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
