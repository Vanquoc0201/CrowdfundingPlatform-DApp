import { CampaignData } from "@/types/campaign";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CampaignCard } from "@/components/custom/campaign/CampaignCard";
import { useUserContributions } from "@/hooks/useUserContributions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Frown } from "lucide-react";

interface MyContributionsListProps {
  // campaigns: CampaignData[]; // Không cần prop này, hook tự fetch
}

export function MyContributionsList() {
  const { contributions, loading, error } = useUserContributions();

  if (loading) return <p className="text-center text-muted-foreground">Loading your contributions...</p>;
  if (error) return <Alert variant="destructive"><Frown className="h-4 w-4" /><AlertTitle>Error loading contributions!</AlertTitle><AlertDescription>{error?.message}</AlertDescription></Alert>;

  if (contributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Contributions</CardTitle>
          <CardDescription>Campaigns you have supported.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">You haven't contributed to any campaigns yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Contributions ({contributions.length})</CardTitle>
        <CardDescription>Campaigns you have supported.</CardDescription>
      </CardHeader>
      <CardContent>
         <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Note on Contributions</AlertTitle>
          <AlertDescription>
            This list is fetched by checking your individual contribution for each known campaign. For very large numbers of campaigns, a Web3 indexing solution like **The Graph** would be more efficient.
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributions.map((item) => (
            <CampaignCard key={item.campaign.id} campaign={item.campaign} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}