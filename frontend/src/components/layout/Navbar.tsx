
import Link from "next/link";
import { cn } from "@/lib/utils"; 
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Rocket, Home, PlusCircle, LayoutDashboard, ListTodo } from "lucide-react"; 
import { ModeToggle } from "../theme/modetoggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo / Site Title */}
        <Link href="/" className="flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="inline-block font-bold text-lg">Crowdfund DApp</span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-6">
          <NavLink href="/">
            <Home className="mr-2 h-4 w-4" /> Home
          </NavLink>
          <NavLink href="/campaigns">
            <ListTodo className="mr-2 h-4 w-4" /> Campaigns
          </NavLink>
          <NavLink href="/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Campaign
          </NavLink>
          <NavLink href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </NavLink>
        </div>

        {/* Right Section: Wallet Connect & Theme Toggle */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center text-sm font-medium transition-colors hover:text-primary",
      )}
    >
      {children}
    </Link>
  );
};