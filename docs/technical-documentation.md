# Technical Documentation

## Overview
This document provides technical details about the Restaurant Loyalty Application built on the Polkadot blockchain using Moonbeam's EVM compatibility. The application allows restaurants to create and manage loyalty programs for their customers, and customers to earn and redeem loyalty points.

## Smart Contracts

### Contract Addresses (Moonbase Alpha Testnet)
- **Factory Contract**: [0xB34e549E359571E73843c753D29388Ec4e5E8FF5](https://moonbase.moonscan.io/address/0xB34e549E359571E73843c753D29388Ec4e5E8FF5)
- **Token Contract**: [0x46C0b6161AB36932c1F0aAc971A3a434751fdc22](https://moonbase.moonscan.io/address/0x46C0b6161AB36932c1F0aAc971A3a434751fdc22)
- **Main Contract**: [0xaEc1165eb2AE7E17f2f1C571d66DBc331E1B55D7](https://moonbase.moonscan.io/address/0xaEc1165eb2AE7E17f2f1C571d66DBc331E1B55D7)

### Contract Architecture

#### RestaurantLoyaltyToken.sol
An ERC20 token contract that represents loyalty points. Key features:
- Standard ERC20 functionality (transfer, approve, etc.)
- Minting capability for the loyalty contract to create new tokens
- Decimals set to 0 to represent whole loyalty points

#### RestaurantLoyalty.sol
The main contract that manages restaurants and customers. Key features:
- Restaurant registration and management
- Customer registration and point tracking
- Point awarding functionality for restaurant owners
- Point redemption functionality for customers
- Integration with the loyalty token contract

#### RestaurantLoyaltyFactory.sol
A factory contract that deploys new instances of the loyalty system. Key features:
- Deployment of token and loyalty contracts
- Tracking of deployed systems
- Simplified creation of new loyalty programs

## Frontend Application

### Technology Stack
- **React.js**: Frontend framework
- **ethers.js**: Ethereum library for blockchain interaction
- **Material-UI**: Component library for UI design
- **Web3Modal**: For wallet connection
- **React Router**: For application routing

### Key Components

#### Web3Context
A React context that manages:
- Wallet connection via MetaMask
- Smart contract instances
- Account state and blockchain interactions

#### Home Component
The landing page that provides:
- Application overview
- Navigation to restaurant and customer dashboards
- Information about the project and deployed contracts

#### RestaurantDashboard Component
Dashboard for restaurant owners that allows:
- Restaurant registration
- Viewing restaurant details
- Awarding points to customers

#### CustomerDashboard Component
Dashboard for customers that allows:
- Customer registration
- Viewing earned points across restaurants
- Redeeming points at participating restaurants

## Deployment

### Smart Contract Deployment
Smart contracts are deployed to the Moonbase Alpha testnet using Hardhat. The deployment process:
1. Compile contracts with Hardhat
2. Deploy using the deployment script
3. Verify contracts on the Moonbase Alpha block explorer

### Frontend Deployment
The frontend application is built as a static site that can be deployed to any web hosting service:
1. Build the React application with `npm run build`
2. Deploy the resulting files to a web server

## Integration with Polkadot

### Moonbeam Integration
This application leverages Moonbeam's EVM compatibility to deploy Solidity smart contracts on the Polkadot ecosystem. Key integration points:
- Contracts deployed to Moonbase Alpha (Moonbeam's testnet)
- MetaMask configuration for Moonbase Alpha
- Transaction signing and sending via Moonbeam's RPC endpoint

### Polkadot Features Utilized
- **Cross-Chain Compatibility**: The application is designed to work within the Polkadot ecosystem
- **EVM Compatibility**: Utilizing Moonbeam's Ethereum compatibility layer
- **Scalability**: Benefiting from Polkadot's scalable architecture
- **Security**: Leveraging Polkadot's shared security model

## Development Tools

### Development Environment
- **Hardhat**: For smart contract development, testing, and deployment
- **Node.js**: JavaScript runtime
- **npm**: Package manager
- **Git**: Version control

### Testing
- **Hardhat Test**: For smart contract testing
- **React Testing Library**: For frontend component testing

## Security Considerations

### Smart Contract Security
- Role-based access control for critical functions
- Validation of inputs to prevent common attacks
- Separation of concerns across multiple contracts

### Frontend Security
- Secure wallet connection handling
- Error handling for failed transactions
- User feedback for transaction status

## Future Enhancements
- Multi-chain support across Polkadot parachains
- Integration with other loyalty programs via cross-chain messaging
- Mobile application development
- Advanced analytics for restaurant owners
- Customizable loyalty program parameters
