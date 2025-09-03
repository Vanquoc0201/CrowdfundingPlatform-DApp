"use client"; 

import { CreateCampaignForm } from "@/components/custom/create-campaign/CreateCampaignForm";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WalletMinimal } from "lucide-react";

export default function CreateCampaignPage() {
  const { isConnected } = useAccount();

  return (
    <section className="container py-16 md:py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-12">
        Start Your Journey
      </h1>

      {!isConnected && (
        <Card className="max-w-xl mx-auto text-center p-6 mb-8 border-destructive">
          <CardHeader>
            <WalletMinimal className="h-10 w-10 text-destructive mx-auto mb-4" />
            <CardTitle>Wallet Not Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Please connect your wallet to launch a new crowdfunding campaign.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      <CreateCampaignForm />
    </section>
  );
}