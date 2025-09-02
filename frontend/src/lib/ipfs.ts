
interface IpfsMetadata {
  description: string;
  imageUrl: string;
  [key: string]: any;
}

const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export async function fetchIpfsMetadata(metaDataURI: string): Promise<IpfsMetadata | null> {
  if (!metaDataURI || metaDataURI.trim() === "") {
    return null;
  }
  const url = metaDataURI.startsWith("ipfs://")
    ? metaDataURI.replace("ipfs://", PINATA_GATEWAY)
    : `${PINATA_GATEWAY}${metaDataURI}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch IPFS metadata from ${url}: ${response.statusText}`);
      return null;
    }
    const data: IpfsMetadata = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching IPFS metadata for ${metaDataURI}:`, error);
    return null;
  }
}