import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Shadcn/ui Avatar
import { useUserNftBadges } from "@/hooks/useUserNftBadges";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Frown, Sparkles } from "lucide-react";

export function MyNftBadges() {
  const { badges, loading, error } = useUserNftBadges();

  if (loading) return <p className="text-center text-muted-foreground">Loading your NFT badges...</p>;
  if (error) return <Alert variant="destructive"><Frown className="h-4 w-4" /><AlertTitle>Error loading NFT badges!</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;

  if (badges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your NFT Badges</CardTitle>
          <CardDescription>Unique collectibles proving your support.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">You haven't minted any NFT badges yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Contribute to a campaign to earn one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your NFT Badges ({badges.length})</CardTitle>
        <CardDescription>Unique collectibles proving your support.</CardDescription>
      </CardHeader>
      <CardContent>
         <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Note on NFT Badges</AlertTitle>
          <AlertDescription>
            This section uses mock data. To display real NFT badges, you would deploy an ERC721 contract and index 'Transfer' events (e.g., with The Graph) or use the contract's 'balanceOf' and 'tokenOfOwnerByIndex' functions.
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {badges.map((badge) => (
            <Card key={Number(badge.id)} className="text-center p-4">
              <Avatar className="h-24 w-24 mx-auto mb-3">
                <AvatarImage src={badge.imageUrl} alt={badge.name} />
                <AvatarFallback><Sparkles /></AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{badge.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {Number(badge.id)}</p>
              {/* <p className="text-xs text-muted-foreground">Contract: {badge.contractAddress.slice(0, 6)}...</p> */}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}