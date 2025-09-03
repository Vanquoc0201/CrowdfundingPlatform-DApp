import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

let pinata: pinataSDK | undefined;

if (PINATA_API_KEY && PINATA_SECRET_API_KEY) {
  pinata = new pinataSDK({ pinataApiKey: PINATA_API_KEY, pinataSecretApiKey: PINATA_SECRET_API_KEY });
} else if (PINATA_JWT) {
  pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT });
} else {
  console.error("PINATA_API_KEY/SECRET_API_KEY or PINATA_JWT is not defined. IPFS JSON upload will not work.");
}

export async function POST(req: NextRequest) {
  if (!pinata) {
    return NextResponse.json({ error: "Pinata SDK not initialized. Server misconfiguration." }, { status: 500 });
  }

  try {
    const { json, name } = await req.json(); 
    if (!json || !name) {
      return NextResponse.json({ error: "Missing 'json' or 'name' in request body." }, { status: 400 });
    }

    const options = {
      pinataMetadata: {
        name: name,
      },
    };

    const result = await pinata.pinJSONToIPFS(json, options);

    return NextResponse.json({ ipfsHash: result.IpfsHash, ipfsUrl: `ipfs://${result.IpfsHash}` }, { status: 200 });

  } catch (error: any) {
    console.error("Error uploading JSON to Pinata via API Route:", error);
    return NextResponse.json({ error: error.message || "Failed to upload JSON to IPFS." }, { status: 500 });
  }
}