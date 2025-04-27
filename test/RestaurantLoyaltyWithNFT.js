const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Restaurant Loyalty with NFT Integration", function () {
  let RestaurantLoyaltyToken;
  let RestaurantWelcomeNFT;
  let RestaurantLoyalty;
  let token;
  let nft;
  let loyalty;
  let owner;
  let restaurantOwner;
  let customer;

  const restaurantName = "Pixel Bistro";
  const restaurantDescription = "A modern fusion restaurant with a tech-inspired ambiance and innovative cuisine.";
  const welcomeNFTURI = "ipfs://QmXyZ123456789/pixel-bistro-welcome.json";
  const merchandise = "Exclusive Pixel Bistro branded coffee mug";

  beforeEach(async function () {
    // Get signers
    [owner, restaurantOwner, customer] = await ethers.getSigners();

    // Deploy token contract
    RestaurantLoyaltyToken = await ethers.getContractFactory("RestaurantLoyaltyToken");
    token = await RestaurantLoyaltyToken.deploy();
    
    // Deploy NFT contract with a placeholder loyalty contract address
    RestaurantWelcomeNFT = await ethers.getContractFactory("RestaurantWelcomeNFT");
    nft = await RestaurantWelcomeNFT.deploy("0x0000000000000000000000000000000000000000");
    
    // Deploy main loyalty contract
    RestaurantLoyalty = await ethers.getContractFactory("RestaurantLoyalty");
    loyalty = await RestaurantLoyalty.deploy(token.address, nft.address);

    // Update NFT contract with the correct loyalty contract address
    await nft.updateLoyaltyContractAddress(loyalty.address);

    // Add a restaurant
    await loyalty.addRestaurant(
      restaurantName,
      restaurantDescription,
      restaurantOwner.address,
      welcomeNFTURI,
      merchandise
    );
  });

  describe("Restaurant Registration with NFT Settings", function () {
    it("Should store restaurant with NFT settings correctly", async function () {
      const restaurant = await loyalty.restaurants(1);
      expect(restaurant.name).to.equal(restaurantName);
      expect(restaurant.description).to.equal(restaurantDescription);
      expect(restaurant.owner).to.equal(restaurantOwner.address);
      expect(restaurant.isActive).to.equal(true);
      expect(restaurant.welcomeNFTURI).to.equal(welcomeNFTURI);
      expect(restaurant.merchandise).to.equal(merchandise);
    });
  });

  describe("Customer Registration with Welcome NFT", function () {
    it("Should register customer without NFT when no restaurant is selected", async function () {
      await loyalty.connect(customer).registerCustomer("John Doe", 0);
      
      const customerInfo = await loyalty.customers(customer.address);
      expect(customerInfo.name).to.equal("John Doe");
      expect(customerInfo.isRegistered).to.equal(true);
      
      // Check that no NFT was minted
      const hasNFT = await nft.customerHasWelcomeNFT(customer.address);
      expect(hasNFT).to.equal(false);
    });

    it("Should register customer and mint welcome NFT when restaurant is selected", async function () {
      await loyalty.connect(customer).registerCustomer("Jane Smith", 1);
      
      const customerInfo = await loyalty.customers(customer.address);
      expect(customerInfo.name).to.equal("Jane Smith");
      expect(customerInfo.isRegistered).to.equal(true);
      
      // Check that NFT was minted
      const hasNFT = await nft.customerHasWelcomeNFT(customer.address);
      expect(hasNFT).to.equal(true);
      
      // Check NFT ownership
      const nftIds = await loyalty.getCustomerWelcomeNFTs(customer.address);
      expect(nftIds.length).to.equal(1);
      
      // Check NFT details
      const restaurantId = await nft.tokenRestaurant(nftIds[0]);
      expect(restaurantId).to.equal(1);
      
      const isRedeemed = await nft.tokenRedeemed(nftIds[0]);
      expect(isRedeemed).to.equal(false);
    });
  });

  describe("NFT Redemption", function () {
    beforeEach(async function () {
      // Register customer with welcome NFT
      await loyalty.connect(customer).registerCustomer("Jane Smith", 1);
      
      // Get the NFT ID
      this.nftIds = await loyalty.getCustomerWelcomeNFTs(customer.address);
    });

    it("Should allow customer to redeem their welcome NFT", async function () {
      // Redeem the NFT
      await loyalty.connect(customer).redeemWelcomeNFT(this.nftIds[0]);
      
      // Check that NFT is marked as redeemed
      const isRedeemed = await nft.tokenRedeemed(this.nftIds[0]);
      expect(isRedeemed).to.equal(true);
      
      // Check through the loyalty contract
      const isRedeemedViaLoyalty = await loyalty.isWelcomeNFTRedeemed(this.nftIds[0]);
      expect(isRedeemedViaLoyalty).to.equal(true);
    });

    it("Should not allow non-owner to redeem NFT", async function () {
      // Try to redeem the NFT from a different account
      await expect(
        loyalty.connect(restaurantOwner).redeemWelcomeNFT(this.nftIds[0])
      ).to.be.revertedWith("Not the owner of this NFT");
    });

    it("Should not allow redeeming the same NFT twice", async function () {
      // Redeem the NFT
      await loyalty.connect(customer).redeemWelcomeNFT(this.nftIds[0]);
      
      // Try to redeem again
      await expect(
        loyalty.connect(customer).redeemWelcomeNFT(this.nftIds[0])
      ).to.be.revertedWith("NFT already redeemed");
    });
  });

  describe("Restaurant Merchandise Information", function () {
    it("Should return the correct merchandise information", async function () {
      const restaurantMerchandise = await loyalty.getRestaurantMerchandise(1);
      expect(restaurantMerchandise).to.equal(merchandise);
    });
  });
});
