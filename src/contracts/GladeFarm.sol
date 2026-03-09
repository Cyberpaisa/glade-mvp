// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title GladeFarm — RWA-backed farming game on Avalanche
/// @notice Core mechanic: buySeed splits payment 75% RWA / 25% Game
contract GladeFarm is ERC721, Ownable {
    IERC20 public paymentToken;

    address public rwaPool;
    address public gamePool;

    uint256 public nextTokenId;
    uint256 public totalRWADeposited;
    uint256 public totalGameDeposited;

    struct SeedType {
        string name;
        uint256 cost;
        uint256 growthTime;
        uint256 monthlyYield;
        bool active;
    }

    struct PlantedSeed {
        uint256 seedTypeId;
        uint256 plantedAt;
        bool harvested;
    }

    mapping(uint256 => SeedType) public seedTypes;
    mapping(uint256 => PlantedSeed) public plantedSeeds;
    uint256 public seedTypeCount;

    event SeedPurchased(address indexed buyer, uint256 tokenId, uint256 seedTypeId, uint256 rwaAmount, uint256 gameAmount);
    event YieldClaimed(address indexed owner, uint256 tokenId, uint256 amount);

    constructor(address _paymentToken, address _rwaPool, address _gamePool)
        ERC721("GLADE Farm NFT", "GLADE")
        Ownable(msg.sender)
    {
        paymentToken = IERC20(_paymentToken);
        rwaPool = _rwaPool;
        gamePool = _gamePool;

        _addSeed("Cafe Colombiano", 10 * 10**18, 30, 80 * 10**16);
        _addSeed("Vinedo",          25 * 10**18, 45, 210 * 10**16);
        _addSeed("Panel Solar",     50 * 10**18, 60, 450 * 10**16);
        _addSeed("Cacao",           15 * 10**18, 35, 120 * 10**16);
    }

    function _addSeed(string memory name, uint256 cost, uint256 growth, uint256 yield_) internal {
        seedTypes[seedTypeCount] = SeedType(name, cost, growth, yield_, true);
        seedTypeCount++;
    }

    function buySeed(uint256 seedTypeId) external returns (uint256) {
        SeedType memory seed = seedTypes[seedTypeId];
        require(seed.active, "Invalid seed");
        require(paymentToken.balanceOf(msg.sender) >= seed.cost, "Insufficient balance");

        uint256 rwaAmount = (seed.cost * 75) / 100;
        uint256 gameAmount = seed.cost - rwaAmount;

        paymentToken.transferFrom(msg.sender, rwaPool, rwaAmount);
        paymentToken.transferFrom(msg.sender, gamePool, gameAmount);

        totalRWADeposited += rwaAmount;
        totalGameDeposited += gameAmount;

        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);
        plantedSeeds[tokenId] = PlantedSeed(seedTypeId, block.timestamp, false);

        emit SeedPurchased(msg.sender, tokenId, seedTypeId, rwaAmount, gameAmount);
        return tokenId;
    }

    function isReady(uint256 tokenId) public view returns (bool) {
        PlantedSeed memory p = plantedSeeds[tokenId];
        if (p.harvested) return false;
        return block.timestamp >= p.plantedAt + seedTypes[p.seedTypeId].growthTime;
    }

    function claimYield(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(isReady(tokenId), "Not ready");
        require(!plantedSeeds[tokenId].harvested, "Already harvested");

        plantedSeeds[tokenId].harvested = true;
        uint256 yield_ = seedTypes[plantedSeeds[tokenId].seedTypeId].monthlyYield;

        emit YieldClaimed(msg.sender, tokenId, yield_);
    }

    function getEconomyStats() external view returns (uint256 rwa, uint256 game, uint256 seeds) {
        return (totalRWADeposited, totalGameDeposited, nextTokenId);
    }
}
