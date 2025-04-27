# Restaurant Loyalty Application with NFT Welcome Gifts - Hackathon Submission

## Project Overview

The Restaurant Loyalty Application is a decentralized solution built on the Polkadot blockchain that revolutionizes traditional customer loyalty programs for restaurants. This application enhances customer engagement through a unique welcome NFT system that allows restaurants to offer exclusive merchandise to new customers.

## Deployed Application

The fully functional application is deployed and accessible at:
https://arjznwjh.manus.space

## Smart Contract Deployments on Moonbase Alpha

All smart contracts are deployed on the Moonbase Alpha testnet:

- **RestaurantLoyaltyToken**: [0x67B152592426AACeaa0692AeB42D048150B8D0c4](https://moonbase.moonscan.io/address/0x67B152592426AACeaa0692AeB42D048150B8D0c4)
- **RestaurantWelcomeNFT**: [0x27A2e33E1F13863E64BDc5bc04deCA4A9875231c](https://moonbase.moonscan.io/address/0x27A2e33E1F13863E64BDc5bc04deCA4A9875231c)
- **RestaurantLoyalty**: [0x2cA483b9b259F3118a22b0E1ad1a4F5198ea97b7](https://moonbase.moonscan.io/address/0x2cA483b9b259F3118a22b0E1ad1a4F5198ea97b7)

## Key Features

### For Restaurant Owners:
- Register their restaurant on the platform
- Award loyalty points to customers
- View customer loyalty statistics
- Offer welcome NFTs with exclusive merchandise
- Track NFT redemptions

### For Customers:
- Register as a customer
- Earn loyalty points at participating restaurants
- View points balance across all restaurants
- Redeem points for rewards
- Receive welcome NFTs when registering
- View and redeem NFTs for exclusive merchandise

## Fictional Restaurants Showcase

The application includes five fictional restaurants, each offering unique welcome NFTs and merchandise:

1. **Pixel Bistro**: A modern fusion restaurant with tech-inspired ambiance
   - Welcome Gift: Exclusive Pixel Bistro branded coffee mug

2. **Blockchain Brewery**: Craft beer and pub food in a blockchain-themed setting
   - Welcome Gift: Limited edition Blockchain Brewery t-shirt

3. **Crypto Café**: Cozy café serving specialty coffees in a crypto-friendly environment
   - Welcome Gift: Crypto Café branded reusable coffee cup

4. **Web3 Wok**: Asian fusion restaurant celebrating decentralized technology
   - Welcome Gift: Web3 Wok cookbook with signature recipes

5. **Metaverse Munchies**: Fast-casual dining with a virtual reality twist
   - Welcome Gift: Metaverse Munchies VR dining experience voucher

## Technical Implementation

### Smart Contracts

The application consists of four main smart contracts:

1. **RestaurantLoyaltyToken**: An ERC20 token contract that represents loyalty points.
2. **RestaurantLoyalty**: The main contract that manages restaurants, customers, and point transactions.
3. **RestaurantLoyaltyFactory**: A factory contract that simplifies the deployment of new loyalty systems.
4. **RestaurantWelcomeNFT**: An ERC721 token contract that represents welcome gifts for new customers.

### Frontend Application

The frontend is built with React.js and integrates with the blockchain through:

1. **Web3 Integration**: Using ethers.js to interact with the deployed smart contracts.
2. **MetaMask Connection**: Allowing users to connect their wallets and sign transactions.
3. **Responsive Design**: Supporting both desktop and mobile devices.
4. **Role-Based Interface**: Different dashboards for restaurant owners and customers.
5. **NFT Display and Management**: Interface for viewing and redeeming welcome NFTs.

## How Polkadot Was Used

This application leverages the Polkadot ecosystem through Moonbeam's EVM compatibility:

1. **Moonbeam Integration**: We deployed our smart contracts on Moonbeam's testnet (Moonbase Alpha), which provides Ethereum compatibility within the Polkadot ecosystem.
2. **Cross-Chain Potential**: While currently deployed on Moonbeam, the architecture is designed to potentially interact with other parachains in the Polkadot ecosystem.
3. **Shared Security**: By building on Polkadot, the application benefits from the shared security model of the relay chain.
4. **Scalability**: Polkadot's architecture allows for greater scalability compared to traditional blockchain solutions.
5. **Future Interoperability**: The application is positioned to take advantage of Polkadot's cross-chain communication capabilities as they mature.
6. **NFT Standards Support**: Moonbeam's EVM compatibility allows for the implementation of NFT standards (ERC-721) within the Polkadot ecosystem.

## Unique Advantages of Using Polkadot

1. **Ecosystem Integration**: Building on Polkadot positions the application within a growing ecosystem of interoperable blockchains.
2. **Lower Transaction Costs**: Compared to Ethereum mainnet, Polkadot offers lower transaction costs.
3. **Future-Proof Architecture**: The application can evolve with Polkadot's developing cross-chain capabilities.
4. **Specialized Functionality**: As more parachains launch with specialized functionality, the application can integrate with them.
5. **Governance Participation**: The potential for participation in Polkadot's on-chain governance system.
6. **NFT Interoperability**: Potential for NFTs to be used across different parachains in the Polkadot ecosystem.

## Project Documentation

For more detailed information about the project, please refer to:

- [Project Description](/docs/project-description.md)
- [Technical Documentation](/docs/technical-documentation.md)
- [Architecture](/docs/architecture.md)
- [Research](/docs/research.md)

## Source Code

The complete source code for this project is available in this repository, organized as follows:

- `/contracts/src/`: Smart contract source code
- `/frontend/src/`: Frontend application source code
- `/scripts/`: Deployment and testing scripts
- `/test/`: Smart contract test files

## How to Run Locally

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd frontend
   npm install
   ```
3. Configure environment variables in `.env`
4. Deploy contracts:
   ```
   npx hardhat run scripts/deploy-with-nft-and-restaurants.js --network moonbase
   ```
5. Start the frontend:
   ```
   cd frontend
   npm start
   ```

## Conclusion

The Restaurant Loyalty Application with NFT Welcome Gifts demonstrates how blockchain technology, specifically within the Polkadot ecosystem, can transform traditional loyalty programs. By providing transparency, security, and innovative NFT-based engagement features, this application offers significant advantages over centralized solutions. As the Polkadot ecosystem continues to mature, the application is well-positioned to expand its capabilities and reach.
