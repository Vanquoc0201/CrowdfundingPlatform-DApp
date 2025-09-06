# 🚀 Crowdfund DApp: Your Web3 Kickstarter

A fully decentralized crowdfunding platform built on the Ethereum Virtual Machine (EVM), enabling transparent, secure, and community-governed project funding. Fuel innovative ideas and support the future, with every contribution and decision recorded on-chain.

## ✨ Features

Crowdfund DApp empowers creators and contributors with a robust set of decentralized features:

*   **Wallet Connection:** Seamlessly connect using popular Web3 wallets (MetaMask, WalletConnect, Coinbase Wallet) via RainbowKit and Wagmi.
*   **Campaign Management:**
    *   **Create Campaigns:** Project owners can launch new campaigns with a title, detailed description, funding goal, deadline, and a minimum contribution amount. All basic campaign data is stored on-chain, while richer metadata (description, images) is securely stored on IPFS via Pinata.
    *   **Explore Campaigns:** Browse a marketplace of ongoing, successful, and failed campaigns.
*   **Decentralized Funding:**
    *   **Contribute:** Back projects by contributing ETH directly to the campaign's smart contract.
    *   **Refunds:** Contributors can claim a refund if a campaign fails to meet its funding goal by the deadline.
*   **Community Governance (Fund Release Voting):**
    *   **Request Funds:** Once a campaign successfully reaches its goal and ends, the project owner can create fund release requests (specifying amount and recipient) from the raised capital.
    *   **Approve Requests:** Contributors can vote to approve or reject fund release requests, ensuring transparency and accountability. The project owner can only finalize requests if a sufficient percentage of approvals (based on contribution weight) is met.
    *   **Finalize Requests:** Campaign owners can execute approved fund release requests, transferring funds securely to the specified recipient.
*   **User Dashboard:** A personalized hub to track:
    *   Campaigns you have created.
    *   Campaigns you have contributed to.
    *   (Future) NFT badges earned from contributions.
    *   (Future) Your voting history.
*   **Secure & Transparent:** All core logic and financial transactions are executed by smart contracts, providing unparalleled transparency, immutability, and resistance to censorship.

## 💡 Project Idea: Decentralized Crowdfunding Platform (Web3 Kickstarter)

The vision is to create a trustless platform where:

*   Creators can launch their projects without intermediaries.
*   Investors contribute with cryptocurrency, knowing their funds are managed by transparent smart contract logic.
*   Post-funding decisions (like fund releases) are subject to community oversight, preventing scams and fostering trust.

## 🛠️ Tech Stack

### Smart Contracts
*   **Solidity:** The primary language for writing secure and efficient smart contracts.
*   **Hardhat:** Ethereum development environment for compiling, deploying, testing, and debugging contracts locally and on testnets.
*   **OpenZeppelin Contracts:** Industry-standard library for secure and battle-tested contract implementations (e.g., `ReentrancyGuard`).

### Frontend
*   **Next.js (React Framework):** For a powerful and performant user interface, leveraging Server Components and Client Components as appropriate.
*   **TypeScript:** Ensures type-safety, improves code quality, and enhances developer experience.
*   **Tailwind CSS:** A utility-first CSS framework for rapid and consistent styling.
*   **shadcn/ui:** Reusable, accessible UI components built on Radix UI and styled with Tailwind CSS, providing a modern and professional look (using **Zinc** as the base theme).
*   **lucide-react:** A collection of beautiful and consistent open-source icons.
*   **Wagmi:** React Hooks for Ethereum, simplifying interaction with smart contracts and wallets.
*   **RainbowKit:** A beautiful and easy-to-use wallet connection UI library for React.
*   **Viem:** A TypeScript Interface for Ethereum, providing low-level functionalities for interacting with the blockchain (underpins Wagmi).
*   **@tanstack/react-query:** For efficient data fetching, caching, and state management, integrated seamlessly with Wagmi.
*   **Sonner:** A highly customizable toast component for elegant notifications.

### Decentralized Storage
*   **IPFS (InterPlanetary File System):** For decentralized storage of campaign metadata (detailed descriptions, images).
*   **Pinata:** A service that provides reliable pinning of content to IPFS, ensuring data availability. Used via secure Next.js API Routes to protect API keys.

