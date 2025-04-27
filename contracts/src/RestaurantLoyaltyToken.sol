// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RestaurantLoyaltyToken
 * @dev ERC20 token for restaurant loyalty points
 */
contract RestaurantLoyaltyToken is ERC20, Ownable {
    constructor() ERC20("Restaurant Loyalty Token", "RLT") Ownable(msg.sender) {}

    /**
     * @dev Mint new tokens to a customer
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
