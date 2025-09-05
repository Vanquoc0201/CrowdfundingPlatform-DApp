import { resolve } from "path";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
export interface NftBadgeData {
    id: bigint,
    name : string,
    imageUrl : string,
    contractAddress : Address,
}
export function useUserNftBadges() {
    const {address, isConnected} = useAccount();
    const [badges, setBadges] = useState<NftBadgeData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function fetchBadge() {
            if(!isConnected || !address) {
                if(mounted){
                    setBadges([]);
                    setLoading(false);
                    setError(null);
                }
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const mockBadges: NftBadgeData[] = [
                    {
                        id: BigInt(101),
                        name: "Early Contributor",
                        imageUrl:
                        "https://via.placeholder.com/100/FF5733/FFFFFF?text=EC",
                        contractAddress: "0xMockNftContract" as Address,
                    },
                    {
                        id: BigInt(102),
                        name: "Big Supporter",
                        imageUrl:
                        "https://via.placeholder.com/100/33FF57/FFFFFF?text=BS",
                        contractAddress: "0xMockNftContract" as Address,
                    },
                ];
                // Giả lập delay khi fetch
                await new Promise((resolve) => setTimeout(resolve, 1000));
                if(mounted) {
                    setBadges(mockBadges);
                    setLoading(false);
                }
            } catch(err : any) {
                if (mounted) {
                    setError(err.message || "Failed to fetch NFT badges");
                    setLoading(false);
                }
            }
        }
        fetchBadge();
        return () => {
            mounted = false;
        }
    },[isConnected, address]);
    return { badges, loading, error};
}