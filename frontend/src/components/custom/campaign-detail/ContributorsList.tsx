import { CampaignData } from "@/types/campaign";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatEther } from "viem";
import { Link2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ContributorsListProps {
  campaign: CampaignData;
}

const mockContributors = [
  { address: "0x123...abc" as `0x${string}`, amount: BigInt(0.5 * 10**18) },
  { address: "0x456...def" as `0x${string}`, amount: BigInt(0.2 * 10**18) },
  { address: "0x789...ghi" as `0x${string}`, amount: BigInt(1 * 10**18) },
];


export function ContributorsList({ campaign }: ContributorsListProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributors ({Number(campaign.contributorCount)})</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Note on Contributors List</AlertTitle>
          <AlertDescription>
            This list currently uses mock data. To display real contributors, you would typically use a Web3 indexing solution like **The Graph** to track 'Contributed' events from the smart contract.
          </AlertDescription>
        </Alert>

        {campaign.contributorCount === BigInt(0) ? (
          <p className="text-muted-foreground mt-4">Be the first to contribute to this campaign!</p>
        ) : (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockContributors.map((contributor, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link
                      href={`https://sepolia.etherscan.io/address/${contributor.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-primary transition-colors"
                    >
                      {contributor.address.slice(0, 6)}...{contributor.address.slice(-4)}
                      <Link2 className="ml-2 h-3 w-3" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{formatEther(contributor.amount)} ETH</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}