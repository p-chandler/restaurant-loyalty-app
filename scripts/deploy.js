// Scripts for deploying the RestaurantLoyalty contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying RestaurantLoyalty contract...");

  const RestaurantLoyalty = await hre.ethers.getContractFactory("RestaurantLoyalty");
  const restaurantLoyalty = await RestaurantLoyalty.deploy();

  await restaurantLoyalty.waitForDeployment();

  const address = await restaurantLoyalty.getAddress();
  console.log(`RestaurantLoyalty deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
