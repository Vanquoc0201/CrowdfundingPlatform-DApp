import { CampaignData } from "@/types/campaign";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatEther } from "viem";
import { Users, DollarSign, CalendarDays } from "lucide-react";


interface CampaignInfoSectionProps {
  campaign: CampaignData;
}

export function CampaignInfoSection({ campaign }: CampaignInfoSectionProps) {
  const progress = Number((campaign.totalRaised * BigInt(100)) / campaign.goal);
  const formattedGoal = formatEther(campaign.goal);
  const formattedAmountRaised = formatEther(campaign.totalRaised);

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Campaign Image / Description */}
      <div className="md:col-span-2 space-y-6">
        <div className="relative w-full h-[300px] md:h-[400px] bg-muted rounded-lg overflow-hidden">
          {campaign.imageUrl ? (
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground text-xl">
              No Campaign Image
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold">Description</h2>
        <p className="text-muted-foreground whitespace-pre-line">
          {campaign.description} {/* Hiển thị description đã fetch */}
        </p>
      </div>

      {/* Funding Details Card */}
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Funding Progress</CardTitle>
            <CardDescription>
              Goal: {formattedGoal} ETH
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm">
              <span className="font-semibold">{formattedAmountRaised} ETH Raised</span>
              <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" /> {Number(campaign.contributorCount)} Contributors
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-2" /> Deadline: {new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}