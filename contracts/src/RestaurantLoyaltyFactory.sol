// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RestaurantLoyaltyToken.sol";
import "./RestaurantLoyalty.sol";

/**
 * @title RestaurantLoyaltyFactory
 * @dev Factory contract to deploy the complete restaurant loyalty system
 */
contract RestaurantLoyaltyFactory {
    // Event emitted when a new loyalty system is deployed
    event LoyaltySystemDeployed(address tokenAddress, address loyaltyAddress);
    
    /**
     * @dev Deploy a new restaurant loyalty system
     * @return tokenAddress Address of the deployed token contract
     * @return loyaltyAddress Address of the deployed loyalty contract
     */
    function deployLoyaltySystem() public returns (address tokenAddress, address loyaltyAddress) {
        // Deploy the loyalty token
        RestaurantLoyaltyToken token = new RestaurantLoyaltyToken();
        
        // Deploy the main loyalty contract with the token address and set msg.sender as owner
        RestaurantLoyalty loyalty = new RestaurantLoyalty(address(token));
        
        // Transfer ownership of the loyalty contract to the caller
        loyalty.transferOwnership(msg.sender);
        
        // Transfer ownership of the token to the loyalty contract
        token.transferOwnership(address(loyalty));
        
        // Emit event
        emit LoyaltySystemDeployed(address(token), address(loyalty));
        
        return (address(token), address(loyalty));
    }
}