### Development Utilities
*   **Zod:** TypeScript-first schema declaration and validation library for robust form validation.
*   **React Hook Form:** For efficient and flexible form management with validation.

## 🚀 Getting Started

Follow these steps to set up and run the Crowdfund DApp locally:

### Prerequisites
*   Node.js (LTS version recommended) & npm/yarn
*   Git
*   MetaMask (browser extension)
*   Basic understanding of Web3 concepts and smart contracts.

### 1. Clone the Repository
git clone https://github.com/Vanquoc0201/CrowdFundingPlatform-DApp.git
cd CrowdFundingPlatform-DApp/frontend # Assuming frontend is in a subdirectory
### 2. Install Dependencies
npm install
### 3. Environment Variables
Create a .env.local file in the frontend/ directory and add your API keys:
# frontend/.env.local

# WalletConnect Project ID (Get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="YOUR_WALLETCONNECT_PROJECT_ID"

# Pinata API Keys (Get from https://app.pinata.cloud/developers/api-keys)
# These are used by Next.js API Routes for secure server-side IPFS uploads.
PINATA_API_KEY="YOUR_PINATA_API_KEY"
PINATA_SECRET_API_KEY="YOUR_PINATA_SECRET_API_KEY"
# OR, if using a Pinata JWT (create from Pinata Cloud and use for PINATA_JWT)
# PINATA_JWT="YOUR_PRIVATE_PINATA_JWT"
### 4. Smart Contract Deployment (Localhost)
**a. Start Hardhat Network:**
npx hardhat node
Keep this terminal running.

**b. Deploy Contracts:**
Open another terminal window in the `CrowdFundingPlatform-DApp/` root directory and run your deployment script:```bash
npx hardhat ignition deploy ./ignition/modules/CampaignFactory.ts --network localhost
**c. Update Frontend Contract Address:**
// frontend/src/abis/address.ts
export const CONTRACT_ADDRESSES = {
  localhost: {
    CampaignFactory: "YOUR_DEPLOYED_CAMPAIGNFACTORY_ADDRESS_HERE" as const,
  },
  // ... other networks
};
### 5. Run the Frontend
npm run dev # or yarn dev
### 6. Connect MetaMask to Localhost
Open your MetaMask extension.
Switch your network to "Localhost 8545" (Chain ID: 31337). If it's not listed, add it manually:
Network Name: Localhost 8545
New RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
Refresh your browser tab running the DApp.
You should now be able to interact with the DApp locally!
### 🛣️ Roadmap (MVP to Advanced)
MVP (Minimum Viable Product)
Core Functionality: Wallet connection, creating campaigns, viewing campaign lists, viewing campaign details, contributing to campaigns.
Basic Governance: Owner-initiated fund release requests, basic contributor approval for fund release (as per current contract).
Decentralized Storage: IPFS integration for campaign metadata (description, images).
User Experience: Clean UI with Shadcn/ui, responsive design.
Advanced Features
Platform Fee Integration: Implement a small commission fee on successful campaigns, automatically collected by the smart contract for platform sustainability.
Platform Token Integration (ERC20):
Deploy a native ERC20 token for the platform.
Reward contributors with tokens upon contribution.
Explore using tokens for enhanced governance voting power.
DAO Treasury & Governance:
Transition platform fee recipient to a DAO Treasury.
Implement OpenZeppelin Governor contracts for community-led proposals and voting on platform decisions (e.g., changing fee percentages, funding platform development).
NFT Badge / Proof of Contribution: Mint unique ERC721 NFT badges to contributors as a token of appreciation and proof of their support.
Enhanced Analytics & Dashboard: Utilize indexing solutions like The Graph to efficiently query and display complex on-chain data for better insights and user experience (e.g., detailed contributor lists, voting history).
Multi-chain Support: Expand deployment and frontend configuration to support other EVM-compatible chains (e.g., Polygon, BNB Smart Chain).
IPFS Metadata Update: Allow campaign owners to update IPFS metadata (if contract supports it).
Thank you for exploring Crowdfund DApp! Your contributions and feedback are welcome as we build the future of decentralized funding.