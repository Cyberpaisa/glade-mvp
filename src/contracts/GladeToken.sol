// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title GladeToken — USDC-like stablecoin for GLADE testnet demo
contract GladeToken is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 100 * 10**18;
    uint256 public constant FAUCET_COOLDOWN = 1 hours;
    mapping(address => uint256) public lastFaucetClaim;

    constructor() ERC20("GLADE USD", "gUSD") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10**18);
    }

    function claimFaucet() external {
        require(block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN, "Cooldown");
        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }
}
