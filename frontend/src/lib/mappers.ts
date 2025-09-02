import { Address } from "viem";
import { CampaignData, CampaignStatus, getCampaignStatus, RequestData } from "@/types/campaign";

type CampaignSummaryRawResult = [
  Address,  
  string,   
  bigint,   
  bigint,   
  string,   
  bigint,   
  bigint,   
  bigint,   
  bigint    
];

export function mapCampaign(
  summaryRawResult: CampaignSummaryRawResult,
  campaignAddress: Address
): CampaignData {
  const [
    owner,
    title,
    goal,
    deadline,
    metaDataURI,
    totalRaised,
    contributorCount,
    requestCount,
    minimumContribution, 
  ] = summaryRawResult;

  const status = getCampaignStatus(deadline, goal, totalRaised);

  return {
    id: campaignAddress,
    owner: owner,
    title: title,
    metaDataURI: metaDataURI,
    goal: goal,
    deadline: deadline,
    totalRaised: totalRaised,
    contributorCount: contributorCount,
    requestCount: requestCount,
    minimumContribution: minimumContribution,
    status: status,
    description: "Loading detailed description from IPFS...",
    imageUrl: "/placeholder.png",
  };
}
type RequestRawResult = [
  string,   
  bigint,   
  Address,  
  bigint,   
  boolean   
];
export function mapRequest(
  requestRawResult: RequestRawResult,
  requestId: number,
  campaignTotalRaised: bigint, 
  hasApproved: boolean = false 
): RequestData {
  const [description, amount, recipient, approvalCount, complete] = requestRawResult;


  const requiredApprovals = campaignTotalRaised / BigInt(2);
  const percentageApprovals = requiredApprovals > BigInt(0) ? Number((approvalCount * BigInt(100)) / requiredApprovals) : 0;

  return {
    id: requestId,
    description: description,
    amount: amount,
    recipient: recipient,
    approvalCount: approvalCount,
    complete: complete,
    hasApproved: hasApproved,
    percentageApprovals: percentageApprovals > 100 ? 100 : percentageApprovals,
  };
}