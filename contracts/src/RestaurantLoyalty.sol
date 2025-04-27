// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RestaurantLoyaltyToken.sol";
import "./RestaurantWelcomeNFT.sol";

/**
 * @title RestaurantLoyalty
 * @dev Main contract for restaurant loyalty program on Polkadot/Moonbeam
 */
contract RestaurantLoyalty is Ownable {
    // Struct to store restaurant information
    struct Restaurant {
        string name;
        string description;
        address owner;
        bool isActive;
        string welcomeNFTURI;
        string merchandise;
    }
    
    // Struct to store customer information
    struct Customer {
        string name;
        uint256 totalPoints;
        bool isRegistered;
    }
    
    // Mapping of restaurant ID to Restaurant struct
    mapping(uint256 => Restaurant) public restaurants;
    
    // Mapping of customer address to Customer struct
    mapping(address => Customer) public customers;
    
    // Mapping of restaurant ID to customer address to points
    mapping(uint256 => mapping(address => uint256)) public restaurantPoints;
    
    // Restaurant ID counter
    uint256 public restaurantCount;
    
    // ERC20 token for loyalty points
    ERC20 public loyaltyToken;
    
    // Welcome NFT contract
    RestaurantWelcomeNFT public welcomeNFT;
    
    // Events
    event RestaurantAdded(uint256 indexed restaurantId, string name, address owner);
    event RestaurantUpdated(uint256 indexed restaurantId, string name, address owner);
    event RestaurantStatusChanged(uint256 indexed restaurantId, bool isActive);
    event CustomerRegistered(address indexed customer, string name);
    event PointsAwarded(uint256 indexed restaurantId, address indexed customer, uint256 points);
    event PointsRedeemed(uint256 indexed restaurantId, address indexed customer, uint256 points);
    event WelcomeNFTMinted(address indexed customer, uint256 indexed restaurantId, uint256 tokenId);
    event WelcomeNFTRedeemed(address indexed customer, uint256 indexed restaurantId, uint256 tokenId);
    
    /**
     * @dev Constructor sets the token address and initializes the contract
     * @param _loyaltyToken Address of the ERC20 token used for loyalty points
     * @param _welcomeNFT Address of the Welcome NFT contract
     */
    constructor(address _loyaltyToken, address _welcomeNFT) {
        loyaltyToken = ERC20(_loyaltyToken);
        welcomeNFT = RestaurantWelcomeNFT(_welcomeNFT);
        restaurantCount = 0;
    }
    
    /**
     * @dev Add a new restaurant to the loyalty program
     * @param _name Name of the restaurant
     * @param _description Description of the restaurant
     * @param _owner Address of the restaurant owner
     * @param _welcomeNFTURI URI for the welcome NFT
     * @param _merchandise Description of the free merchandise offered
     */
    function addRestaurant(
        string memory _name, 
        string memory _description, 
        address _owner, 
        string memory _welcomeNFTURI,
        string memory _merchandise
    ) public onlyOwner {
        restaurantCount++;
        restaurants[restaurantCount] = Restaurant({
            name: _name,
            description: _description,
            owner: _owner,
            isActive: true,
            welcomeNFTURI: _welcomeNFTURI,
            merchandise: _merchandise
        });
        
        emit RestaurantAdded(restaurantCount, _name, _owner);
    }
    
    /**
     * @dev Update restaurant information
     * @param _restaurantId ID of the restaurant to update
     * @param _name New name of the restaurant
     * @param _description New description of the restaurant
     * @param _owner New owner address of the restaurant
     * @param _welcomeNFTURI New URI for the welcome NFT
     * @param _merchandise New description of the free merchandise offered
     */
    function updateRestaurant(
        uint256 _restaurantId, 
        string memory _name, 
        string memory _description, 
        address _owner,
        string memory _welcomeNFTURI,
        string memory _merchandise
    ) public {
        require(_restaurantId <= restaurantCount, "Restaurant does not exist");
        require(msg.sender == restaurants[_restaurantId].owner || msg.sender == owner(), "Not authorized");
        
        restaurants[_restaurantId].name = _name;
        restaurants[_restaurantId].description = _description;
        restaurants[_restaurantId].owner = _owner;
        restaurants[_restaurantId].welcomeNFTURI = _welcomeNFTURI;
        restaurants[_restaurantId].merchandise = _merchandise;
        
        emit RestaurantUpdated(_restaurantId, _name, _owner);
    }
    
    /**
     * @dev Change restaurant active status
     * @param _restaurantId ID of the restaurant
     * @param _isActive New active status
     */
    function setRestaurantStatus(uint256 _restaurantId, bool _isActive) public {
        require(_restaurantId <= restaurantCount, "Restaurant does not exist");
        require(msg.sender == restaurants[_restaurantId].owner || msg.sender == owner(), "Not authorized");
        
        restaurants[_restaurantId].isActive = _isActive;
        
        emit RestaurantStatusChanged(_restaurantId, _isActive);
    }
    
    /**
     * @dev Register a new customer
     * @param _name Name of the customer
     * @param _restaurantId ID of the restaurant to receive welcome NFT from (0 for no welcome NFT)
     */
    function registerCustomer(string memory _name, uint256 _restaurantId) public {
        require(!customers[msg.sender].isRegistered, "Customer already registered");
        
        customers[msg.sender] = Customer({
            name: _name,
            totalPoints: 0,
            isRegistered: true
        });
        
        emit CustomerRegistered(msg.sender, _name);
        
        // Mint welcome NFT if restaurant ID is provided and valid
        if (_restaurantId > 0 && _restaurantId <= restaurantCount) {
            require(restaurants[_restaurantId].isActive, "Restaurant is not active");
            
            // Check if customer already has a welcome NFT
            if (!welcomeNFT.customerHasWelcomeNFT(msg.sender)) {
                uint256 tokenId = welcomeNFT.mintWelcomeNFT(
                    msg.sender, 
                    _restaurantId, 
                    restaurants[_restaurantId].welcomeNFTURI
                );
                
                emit WelcomeNFTMinted(msg.sender, _restaurantId, tokenId);
            }
        }
    }
    
    /**
     * @dev Award loyalty points to a customer
     * @param _restaurantId ID of the restaurant
     * @param _customer Address of the customer
     * @param _points Number of points to award
     */
    function awardPoints(uint256 _restaurantId, address _customer, uint256 _points) public {
        require(_restaurantId <= restaurantCount, "Restaurant does not exist");
        require(restaurants[_restaurantId].isActive, "Restaurant is not active");
        require(msg.sender == restaurants[_restaurantId].owner, "Not restaurant owner");
        require(customers[_customer].isRegistered, "Customer not registered");
        
        restaurantPoints[_restaurantId][_customer] += _points;
        customers[_customer].totalPoints += _points;
        
        // Mint loyalty tokens to the customer
        // Cast the ERC20 token to RestaurantLoyaltyToken to access mint function
        RestaurantLoyaltyToken tokenContract = RestaurantLoyaltyToken(address(loyaltyToken));
        tokenContract.mint(_customer, _points);
        
        emit PointsAwarded(_restaurantId, _customer, _points);
    }
    
    /**
     * @dev Redeem loyalty points
     * @param _restaurantId ID of the restaurant
     * @param _points Number of points to redeem
     */
    function redeemPoints(uint256 _restaurantId, uint256 _points) public {
        require(_restaurantId <= restaurantCount, "Restaurant does not exist");
        require(restaurants[_restaurantId].isActive, "Restaurant is not active");
        require(customers[msg.sender].isRegistered, "Customer not registered");
        require(restaurantPoints[_restaurantId][msg.sender] >= _points, "Insufficient points");
        
        restaurantPoints[_restaurantId][msg.sender] -= _points;
        customers[msg.sender].totalPoints -= _points;
        
        // Burn loyalty tokens from the customer
        require(loyaltyToken.transferFrom(msg.sender, address(this), _points), "Token transfer failed");
        
        emit PointsRedeemed(_restaurantId, msg.sender, _points);
    }
    
    /**
     * @dev Redeem welcome NFT for free merchandise
     * @param _tokenId ID of the NFT token to redeem
     */
    function redeemWelcomeNFT(uint256 _tokenId) public {
        // Verify the caller owns the NFT
        require(welcomeNFT.ownerOf(_tokenId) == msg.sender, "Not the owner of this NFT");
        
        // Get the restaurant ID associated with the NFT
        uint256 restaurantId = welcomeNFT.tokenRestaurant(_tokenId);
        
        // Verify the restaurant exists and is active
        require(restaurantId <= restaurantCount, "Restaurant does not exist");
        require(restaurants[restaurantId].isActive, "Restaurant is not active");
        
        // Redeem the NFT
        welcomeNFT.redeemNFT(_tokenId);
        
        emit WelcomeNFTRedeemed(msg.sender, restaurantId, _tokenId);
    }
    
    /**
     * @dev Get customer points for a specific restaurant
     * @param _restaurantId ID of the restaurant
     * @param _customer Address of the customer
     * @return Points balance for the customer at the restaurant
     */
    function getCustomerPoints(uint256 _restaurantId, address _customer) public view returns (uint256) {
        return restaurantPoints[_restaurantId][_customer];
    }
    
    /**
     * @dev Get customer total points across all restaurants
     * @param _customer Address of the customer
     * @return Total points balance for the customer
     */
    function getCustomerTotalPoints(address _customer) public view returns (uint256) {
        return customers[_customer].totalPoints;
    }
    
    /**
     * @dev Get customer welcome NFTs
     * @param _customer Address of the customer
     * @return Array of token IDs owned by the customer
     */
    function getCustomerWelcomeNFTs(address _customer) public view returns (uint256[] memory) {
        return welcomeNFT.getCustomerNFTs(_customer);
    }
    
    /**
     * @dev Check if a welcome NFT has been redeemed
     * @param _tokenId ID of the NFT token
     * @return Whether the NFT has been redeemed
     */
    function isWelcomeNFTRedeemed(uint256 _tokenId) public view returns (bool) {
        return welcomeNFT.tokenRedeemed(_tokenId);
    }
    
    /**
     * @dev Get merchandise description for a restaurant
     * @param _restaurantId ID of the restaurant
     * @return Description of the free merchandise offered
     */
    function getRestaurantMerchandise(uint256 _restaurantId) public view returns (string memory) {
        require(_restaurantId <= restaurantCount, "Restaurant does not exist");
        return restaurants[_restaurantId].merchandise;
    }
}
