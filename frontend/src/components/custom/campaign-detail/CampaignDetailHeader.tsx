import { CampaignData } from "@/types/campaign";
import { Badge } from "@/components/ui/badge";
import { formatEther } from "viem";
import { formatTimeLeft } from "@/lib/utils";

interface CampaignDetailHeaderProps {
    campaign : CampaignData
}
export function CampaignDetailHeader({ campaign } : CampaignDetailHeaderProps) {
    let statusVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
    switch(campaign.status) {
        case "Ongoing":
            statusVariant = "default";
            break;
        case "Successful":
            statusVariant = "secondary";
            break;
        case "Failed":
            statusVariant = "destructive";
            break;
    }
    const progress = Number((campaign.totalRaised * BigInt(100)) / campaign.goal);
    return (
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex-1 space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    {campaign.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                    Managed by:{" "}
                    <span className="font-mono text-primary">
                    {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
                    </span>
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <Badge variant={statusVariant}>{campaign.status}</Badge>
                <Badge variant="outline">{formatTimeLeft(campaign.deadline)}</Badge>
            </div>
        </div>
    )
}