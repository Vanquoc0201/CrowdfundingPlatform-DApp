import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Rocket, Users } from "lucide-react";
import { Address, formatEther } from "viem";
import { CampaignData } from "@/types/campaign";
import { useUserContributions } from "@/hooks/useUserContributions";
interface DashboardOverviewProps {
    userAddress : Address | undefined;
    createdCampaigns : CampaignData[];
}
export function DashboardOverview({userAddress, createdCampaigns} : DashboardOverviewProps){
    const { contributions } = useUserContributions();

    const totalContributed = contributions.reduce((sum,c) => sum + c.amount, BigInt(0));
    return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Address</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'N/A'}</div>
          <p className="text-xs text-muted-foreground">
            Connected Wallet
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Campaigns Created</CardTitle>
          <Rocket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{createdCampaigns.length}</div>
          <p className="text-xs text-muted-foreground">
            Total campaigns you launched
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contributed</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatEther(totalContributed)} ETH</div>
          <p className="text-xs text-muted-foreground">
            Across all campaigns
          </p>
        </CardContent>
      </Card>
    </div>
  );
}