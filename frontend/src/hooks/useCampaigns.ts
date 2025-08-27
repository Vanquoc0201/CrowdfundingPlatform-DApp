import { useEffect, useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import campaignfactoryabi from "@/abis/CampaignFactory.json"; 
import campaignabi from "@/abis/Campaign.json";            
import { CampaignData } from "@/types/campaign";          
import { mapCampaign } from "@/lib/mappers";             
import { CONTRACT_ADDRESSES } from "@/abis/address";       

const FACTORY_ADDRESS = CONTRACT_ADDRESSES.localhost.CampaignFactory as Address;
const factoryABI = campaignfactoryabi.abi;
const campaignABI = campaignabi.abi;

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = usePublicClient();

  useEffect(() => {
    let mounted = true;

    async function fetchCampaigns() {
      try {
        setLoading(true);
        setError(null);

        if (!client) {
          if (mounted) {
            setError("Web3 client not ready. Please connect your wallet or check network.");
            setLoading(false);
          }
          return;
        }

        const addresses = (await client.readContract({
          address: FACTORY_ADDRESS,
          abi: factoryABI,
          functionName: "getCampaigns",
        })) as Address[];

        if (!addresses || addresses.length === 0) {
          if (mounted) setCampaigns([]);
          return;
        }

        const summariesPromises = addresses.map((addr: Address) =>
          client.readContract({
            address: addr,
            abi: campaignABI,
            functionName: "getSummary",
          }).catch((e) => {
            console.error(`Failed to read contract summary for ${addr}:`, e);
            return undefined; 
          })
        );

        const summaries = await Promise.all(summariesPromises);

        const mappedCampaigns: CampaignData[] = [];
        for (let i = 0; i < summaries.length; i++) {
          const res = summaries[i];
          const address = addresses[i];
          if (res !== undefined && address) {
            mappedCampaigns.push(mapCampaign(res as [Address, string, bigint, bigint, string, bigint, bigint, bigint], address));
          }
        }

        if (mounted) setCampaigns(mappedCampaigns);
      } catch (err) {
        if (mounted) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch campaigns";
          setError(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCampaigns();

    return () => {
      mounted = false;
    };
  }, [client]);

  return { campaigns, loading, error };
}