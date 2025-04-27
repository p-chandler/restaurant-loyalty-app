// Scripts for deploying the RestaurantLoyalty system using the factory
const hre = require("hardhat");

async function main() {
  console.log("Deploying RestaurantLoyalty system using factory...");

  // Deploy the factory contract
  const RestaurantLoyaltyFactory = await hre.ethers.getContractFactory("RestaurantLoyaltyFactory");
  const factory = await RestaurantLoyaltyFactory.deploy();
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log(`RestaurantLoyaltyFactory deployed to: ${factoryAddress}`);

  // Use the factory to deploy the token and main contract
  console.log("Deploying token and main contract through factory...");
  const tx = await factory.deployLoyaltySystem();
  const receipt = await tx.wait();
  
  // Get the deployed addresses from the event
  const event = receipt.logs.find(
    (log) => log.fragment && log.fragment.name === "LoyaltySystemDeployed"
  );
  
  if (!event) {
    throw new Error("Deployment event not found in transaction logs");
  }
  
  const [tokenAddress, loyaltyAddress] = event.args;
  
  console.log(`RestaurantLoyaltyToken deployed to: ${tokenAddress}`);
  console.log(`RestaurantLoyalty deployed to: ${loyaltyAddress}`);
  
  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log(`Factory: ${factoryAddress}`);
  console.log(`Token: ${tokenAddress}`);
  console.log(`Main Contract: ${loyaltyAddress}`);
  console.log("\nBlock Explorer URLs:");
  console.log(`https://moonbase.moonscan.io/address/${factoryAddress}`);
  console.log(`https://moonbase.moonscan.io/address/${tokenAddress}`);
  console.log(`https://moonbase.moonscan.io/address/${loyaltyAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
