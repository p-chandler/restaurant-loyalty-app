# Demo Video Script for Blockchain Bites

## Introduction (0:00 - 0:30)
- "Hello and welcome to Blockchain Bites, a restaurant loyalty application built on the Polkadot ecosystem using Moonbeam's EVM compatibility."
- "In this video, I'll demonstrate how our application revolutionizes restaurant loyalty programs by leveraging blockchain technology."
- "I'll walk you through the project structure, explain how our smart contracts work, and show a complete demo of the application."

## Project Overview (0:30 - 1:30)
- "Blockchain Bites solves several key problems in traditional restaurant loyalty programs:"
  - "First, it unifies fragmented loyalty programs across multiple restaurants."
  - "Second, it provides transparency and trust through blockchain's immutable records."
  - "Third, it enhances customer engagement with NFT welcome gifts."
  - "And finally, it simplifies program management for restaurant owners."
- "Our application is built on Moonbeam's testnet (Moonbase Alpha), which provides full Ethereum compatibility while being part of the Polkadot ecosystem."

## GitHub Repository Structure (1:30 - 2:30)
- "Let me walk you through our GitHub repository structure."
- "In the contracts directory, we have our four main smart contracts:"
  - "RestaurantLoyaltyToken.sol - An ERC20 token for loyalty points"
  - "RestaurantWelcomeNFT.sol - An ERC721 contract for welcome gift NFTs"
  - "RestaurantLoyalty.sol - The main contract managing restaurants, customers, and loyalty operations"
  - "RestaurantLoyaltyFactory.sol - A factory pattern contract for easy deployment"
- "The frontend directory contains our React application with components for the landing page, customer dashboard, and restaurant dashboard."
- "We also have comprehensive documentation in the docs directory and test scripts to ensure our contracts work correctly."

## Smart Contract Explanation (2:30 - 4:00)
- "Now, let's dive deeper into how our smart contracts work."
- "The RestaurantLoyaltyToken is a standard ERC20 token that represents loyalty points. It can be minted when points are awarded and burned when points are redeemed."
- "The RestaurantWelcomeNFT contract implements ERC721 for unique welcome gifts. Each NFT represents a specific merchandise item from a restaurant."
- "The RestaurantLoyalty contract is the core of our application. It manages restaurant registration, customer registration, point awarding, point redemption, and NFT welcome gift issuance and redemption."
- "Finally, the RestaurantLoyaltyFactory contract creates and initializes all other contracts, managing their relationships and permissions."
- "All contracts are deployed on the Moonbase Alpha testnet, and you can view them on the block explorer using the links in our README."

## Application Demo (4:00 - 7:00)
- "Let's now see the application in action."

### Landing Page (4:00 - 4:30)
- "This is our landing page, which introduces the concept of our blockchain-based loyalty program."
- "You can see our five participating restaurants, each offering unique welcome gifts for new customers."
- "The restaurants include Pixel Bistro, Blockchain Brewery, Crypto Café, Web3 Wok, and Metaverse Munchies."

### Restaurant Registration (4:30 - 5:15)
- "First, I'll demonstrate how a restaurant owner can register on our platform."
- "After connecting my wallet, I'll navigate to the Restaurant Dashboard and register a new restaurant."
- "I'll enter the restaurant name, description, and provide a URI for the welcome NFT."
- "Once registered, the restaurant is added to the blockchain and can start managing its loyalty program."

### Customer Registration (5:15 - 6:00)
- "Now, let's switch to a customer perspective."
- "After connecting a different wallet, I'll navigate to the Customer Dashboard and register as a new customer."
- "I'll enter my name and select a restaurant to receive a welcome NFT."
- "Upon registration, I receive a welcome NFT that can be redeemed for merchandise at the selected restaurant."

### Point Management and NFT Redemption (6:00 - 7:00)
- "As a customer, I can now earn points by dining at participating restaurants."
- "Let's simulate earning points and then redeem them for rewards."
- "I can also view my NFT collection and redeem my welcome NFT for the promised merchandise."
- "The redemption process updates the NFT status on the blockchain to prevent double-redemption."

## How Polkadot Was Used (7:00 - 8:00)
- "Our application leverages the Polkadot ecosystem through Moonbeam's EVM compatibility."
- "By deploying on Moonbase Alpha, we benefit from Polkadot's shared security model and potential for cross-chain interoperability."
- "In the future, we could expand our application to interact with other parachains through XCM (Cross-Consensus Messaging)."
- "Moonbeam's connection to Polkadot also provides better scalability and lower transaction fees compared to Ethereum mainnet."

## Conclusion (8:00 - 8:30)
- "In conclusion, Blockchain Bites demonstrates how blockchain technology can revolutionize restaurant loyalty programs."
- "Our application provides transparency, interoperability, and enhanced customer engagement through NFT welcome gifts."
- "All code is open source and available on our GitHub repository."
- "Thank you for watching this demo. We hope you consider Blockchain Bites for your hackathon evaluation."
