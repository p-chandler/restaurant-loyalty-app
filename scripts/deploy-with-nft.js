// Script to deploy the updated contracts with NFT integration
const hre = require("hardhat");

async function main() {
  console.log("Deploying Restaurant Loyalty contracts with NFT integration...");

  // Deploy the token contract first
  const RestaurantLoyaltyToken = await hre.ethers.getContractFactory("RestaurantLoyaltyToken");
  const token = await RestaurantLoyaltyToken.deploy();
  await token.deployed();
  console.log("RestaurantLoyaltyToken deployed to:", token.address);

  // Deploy the NFT contract with a placeholder loyalty contract address
  // We'll update this later after the main contract is deployed
  const RestaurantWelcomeNFT = await hre.ethers.getContractFactory("RestaurantWelcomeNFT");
  const nft = await RestaurantWelcomeNFT.deploy("0x0000000000000000000000000000000000000000");
  await nft.deployed();
  console.log("RestaurantWelcomeNFT deployed to:", nft.address);

  // Deploy the main loyalty contract with token and NFT addresses
  const RestaurantLoyalty = await hre.ethers.getContractFactory("RestaurantLoyalty");
  const loyalty = await RestaurantLoyalty.deploy(token.address, nft.address);
  await loyalty.deployed();
  console.log("RestaurantLoyalty deployed to:", loyalty.address);

  // Update the NFT contract with the correct loyalty contract address
  await nft.updateLoyaltyContractAddress(loyalty.address);
  console.log("Updated NFT contract with loyalty contract address");

  // Deploy the factory contract
  const RestaurantLoyaltyFactory = await hre.ethers.getContractFactory("RestaurantLoyaltyFactory");
  const factory = await RestaurantLoyaltyFactory.deploy();
  await factory.deployed();
  console.log("RestaurantLoyaltyFactory deployed to:", factory.address);

  // Add fictional restaurants
  const fictionalRestaurants = require('./fictional-restaurants');
  console.log("Adding fictional restaurants...");
  
  // Get the deployer address
  const [deployer] = await hre.ethers.getSigners();
  
  for (const restaurant of fictionalRestaurants) {
    console.log(`Adding restaurant: ${restaurant.name}`);
    await loyalty.addRestaurant(
      restaurant.name,
      restaurant.description,
      deployer.address, // Using deployer as the restaurant owner for testing
      restaurant.welcomeNFTURI,
      restaurant.merchandise
    );
  }
  
  console.log("Fictional restaurants added successfully");

  console.log("Deployment completed successfully!");
  
  // Return the deployed contract addresses for easy reference
  return {
    tokenAddress: token.address,
    nftAddress: nft.address,
    loyaltyAddress: loyalty.address,
    factoryAddress: factory.address
  };
}

main()
  .then((addresses) => {
    console.log("Deployed contract addresses:", addresses);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
