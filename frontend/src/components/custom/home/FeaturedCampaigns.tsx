import { CampaignCard } from "@/components/custom/campaign/CampaignCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


const mockCampaigns = [
  {
    id: 1,
    owner: "0xABC...123" as `0x${string}`,
    name: "Eco-Friendly Blockchain Farm",
    description: "Developing a sustainable farming solution on the blockchain.",
    imageUrl: "https://via.placeholder.com/400x250/336699/FFFFFF?text=EcoFarm",
    goal: BigInt(5 * 10**18), // 5 ETH
    amountRaised: BigInt(3 * 10**18), // 3 ETH
    // !!! Dòng này cần thay đổi !!!
    deadline: BigInt(Math.floor(Date.now() / 1000) + 5 * 24 * 3600), // 5 ngày nữa, dùng Math.floor()
    status: "Ongoing",
  },
  {
    id: 2,
    owner: "0xDEF...456" as `0x${string}`,
    name: "Web3 Art Gallery & DAO",
    description: "A decentralized platform for artists to showcase and sell NFTs.",
    imageUrl: "https://via.placeholder.com/400x250/993366/FFFFFF?text=ArtGallery",
    goal: BigInt(10 * 10**18), // 10 ETH
    amountRaised: BigInt(8 * 10**18), // 8 ETH
    // !!! Dòng này cần thay đổi !!!
    deadline: BigInt(Math.floor(Date.now() / 1000) + 10 * 24 * 3600), // 10 ngày nữa, dùng Math.floor()
    status: "Ongoing",
  },
  {
    id: 3,
    owner: "0xGHI...789" as `0x${string}`,
    name: "Decentralized Education Platform",
    description: "Connecting students and educators globally with tokenized incentives.",
    imageUrl: "https://via.placeholder.com/400x250/669933/FFFFFF?text=EduDApp",
    goal: BigInt(7 * 10**18), // 7 ETH
    amountRaised: BigInt(7.5 * 10**18), // 7.5 ETH (đã vượt mục tiêu)
    deadline: BigInt(Math.floor(Date.now() / 1000) - 2 * 24 * 3600), // Đã kết thúc, dùng Math.floor()
    status: "Successful",
  },
] as const;


export function FeaturedCampaigns() {


  return (
    <section className="container py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Featured Campaigns</h2>
        <Button asChild variant="ghost">
          <Link href="/campaigns">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </section>
  );
}