import { CampaignData } from "@/types/campaign";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CampaignCard } from "@/components/custom/campaign/CampaignCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface MyCampaignsListProps {
  campaigns: CampaignData[];
  loading: boolean;
  error: string | null;
}

export function MyCampaignsList({ campaigns, loading, error }: MyCampaignsListProps) {
  if (loading) return <p className="text-center text-muted-foreground">Loading your campaigns...</p>;
  if (error) return <p className="text-destructive text-center">{error}</p>;

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Campaigns</CardTitle>
          <CardDescription>Campaigns you have launched.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">You haven't launched any campaigns yet.</p>
          <Button asChild>
            <Link href="/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Start Your First Campaign
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Campaigns ({campaigns.length})</CardTitle>
        <CardDescription>Campaigns you have launched.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}