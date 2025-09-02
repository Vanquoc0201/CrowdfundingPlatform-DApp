"use client";

import { useParams } from "next/navigation"; 
import { Address } from "viem";
import { CampaignDetailHeader } from "@/components/custom/campaign-detail/CampaignDetailHeader";
import { CampaignInfoSection } from "@/components/custom/campaign-detail/CampaignInfoSection";
import { ContributeForm } from "@/components/custom/campaign-detail/ContributeForm";
import { FundRequestsSection } from "@/components/custom/campaign-detail/FundRequestsSection";
import { ContributorsList } from "@/components/custom/campaign-detail/ContributorsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown } from "lucide-react";
import { useCampaignDetail } from "@/hooks/useCampaignDetail";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignAddress = params.id as Address; 

  const { campaign, loading, error } = useCampaignDetail(campaignAddress);
  if (loading) {
    return (
      <section className="container py-16 md:py-20">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />  
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-96 w-full" /> 
              <Skeleton className="h-8 w-1/4" />    
              <Skeleton className="h-24 w-full" />  
            </div>
            <div className="md:col-span-1 space-y-4">
              <Skeleton className="h-64 w-full" /> 
              <Skeleton className="h-48 w-full" /> 
            </div>
          </div>
          <Skeleton className="h-64 w-full mt-8" /> 
          <Skeleton className="h-64 w-full mt-8" /> 
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container py-16 md:py-20">
        <Alert variant="destructive">
          <Frown className="h-4 w-4" />
          <AlertTitle>Error loading campaign details!</AlertTitle>
          <AlertDescription>
            {error}. Please check the campaign address and your network connection.
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  if (!campaign) {
    return (
      <section className="container py-16 md:py-20 text-center text-muted-foreground">
        <p className="text-lg">Campaign not found.</p>
      </section>
    );
  }

  return (
    <section className="container py-16 md:py-20">
      <CampaignDetailHeader campaign={campaign} />

      <CampaignInfoSection campaign={campaign} />

      {/* Contribute Form */}
      <div className="mt-12">
        <ContributeForm
          campaignAddress={campaign.id}
          campaignStatus={campaign.status}
          minimumContribution={BigInt(1)} 
        />
      </div>

      {/* Fund Requests (Voting) Section */}
      <div className="mt-12">
        <FundRequestsSection campaign={campaign} />
      </div>

      {/* Contributors List */}
      <div className="mt-12">
        <ContributorsList campaign={campaign} />
      </div>
    </section>
  );
}