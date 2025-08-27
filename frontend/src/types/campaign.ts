import { Address } from "viem";

export type CampaignStatus = "Ongoing" | "Successful" | "Failed";

export interface CampaignData {
  id: Address;          
  owner: Address;       
  title: string;        
  metaDataURI: string;  
  goal: bigint;     
  deadline: bigint;  
  totalRaised: bigint;  
  contributorCount: bigint;
  requestCount: bigint;
  description: string;  
  imageUrl: string;     
  status: CampaignStatus; 
}

export interface RequestData {
  id: number;           
  amount: bigint;
  recipient: Address;
  approvalCount: bigint; 
  complete: boolean;
}

export function getCampaignStatus(
  deadlineTs: bigint,
  goalWei: bigint,
  totalRaised: bigint
): CampaignStatus {
  const currentTime = BigInt(Math.floor(Date.now() / 1000));

  if (currentTime >= deadlineTs) { 
    if (totalRaised >= goalWei) {
      return "Successful";
    } else {
      return "Failed";
    }
  }
  return "Ongoing"; 
}