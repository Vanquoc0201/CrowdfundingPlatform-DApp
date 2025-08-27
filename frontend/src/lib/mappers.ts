import { Address } from "viem";
import { CampaignData, getCampaignStatus } from "@/types/campaign"; 

type CampaignSummaryRawResult = [
  Address, 
  string,  
  bigint,  
  bigint,  
  string,   
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
    goalWei,
    deadlineTs,
    metaDataURI,
    totalRaised,
    contributorCount,
    requestCount,
  ] = summaryRawResult;

  const status = getCampaignStatus(deadlineTs, goalWei, totalRaised);

  return {
    id: campaignAddress,     
    owner: owner,
    title: title,
    metaDataURI: metaDataURI, 
    goal: goalWei,
    deadline: deadlineTs,
    totalRaised: totalRaised,
    contributorCount: contributorCount,
    requestCount: requestCount,
    status: status,
    description: "Loading description from IPFS...",
    imageUrl: "/placeholder.png",
  };
}