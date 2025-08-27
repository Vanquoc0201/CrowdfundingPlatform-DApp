import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  hardhat,
  sepolia, 

} from 'wagmi/chains';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY; 


if (!walletConnectProjectId) {
  console.error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined.");
  throw new Error("WalletConnect Project ID is required.");
}
export const chains = [
  sepolia, 
  hardhat
] as const;
export const config = getDefaultConfig({
  appName: 'Crowdfunding DApp', 
  projectId: walletConnectProjectId, 
  chains: chains, 
  ssr: true, 
});