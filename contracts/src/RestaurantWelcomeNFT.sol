// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RestaurantWelcomeNFT
 * @dev NFT contract for welcome gifts in restaurant loyalty program
 */
contract RestaurantWelcomeNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to restaurant ID
    mapping(uint256 => uint256) public tokenRestaurant;
    
    // Mapping from token ID to redemption status
    mapping(uint256 => bool) public tokenRedeemed;
    
    // Mapping from customer address to whether they received a welcome NFT
    mapping(address => bool) public hasReceivedWelcomeNFT;
    
    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;
    
    // Address of the RestaurantLoyalty contract
    address public loyaltyContractAddress;
    
    // Events
    event WelcomeNFTMinted(address indexed customer, uint256 tokenId, uint256 restaurantId);
    event NFTRedeemed(address indexed customer, uint256 tokenId, uint256 restaurantId);
    
    /**
     * @dev Constructor sets the name and symbol of the NFT
     * @param _loyaltyContractAddress Address of the RestaurantLoyalty contract
     */
    constructor(address _loyaltyContractAddress) ERC721("Restaurant Welcome Gift", "RWG") {
        loyaltyContractAddress = _loyaltyContractAddress;
    }
    
    /**
     * @dev Set token URI
     * @param tokenId ID of the token
     * @param _tokenURI URI for the token metadata
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    /**
     * @dev Get token URI
     * @param tokenId ID of the token
     * @return URI for the token metadata
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        
        string memory _tokenURI = _tokenURIs[tokenId];
        
        // If there is no base URI, return the token URI.
        if (bytes(_tokenURI).length > 0) {
            return _tokenURI;
        }
        
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Mint a new welcome NFT for a customer
     * @param _customer Address of the customer
     * @param _restaurantId ID of the restaurant offering the welcome gift
     * @param _tokenURI URI for the token metadata
     * @return New token ID
     */
    function mintWelcomeNFT(address _customer, uint256 _restaurantId, string memory _tokenURI) 
        public 
        returns (uint256) 
    {
        require(msg.sender == loyaltyContractAddress || msg.sender == owner(), "Not authorized");
        require(!hasReceivedWelcomeNFT[_customer], "Customer already received welcome NFT");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(_customer, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        
        tokenRestaurant[newTokenId] = _restaurantId;
        tokenRedeemed[newTokenId] = false;
        hasReceivedWelcomeNFT[_customer] = true;
        
        emit WelcomeNFTMinted(_customer, newTokenId, _restaurantId);
        
        return newTokenId;
    }
    
    /**
     * @dev Redeem an NFT for merchandise
     * @param _tokenId ID of the token to redeem
     */
    function redeemNFT(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "Not the owner of this NFT");
        require(!tokenRedeemed[_tokenId], "NFT already redeemed");
        
        tokenRedeemed[_tokenId] = true;
        
        emit NFTRedeemed(msg.sender, _tokenId, tokenRestaurant[_tokenId]);
    }
    
    /**
     * @dev Check if a customer has a welcome NFT
     * @param _customer Address of the customer
     * @return Whether the customer has received a welcome NFT
     */
    function customerHasWelcomeNFT(address _customer) public view returns (bool) {
        return hasReceivedWelcomeNFT[_customer];
    }
    
    /**
     * @dev Get all NFTs owned by a customer
     * @param _customer Address of the customer
     * @return Array of token IDs owned by the customer
     */
    function getCustomerNFTs(address _customer) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(_customer);
        uint256[] memory tokenIds = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_customer, i);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Update the loyalty contract address
     * @param _newLoyaltyContractAddress New address of the RestaurantLoyalty contract
     */
    function updateLoyaltyContractAddress(address _newLoyaltyContractAddress) public onlyOwner {
        loyaltyContractAddress = _newLoyaltyContractAddress;
    }
}
