// src/hooks/useCampaigns.ts
import { Abi, Address } from "viem";
import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import campaignfactoryabi from "@/abis/CampaignFactory.json";
import campaignabi from "@/abis/Campaign.json";
import { CampaignData } from "@/types/campaign";
import { mapCampaign } from "@/lib/mappers";
import { CONTRACT_ADDRESSES } from "@/abis/address";

const FACTORY_ADDRESS = CONTRACT_ADDRESSES.localhost.CampaignFactory as Address;
const factoryABI = campaignfactoryabi.abi;
const campaignABI = campaignabi.abi;

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

export function useCampaigns() {
  const client = usePublicClient();

  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async (): Promise<CampaignData[]> => {
      if (!client) {
        throw new Error("Web3 client not ready. Please connect your wallet or check network.");
      }

      const addresses = (await client.readContract({
        address: FACTORY_ADDRESS,
        abi: factoryABI,
        functionName: "getCampaigns",
      })) as Address[];

      if (!addresses || addresses.length === 0) return [];

      const multicallResult = await client.multicall({
        contracts: addresses.map((addr) => ({
          address: addr,
          abi: campaignABI as Abi,
          functionName: "getSummary",
        })),
        allowFailure: true, 
      });

      const mappedCampaigns: CampaignData[] = [];
      multicallResult.forEach((res, idx) => {
        if (res.status === "success" && res.result) {
          mappedCampaigns.push(
            mapCampaign(res.result as CampaignSummaryRawResult, addresses[idx])
          );
        }
      });

      return mappedCampaigns;
    },
    staleTime: 10_000, 
    refetchOnWindowFocus: false, 
  });
}
