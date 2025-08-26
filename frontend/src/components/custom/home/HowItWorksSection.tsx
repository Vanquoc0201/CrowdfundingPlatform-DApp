import { Sparkles, HandCoins, UserCheck, Gavel } from "lucide-react"; 

const steps = [
  {
    icon: Sparkles,
    title: "Create Campaign",
    description: "Propose your project, set funding goals, and define a timeline. All transparently on-chain with IPFS metadata.",
  },
  {
    icon: HandCoins,
    title: "Contribute Crypto",
    description: "Support projects you believe in by contributing ETH or other cryptocurrencies directly to the smart contract.",
  },
  {
    icon: Gavel, // Hoặc một icon khác như Vote
    title: "Community Governance",
    description: "Participate in decentralized decision-making. Vote on fund release requests to ensure accountability.",
  },
  {
    icon: UserCheck, // Hoặc một icon khác như Award
    title: "Receive NFT Badge",
    description: "Get a unique NFT badge as a proof of your contribution and unlock special voting rights.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="container py-16">
      <h2 className="text-3xl font-bold tracking-tight text-center mb-12">How Our Platform Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <step.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}