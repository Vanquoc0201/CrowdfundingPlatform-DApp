import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream'; 


const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_JWT = process.env.PINATA_JWT; 

let pinata: pinataSDK | undefined;

if (PINATA_API_KEY && PINATA_SECRET_API_KEY) {
  pinata = new pinataSDK({ pinataApiKey: PINATA_API_KEY, pinataSecretApiKey: PINATA_SECRET_API_KEY });
} else if (PINATA_JWT) {
  pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT });
} else {
  console.error("PINATA_API_KEY/SECRET_API_KEY or PINATA_JWT is not defined. IPFS upload will not work.");
}

export async function POST(req: NextRequest) {
  if (!pinata) {
    return NextResponse.json({ error: "Pinata SDK not initialized. Server misconfiguration." }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string | null; 

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); 
    const options = {
      pinataMetadata: {
        name: name || file.name,
      },
    };

    const result = await pinata.pinFileToIPFS(readableStream, options);

    return NextResponse.json({ ipfsHash: result.IpfsHash, ipfsUrl: `ipfs://${result.IpfsHash}` }, { status: 200 });

  } catch (error: any) {
    console.error("Error uploading to Pinata via API Route:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file to IPFS." }, { status: 500 });
  }
}