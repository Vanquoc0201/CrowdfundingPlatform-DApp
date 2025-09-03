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

export async function uploadFileToIpfs(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name); 

    const response = await fetch('/api/upload-ipfs', { 
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload file to IPFS via API.");
    }

    const data = await response.json();
    return data.ipfsUrl; 
  } catch (error) {
    console.error("Error uploading file to Pinata via API Route from frontend:", error);
    throw error;
  }
}

export async function uploadJsonToIpfs(json: object, name: string): Promise<string> {
    try {
        const response = await fetch('/api/upload-ipfs-json', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ json, name }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to upload JSON to IPFS via API.");
        }

        const data = await response.json();
        return data.ipfsUrl;
    } catch (error) {
        console.error("Error uploading JSON to Pinata via API Route from frontend:", error);
        throw error;
    }
}