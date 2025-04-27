# Contract Verification Information

## Deployed Contracts

The following smart contracts have been successfully deployed to the Moonbeam testnet (Moonbase Alpha):

1. **RestaurantLoyaltyFactory**: 0x60e900d28D18f97cBD4F8683990FeE654Addc712
2. **RestaurantLoyaltyToken**: 0xc20F1ba0CFC86d21Fe45e2e8D4E021a969Cc5715
3. **RestaurantLoyalty** (Main Contract): 0x39EA6fFBca20dDa631999278bb378B112Df60403

## Block Explorer Links

You can view these contracts on the Moonbase Alpha block explorer using these links:

- Factory: [https://moonbase.moonscan.io/address/0x60e900d28D18f97cBD4F8683990FeE654Addc712](https://moonbase.moonscan.io/address/0x60e900d28D18f97cBD4F8683990FeE654Addc712)
- Token: [https://moonbase.moonscan.io/address/0xc20F1ba0CFC86d21Fe45e2e8D4E021a969Cc5715](https://moonbase.moonscan.io/address/0xc20F1ba0CFC86d21Fe45e2e8D4E021a969Cc5715)
- Main Contract: [https://moonbase.moonscan.io/address/0x39EA6fFBca20dDa631999278bb378B112Df60403](https://moonbase.moonscan.io/address/0x39EA6fFBca20dDa631999278bb378B112Df60403)

## Manual Verification

While automated verification through Hardhat encountered API key issues, you can manually verify the contracts by:

1. Visiting the contract address on Moonbase Moonscan
2. Clicking on the "Contract" tab
3. Selecting "Verify & Publish"
4. Uploading the contract source code and compiler settings

## Contract Source Code

The source code for all contracts is available in the `contracts/src` directory:

- `RestaurantLoyaltyFactory.sol`
- `RestaurantLoyaltyToken.sol`
- `RestaurantLoyalty.sol`

## Compiler Settings

- Compiler Version: 0.8.28
- Optimization: Enabled
- Optimization Runs: 200
- License Type: MIT

## Deployment Transaction

The contracts were deployed using the wallet address: 0x0a8bA838328a73ba602d9ddc2d97D23F320B3FA4

This verification document serves as proof of deployment for the hackathon submission.
