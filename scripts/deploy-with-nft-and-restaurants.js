// Script to deploy the updated contracts with NFT integration and fictional restaurants
const hre = require("hardhat");

// Define fictional restaurants directly in this file to avoid import issues
const restaurants = [
  {
    name: "Pixel Bistro",
    description: "A modern fusion restaurant with a tech-inspired ambiance and innovative cuisine.",
    welcomeNFTURI: "https://ipfs.io/ipfs/QmXyZ123456789/pixel-bistro-welcome.json",
    merchandise: "Exclusive Pixel Bistro branded coffee mug"
  },
  {
    name: "Blockchain Brewery",
    description: "Craft beer and pub food in a blockchain-themed setting with digital art displays.",
    welcomeNFTURI: "https://ipfs.io/ipfs/QmXyZ123456789/blockchain-brewery-welcome.json",
    merchandise: "Limited edition Blockchain Brewery t-shirt"
  },
  {
    name: "Crypto Café",
    description: "Cozy café serving specialty coffees and pastries in a crypto-friendly environment.",
    welcomeNFTURI: "https://ipfs.io/ipfs/QmXyZ123456789/crypto-cafe-welcome.json",
    merchandise: "Crypto Café branded reusable coffee cup"
  },
  {
    name: "Web3 Wok",
    description: "Asian fusion restaurant celebrating decentralized technology with interactive dining experiences.",
    welcomeNFTURI: "https://ipfs.io/ipfs/QmXyZ123456789/web3-wok-welcome.json",
    merchandise: "Web3 Wok cookbook with signature recipes"
  },
  {
    name: "Metaverse Munchies",
    description: "Fast-casual dining with a virtual reality twist, offering comfort food favorites.",
    welcomeNFTURI: "https://ipfs.io/ipfs/QmXyZ123456789/metaverse-munchies-welcome.json",
    merchandise: "Metaverse Munchies VR dining experience voucher"
  }
];

async function main() {
  console.log("Deploying Restaurant Loyalty System with NFT integration and fictional restaurants...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Deploy the token contract
  const RestaurantLoyaltyToken = await hre.ethers.getContractFactory("RestaurantLoyaltyToken");
  const token = await RestaurantLoyaltyToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log(`RestaurantLoyaltyToken deployed to: ${tokenAddress}`);

  // Deploy the NFT contract with a temporary address
  const RestaurantWelcomeNFT = await hre.ethers.getContractFactory("RestaurantWelcomeNFT");
  const nft = await RestaurantWelcomeNFT.deploy("0x0000000000000000000000000000000000000000");
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log(`RestaurantWelcomeNFT deployed to: ${nftAddress}`);

  // Deploy the main loyalty contract
  const RestaurantLoyalty = await hre.ethers.getContractFactory("RestaurantLoyalty");
  const loyalty = await RestaurantLoyalty.deploy(tokenAddress, nftAddress);
  await loyalty.waitForDeployment();
  const loyaltyAddress = await loyalty.getAddress();
  console.log(`RestaurantLoyalty deployed to: ${loyaltyAddress}`);

  // Update the NFT contract with the correct loyalty contract address
  const updateTx = await nft.updateLoyaltyContractAddress(loyaltyAddress);
  await updateTx.wait();
  console.log("Updated NFT contract with loyalty contract address");

  // Transfer ownership of the token to the loyalty contract
  const transferTx = await token.transferOwnership(loyaltyAddress);
  await transferTx.wait();
  console.log("Transferred token ownership to loyalty contract");

  // Add fictional restaurants
  console.log("Adding fictional restaurants...");
  for (const restaurant of restaurants) {
    const tx = await loyalty.addRestaurant(
      restaurant.name,
      restaurant.description,
      deployer.address, // Using deployer as restaurant owner for demo
      restaurant.welcomeNFTURI,
      restaurant.merchandise
    );
    await tx.wait();
    console.log(`Added restaurant: ${restaurant.name}`);
  }

  console.log("Deployment and setup complete!");
  console.log({
    token: tokenAddress,
    nft: nftAddress,
    loyalty: loyaltyAddress,
    restaurants: restaurants.length
  });

  // Return the contract addresses for testing
  return { tokenAddress, nftAddress, loyaltyAddress };
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
