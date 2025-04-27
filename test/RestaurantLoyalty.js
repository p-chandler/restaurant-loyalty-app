const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Restaurant Loyalty System", function () {
  let restaurantLoyaltyToken;
  let restaurantLoyalty;
  let restaurantLoyaltyFactory;
  let owner;
  let restaurant1;
  let restaurant2;
  let customer1;
  let customer2;

  beforeEach(async function () {
    // Get signers
    [owner, restaurant1, restaurant2, customer1, customer2] = await ethers.getSigners();

    // Deploy the factory contract
    const RestaurantLoyaltyFactory = await ethers.getContractFactory("RestaurantLoyaltyFactory", owner);
    restaurantLoyaltyFactory = await RestaurantLoyaltyFactory.deploy();

    // Deploy the loyalty system using the factory
    const tx = await restaurantLoyaltyFactory.connect(owner).deployLoyaltySystem();
    const receipt = await tx.wait();
    
    // Get the deployed addresses from the event
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "LoyaltySystemDeployed"
    );
    const [tokenAddress, loyaltyAddress] = event.args;

    // Get contract instances
    restaurantLoyaltyToken = await ethers.getContractAt("RestaurantLoyaltyToken", tokenAddress);
    restaurantLoyalty = await ethers.getContractAt("RestaurantLoyalty", loyaltyAddress);
  });

  describe("Deployment", function () {
    it("Should set the right owner for both contracts", async function () {
      expect(await restaurantLoyaltyToken.owner()).to.equal(await restaurantLoyalty.getAddress());
      expect(await restaurantLoyalty.owner()).to.equal(owner.address);
    });

    it("Should have correct token name and symbol", async function () {
      expect(await restaurantLoyaltyToken.name()).to.equal("Restaurant Loyalty Token");
      expect(await restaurantLoyaltyToken.symbol()).to.equal("RLT");
    });
  });

  describe("Restaurant Management", function () {
    it("Should allow adding a restaurant", async function () {
      await restaurantLoyalty.connect(owner).addRestaurant(
        "Pizza Palace",
        "Best pizza in town",
        restaurant1.address
      );

      const restaurant = await restaurantLoyalty.restaurants(1);
      expect(restaurant.name).to.equal("Pizza Palace");
      expect(restaurant.description).to.equal("Best pizza in town");
      expect(restaurant.owner).to.equal(restaurant1.address);
      expect(restaurant.isActive).to.equal(true);
    });

    it("Should allow updating a restaurant", async function () {
      await restaurantLoyalty.connect(owner).addRestaurant(
        "Pizza Palace",
        "Best pizza in town",
        restaurant1.address
      );

      await restaurantLoyalty.connect(restaurant1).updateRestaurant(
        1,
        "Pizza Palace Deluxe",
        "Best gourmet pizza in town",
        restaurant1.address
      );

      const restaurant = await restaurantLoyalty.restaurants(1);
      expect(restaurant.name).to.equal("Pizza Palace Deluxe");
      expect(restaurant.description).to.equal("Best gourmet pizza in town");
    });

    it("Should allow changing restaurant status", async function () {
      await restaurantLoyalty.connect(owner).addRestaurant(
        "Pizza Palace",
        "Best pizza in town",
        restaurant1.address
      );

      await restaurantLoyalty.connect(restaurant1).setRestaurantStatus(1, false);

      const restaurant = await restaurantLoyalty.restaurants(1);
      expect(restaurant.isActive).to.equal(false);
    });

    it("Should prevent unauthorized restaurant updates", async function () {
      await restaurantLoyalty.connect(owner).addRestaurant(
        "Pizza Palace",
        "Best pizza in town",
        restaurant1.address
      );

      await expect(
        restaurantLoyalty.connect(restaurant2).updateRestaurant(
          1,
          "Hacked Restaurant",
          "Hacked description",
          restaurant2.address
        )
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Customer Management", function () {
    it("Should allow customer registration", async function () {
      await restaurantLoyalty.connect(customer1).registerCustomer("John Doe");

      const customer = await restaurantLoyalty.customers(customer1.address);
      expect(customer.name).to.equal("John Doe");
      expect(customer.totalPoints).to.equal(0);
      expect(customer.isRegistered).to.equal(true);
    });

    it("Should prevent duplicate customer registration", async function () {
      await restaurantLoyalty.connect(customer1).registerCustomer("John Doe");

      await expect(
        restaurantLoyalty.connect(customer1).registerCustomer("John Doe Again")
      ).to.be.revertedWith("Customer already registered");
    });
  });

  describe("Points Management", function () {
    beforeEach(async function () {
      // Add a restaurant
      await restaurantLoyalty.connect(owner).addRestaurant(
        "Pizza Palace",
        "Best pizza in town",
        restaurant1.address
      );

      // Register customers
      await restaurantLoyalty.connect(customer1).registerCustomer("John Doe");
      await restaurantLoyalty.connect(customer2).registerCustomer("Jane Smith");
    });

    it("Should allow restaurant to award points", async function () {
      await restaurantLoyalty.connect(restaurant1).awardPoints(1, customer1.address, 100);

      expect(await restaurantLoyalty.getCustomerPoints(1, customer1.address)).to.equal(100);
      expect(await restaurantLoyalty.getCustomerTotalPoints(customer1.address)).to.equal(100);
      expect(await restaurantLoyaltyToken.balanceOf(customer1.address)).to.equal(100);
    });

    it("Should prevent unauthorized point awarding", async function () {
      await expect(
        restaurantLoyalty.connect(restaurant2).awardPoints(1, customer1.address, 100)
      ).to.be.revertedWith("Not restaurant owner");
    });

    it("Should allow points redemption", async function () {
      // Award points
      await restaurantLoyalty.connect(restaurant1).awardPoints(1, customer1.address, 100);
      
      // Approve token transfer for redemption
      await restaurantLoyaltyToken.connect(customer1).approve(
        await restaurantLoyalty.getAddress(),
        100
      );
      
      // Redeem points
      await restaurantLoyalty.connect(customer1).redeemPoints(1, 50);

      expect(await restaurantLoyalty.getCustomerPoints(1, customer1.address)).to.equal(50);
      expect(await restaurantLoyalty.getCustomerTotalPoints(customer1.address)).to.equal(50);
      expect(await restaurantLoyaltyToken.balanceOf(customer1.address)).to.equal(50);
    });

    it("Should prevent redemption with insufficient points", async function () {
      await restaurantLoyalty.connect(restaurant1).awardPoints(1, customer1.address, 100);
      
      await restaurantLoyaltyToken.connect(customer1).approve(
        await restaurantLoyalty.getAddress(),
        200
      );
      
      await expect(
        restaurantLoyalty.connect(customer1).redeemPoints(1, 150)
      ).to.be.revertedWith("Insufficient points");
    });
  });
});
