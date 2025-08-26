import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center text-center px-4 py-16 md:py-24 bg-gradient-to-br from-primary/10 to-background">
      <div className="max-w-4xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Fuel Your Ideas. <br className="hidden md:inline" />Fund the Future. <span className="text-primary">Decentralized.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          A transparent and secure crowdfunding platform powered by Web3.
          Support innovative projects or launch your own, with every contribution recorded on-chain.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <Button asChild size="lg" className="px-8 py-6 text-base md:text-lg">
            <Link href="/campaigns">Explore Campaigns</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-base md:text-lg group">
            <Link href="/create">
              Start Your Own Campaign <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}