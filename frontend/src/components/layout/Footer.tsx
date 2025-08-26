import Link from "next/link";
import { cn } from "@/lib/utils";
import { Twitter, MessageCircle, Globe } from "lucide-react"; 

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>&copy; {currentYear} Crowdfund DApp. All rights reserved.</p>

        <nav className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </nav>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://twitter.com/yourdapp" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="https://discord.gg/yourdapp" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Discord"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <a
            href="https://yourdapp.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Website"
          >
            <Globe className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}