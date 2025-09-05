import { useMemo } from "react";
import { Abi, Address } from "viem";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import campaignFactoryAbi from "@/abis/CampaignFactory.json";
import campaignAbi from "@/abis/Campaign.json";
import { CONTRACT_ADDRESSES } from "@/abis/address";
import { mapCampaign } from "@/lib/mappers";
import { CampaignData } from "@/types/campaign";
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
interface UserContribution {
    campaign : CampaignData,
    amount : bigint
}
const FACTORY_ADDRESS = CONTRACT_ADDRESSES.localhost.CampaignFactory as Address;
export function useUserContributions() {
  const {address, isConnected} = useAccount();
  // 1. Lấy toàn bộ campaign address
  const { data : allCampaigns = [], isLoading : loadingCampaigns, error : errorCampaigns} = useReadContract({
    address : FACTORY_ADDRESS,
    abi : campaignFactoryAbi.abi,
    functionName : "getCampaigns",
    query : {enabled : isConnected && !!address}
  });
  // 2. Lấy contributions của user cho từng campaign
  const {
    data: userContributionAmounts = [],
    isLoading: loadingAmounts,
    error: errorAmounts,
  } = useReadContracts({
    contracts: (allCampaigns as Address[]).map((c) => ({
      address: c,
      abi: campaignAbi.abi as Abi,
      functionName: "contributions" as const,
      args: [address!],
    })),
    query: { enabled: isConnected && !!address },
  });
  // Chỉ giữ lại những user có amount > 0
  const relevantCampaigns = useMemo(() => {
      return (allCampaigns as Address[]).filter((_,i) => {
        const amount = userContributionAmounts?.[i].result as bigint | undefined;
        return amount && amount > BigInt(0);
      })
  }, [allCampaigns,userContributionAmounts])
  // 4.Lấy summary cho các campaign đó
  const {
    data: summaries = [],
    isLoading: loadingSummaries,
    error: errorSummaries,
  } = useReadContracts({
    contracts : relevantCampaigns.map((addr) => ({
      address : addr,
      abi : campaignAbi.abi as Abi,
      functionName : "getSummary" as const,
    })),
    query : { enabled : relevantCampaigns.length > 0}
  });
  // Map dữ liệu về cho UserContribution
  const contributions : UserContribution[] = useMemo(() => {
    return summaries.map((res,i) => {
      if(res.status !== "success") return null;
      const summary = res.result as CampaignSummaryRawResult;
      const campaignAddr = relevantCampaigns[i];
      const amount = userContributionAmounts?.[
        (allCampaigns as Address[]).indexOf(campaignAddr)
      ]?.result as bigint ;
      if(!summary || !amount || amount === BigInt(0)) return null;
      const campaignData = mapCampaign(summary, campaignAddr);
      return { campaign : campaignData, amount};
    }).filter(Boolean) as UserContribution[]
  },[summaries, relevantCampaigns, userContributionAmounts, allCampaigns]);
  return {
    contributions,
    loading: loadingCampaigns || loadingAmounts || loadingSummaries,
    error: errorCampaigns || errorAmounts || errorSummaries,
  };
}
