// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RestaurantLoyaltyToken.sol";
import "./RestaurantLoyalty.sol";
import "./RestaurantWelcomeNFT.sol";

/**
 * @title RestaurantLoyaltyFactory
 * @dev Factory contract to deploy the complete restaurant loyalty system
 */
contract RestaurantLoyaltyFactory {
    // Event emitted when a new loyalty system is deployed
    event LoyaltySystemDeployed(address tokenAddress, address nftAddress, address loyaltyAddress);
    
    /**
     * @dev Deploy a new restaurant loyalty system
     * @return tokenAddress Address of the deployed token contract
     * @return nftAddress Address of the deployed NFT contract
     * @return loyaltyAddress Address of the deployed loyalty contract
     */
    function deployLoyaltySystem() public returns (address tokenAddress, address nftAddress, address loyaltyAddress) {
        // Deploy the loyalty token
        RestaurantLoyaltyToken token = new RestaurantLoyaltyToken();
        
        // Deploy the welcome NFT contract with a temporary address
        RestaurantWelcomeNFT welcomeNFT = new RestaurantWelcomeNFT(address(0));
        
        // Deploy the main loyalty contract with the token address and NFT address
        RestaurantLoyalty loyalty = new RestaurantLoyalty(address(token), address(welcomeNFT));
        
        // Update the NFT contract with the correct loyalty contract address
        welcomeNFT.updateLoyaltyContractAddress(address(loyalty));
        
        // Transfer ownership of the loyalty contract to the caller
        loyalty.transferOwnership(msg.sender);
        
        // Transfer ownership of the token to the loyalty contract
        token.transferOwnership(address(loyalty));
        
        // Transfer ownership of the NFT contract to the loyalty contract
        welcomeNFT.transferOwnership(address(loyalty));
        
        // Emit event
        emit LoyaltySystemDeployed(address(token), address(welcomeNFT), address(loyalty));
        
        return (address(token), address(welcomeNFT), address(loyalty));
    }
}
