import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import campaignabi from "@/abis/Campaign.json";
import { CampaignData } from "@/types/campaign";
import { mapCampaign } from "@/lib/mappers";
import { fetchIpfsMetadata } from "@/lib/ipfs";

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

export function useCampaignDetail(campaignAddress: Address | undefined) {
  const client = usePublicClient();

  const {
    data: campaign,
    isLoading,
    isError,
    error,
  } = useQuery<CampaignData>({
    queryKey: ["campaignDetail", campaignAddress],
    enabled: !!campaignAddress && !!client,
    queryFn: async () => {
      if (!campaignAddress || !client) {
        throw new Error("Campaign address or Web3 client not ready.");
      }

      const summaryRawResult = (await client.readContract({
        address: campaignAddress,
        abi: campaignabi.abi,
        functionName: "getSummary",
      })) as CampaignSummaryRawResult;

      let mappedCampaign = mapCampaign(summaryRawResult, campaignAddress);

      if (mappedCampaign.metaDataURI) {
        try {
          const ipfsMetadata = await fetchIpfsMetadata(mappedCampaign.metaDataURI);
          mappedCampaign = {
            ...mappedCampaign,
            description: ipfsMetadata?.description || mappedCampaign.description,
            imageUrl: ipfsMetadata?.imageUrl || mappedCampaign.imageUrl,
          };
        } catch (e) {
          console.warn("Failed to fetch IPFS metadata:", e);
        }
      }

      return mappedCampaign;
    },
    staleTime: 60_000,
  });

  return {
    campaign,
    loading: isLoading,
    error: isError ? (error instanceof Error ? error.message : "Unknown error") : null,
  };
}
