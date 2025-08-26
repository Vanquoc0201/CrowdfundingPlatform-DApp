import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatEther } from "viem"; 
import { Timer, Goal } from "lucide-react"; 

interface CampaignData {
  id: number;
  owner: `0x${string}`;
  name: string;
  description: string;
  imageUrl: string;
  goal: bigint;
  amountRaised: bigint;
  deadline: bigint;
  status: 'Ongoing' | 'Successful' | 'Failed';
}

interface CampaignCardProps {
  campaign: CampaignData;
}


const formatTimeLeft = (deadline: bigint): string => {
  const timeLeftSeconds = Number(deadline) - Math.floor(Date.now() / 1000);
  if (timeLeftSeconds <= 0) return "Ended";

  const days = Math.floor(timeLeftSeconds / (3600 * 24));
  const hours = Math.floor((timeLeftSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeftSeconds % 3600) / 60);

  if (days > 0) return `${days} days left`;
  if (hours > 0) return `${hours} hours left`;
  return `${minutes} minutes left`;
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Number((campaign.amountRaised * BigInt(100)) / campaign.goal);
  const formattedGoal = formatEther(campaign.goal);
  const formattedAmountRaised = formatEther(campaign.amountRaised);
  const timeLeft = formatTimeLeft(campaign.deadline);

  let statusVariant: "default" | "secondary" | "destructive" | "outline" | null = null;
  switch (campaign.status) {
    case 'Ongoing':
      statusVariant = "default";
      break;
    case 'Successful':
      statusVariant = "secondary"; // Có thể dùng "success" nếu bạn tạo variant đó
      break;
    case 'Failed':
      statusVariant = "destructive";
      break;
  }

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden mb-4">
          {campaign.imageUrl ? (
            <img
              src={campaign.imageUrl}
              alt={campaign.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <CardTitle className="text-lg line-clamp-1">{campaign.name}</CardTitle>
        <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Goal className="h-4 w-4 mr-1" /> Goal: {formattedGoal} ETH
          </div>
          <Badge variant={statusVariant || "outline"}>{campaign.status}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{formattedAmountRaised} ETH Raised</span>
          <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <Timer className="h-4 w-4 mr-1" /> {timeLeft}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/campaign/${campaign.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}