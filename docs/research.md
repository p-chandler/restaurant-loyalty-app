# Research: Polkadot Asset Hub and Moonbeam

## Polkadot Asset Hub vs Moonbeam

### Polkadot Asset Hub
- Formerly known as Asset Hub or Statemint
- Will introduce PolkaVM (RISC-V-based virtual machine) in Q3 2025
- Offers Ethereum compatibility but not full EVM compatibility
- Uses RISC-V instructions, which are entirely different from EVM bytecode
- Solidity programs must be compiled into PolkaVM bytecode instead of EVM bytecode
- May have limitations and behavioral differences in how programs execute
- Only supports partial Ethereum compatibility

### Moonbeam
- Fully EVM-compatible network within the Polkadot ecosystem
- Allows developers to deploy existing Ethereum-based applications with minimal changes
- Runs EVM bytecode directly, meaning contracts can be deployed across different EVM-compatible platforms with the exact same bytecode
- Supports Ethereum-compatible JSON-RPC endpoints
- Enables users to connect wallets like MetaMask or use development tools such as Hardhat and Foundry
- Recently reduced block time from 12 seconds to 6 seconds
- Will support elastic scaling for dynamic throughput increases
- Introducing native support for decentralized storage through Storage Hub

## Moonbase Alpha Testnet Configuration

To connect MetaMask to Moonbase Alpha testnet, use the following configuration:

- Network Name: Moonbase Alpha Testnet
- New RPC URL: https://rpc.api.moonbase.moonbeam.network
- Chain ID: 1287
- Currency Symbol: DEV
- Block Explorer URL: https://moonbase.moonscan.io/

## Development Approach

Based on the research, we will use Moonbeam's testnet (Moonbase Alpha) for our restaurant loyalty application development for the following reasons:

1. Full EVM compatibility allows for seamless deployment of Solidity contracts
2. Better tooling support with familiar Ethereum development tools
3. More mature ecosystem for smart contract development
4. Consistent behavior with Ethereum, ensuring predictable execution
5. Aligns with the user's requirement to use Moonbeam test network

## Next Steps

1. Set up the development environment with the required tools
2. Configure MetaMask for Moonbase Alpha testnet
3. Obtain test tokens from the Moonbeam faucet
4. Design the restaurant loyalty system architecture
5. Develop and deploy the smart contracts
