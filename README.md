# Restaurant Loyalty Application on Polkadot

A blockchain-based loyalty program system for restaurants built on the Moonbeam network (Polkadot ecosystem). This application allows restaurants to create loyalty programs where customers can earn and redeem points for their purchases and engagement.

## Features

- ERC20 token-based loyalty points
- Restaurant registration and management
- Customer registration and point tracking
- Point awarding and redemption system
- Multi-restaurant support with unified customer accounts
- Web-based interface for both restaurants and customers

## Technology Stack

- **Blockchain**: Moonbeam Network (Polkadot Ecosystem)
- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React.js
- **Web3 Integration**: ethers.js, MetaMask
- **Testing**: Hardhat, Chai

## Smart Contracts

The application consists of three main smart contracts:

1. **RestaurantLoyaltyToken**: An ERC20 token implementation for loyalty points
2. **RestaurantLoyalty**: The main contract managing restaurants, customers, and points
3. **RestaurantLoyaltyFactory**: A factory pattern contract for easy deployment

## Project Structure

```
restaurant-loyalty-app/
├── contracts/            # Smart contract source code
│   └── src/
│       ├── RestaurantLoyalty.sol
│       ├── RestaurantLoyaltyToken.sol
│       └── RestaurantLoyaltyFactory.sol
├── scripts/              # Deployment and interaction scripts
├── test/                 # Smart contract tests
├── frontend/             # React frontend application
├── docs/                 # Documentation
│   ├── architecture.md   # System architecture
│   └── research.md       # Research findings
└── hardhat.config.js     # Hardhat configuration
```

## Getting Started

### Prerequisites

- Node.js and npm
- MetaMask browser extension
- Moonbase Alpha testnet configured in MetaMask

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/restaurant-loyalty-app.git
   cd restaurant-loyalty-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Compile the smart contracts
   ```
   npx hardhat compile
   ```

4. Run tests
   ```
   npx hardhat test
   ```

### Deployment

1. Deploy to Moonbase Alpha testnet
   ```
   npx hardhat run scripts/deploy.js --network moonbase
   ```

2. Start the frontend application
   ```
   cd frontend
   npm install
   npm start
   ```

## Usage

### For Restaurants

1. Register your restaurant through the web interface
2. Manage your restaurant profile and loyalty program settings
3. Award points to customers for purchases and engagement
4. View customer activity and analytics

### For Customers

1. Register as a customer through the web interface
2. Connect your MetaMask wallet
3. Earn points by dining at participating restaurants
4. Redeem points for rewards at restaurants

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Polkadot and Moonbeam Network for providing the blockchain infrastructure
- OpenZeppelin for secure smart contract libraries
