"use client";

import { CampaignCard } from "@/components/custom/campaign/CampaignCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Frown } from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CampaignData } from "@/types/campaign";

export function FeaturedCampaigns() {
  const {
    data: campaigns = [],
    isLoading,
    error,
  } = useCampaigns();

  const featuredCampaigns = campaigns
    .filter((c: CampaignData) => c.status === "Ongoing")
    .sort((a, b) => Number(b.deadline - a.deadline))
    .slice(0, 3);

  if (isLoading) {
    return (
      <section className="container py-16">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container py-16">
        <Alert variant="destructive">
          <Frown className="h-4 w-4" />
          <AlertTitle>Error fetching campaigns!</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again later."}
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  if (featuredCampaigns.length === 0) {
    return (
      <section className="container py-16 text-center text-muted-foreground">
        <p>No featured campaigns available at the moment. Be the first to launch one!</p>
        <Button asChild className="mt-4">
          <Link href="/create">Create Your Campaign</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="container py-16">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCampaigns.map((campaign: CampaignData) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold tracking-tight">Featured Campaigns</h2>
      <Button asChild variant="ghost">
        <Link href="/campaigns">
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
