"use client";

import { useAccount } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown, WalletMinimal } from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { DashboardOverview } from "@/components/custom/dashboard/DashboardOverview";
import { MyCampaignsList } from "@/components/custom/dashboard/MyCampaignsList";
import { MyContributionsList } from "@/components/custom/dashboard/MyContributionsList";
import { MyNftBadges } from "@/components/custom/dashboard/MyNftBadges";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const {
    data: campaigns = [],
    isLoading,
    error,
  } = useCampaigns();

  const myCreatedCampaigns = campaigns.filter((c) => c.owner === address);

  // Wallet chưa connect
  if (!isConnected) {
    return (
      <section className="container py-16 md:py-20 text-center">
        <Card className="max-w-xl mx-auto p-6 border-destructive">
          <CardHeader>
            <WalletMinimal className="h-10 w-10 text-destructive mx-auto mb-4" />
            <CardTitle>Wallet Not Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Please connect your wallet to view your personal dashboard.
            </CardDescription>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Đang loading
  if (isLoading) {
    return (
      <section className="container py-16 md:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12">
          Your Dashboard
        </h1>
        <p className="text-center text-muted-foreground">
          Loading your dashboard...
        </p>
      </section>
    );
  }

  // Bị lỗi
  if (error) {
    return (
      <section className="container py-16 md:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12">
          Your Dashboard
        </h1>
        <Alert variant="destructive">
          <Frown className="h-4 w-4" />
          <AlertTitle>Error loading dashboard data!</AlertTitle>
          <AlertDescription>
            {String(error)}. Please try again later or check your network
            connection.
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  return (
    <section className="container py-16 md:py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12">
        Your Dashboard
      </h1>

      {/* Overview Section */}
      <DashboardOverview
        userAddress={address}
        createdCampaigns={myCreatedCampaigns}
      />

      {/* Your Campaigns List */}
      <div className="mt-12">
        <MyCampaignsList
          campaigns={myCreatedCampaigns}
          loading={isLoading}
          error={error ? String(error) : null}
        />
      </div>

      {/* Your Contributions List */}
      <div className="mt-12">
        <MyContributionsList />
      </div>

      {/* Your NFT Badges */}
      <div className="mt-12">
        <MyNftBadges />
      </div>
    </section>
  );
}
