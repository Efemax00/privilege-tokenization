// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PrivilegeToken is ERC20, Ownable, ReentrancyGuard {
    // Influencer structure
    struct Influencer {
        address influencerAddress;
        string name;
        bool verified;
        uint256 totalTokensIssued;
    }

    // Access Tier structure
    struct AccessTier {
        string name;
        uint256 priceInWei;
        string description;
    }

    // State variables
    mapping(address => Influencer) public influencers;
    mapping(address => AccessTier[]) public accessTiers;
    mapping(address => mapping(address => mapping(uint256 => uint64)))
        public accessExpiry;

    uint256 public platformFeePercentage = 10000; // 100% for testing
    address public platformFeeReceiver;

    // Events
    event InfluencerRegistered(address indexed influencer, string name);
    event AccessTierCreated(
        address indexed influencer,
        string tierName,
        uint256 price
    );
    event AccessPurchased(
        address indexed user,
        address indexed influencer,
        uint256 tierIndex
    );

    constructor(
        address _platformFeeReceiver
    ) ERC20("Privilege Access Token", "PRIV") Ownable(msg.sender) {
        platformFeeReceiver = _platformFeeReceiver;
    }

    // Register influencer
    function registerInfluencer(
        address _influencer,
        string memory _name
    ) external onlyOwner {
        require(_influencer != address(0), "Invalid address");
        require(bytes(_name).length > 0, "Name cannot be empty");

        influencers[_influencer] = Influencer({
            influencerAddress: _influencer,
            name: _name,
            verified: true,
            totalTokensIssued: 0
        });

        emit InfluencerRegistered(_influencer, _name);
    }

    // Create access tier
    function createAccessTier(
        address _influencer,
        string memory _tierName,
        uint256 _priceInWei,
        string memory _description
    ) external {
        require(_influencer != address(0), "Invalid influencer address");
        require(bytes(_tierName).length > 0, "Name cannot be empty");
        require(_priceInWei > 0, "Price must be greater than 0");

        accessTiers[_influencer].push(
            AccessTier({
                name: _tierName,
                priceInWei: _priceInWei,
                description: _description
            })
        );

        emit AccessTierCreated(_influencer, _tierName, _priceInWei);
    }

    // Buy access
    function buyAccess(
        address _influencer,
        uint256 _tierIndex,
        uint256 _durationDays
    ) external payable nonReentrant {
        require(msg.value > 0, "Payment required");
        require(influencers[_influencer].verified, "Influencer not registered");
        require(_tierIndex < accessTiers[_influencer].length, "Invalid tier");
        require(_durationDays >= 1, "Duration must be at least 1 day");

        AccessTier memory tier = accessTiers[_influencer][_tierIndex];
        require(msg.value >= tier.priceInWei, "Insufficient payment");

        // Mark access as purchased
        accessExpiry[msg.sender][_influencer][_tierIndex] = uint64(
            block.timestamp + (_durationDays * 1 days)
        );

        // Calculate fee
        uint256 fee = (msg.value * platformFeePercentage) / 10000;
        uint256 influencerAmount = msg.value - fee;

        // Transfer funds
        (bool influencerSuccess, ) = _influencer.call{value: influencerAmount}(
            ""
        );
        require(influencerSuccess, "Transfer to influencer failed");

        (bool platformSuccess, ) = platformFeeReceiver.call{value: fee}("");
        require(platformSuccess, "Transfer to platform failed");

        emit AccessPurchased(msg.sender, _influencer, _tierIndex);
    }

    // Check access
    function hasValidAccess(
        address _user,
        address _influencer,
        uint256 _tierIndex
    ) external view returns (bool) {
        return accessExpiry[_user][_influencer][_tierIndex] > block.timestamp;
    }

    // Get influencer
    function getInfluencer(
        address _influencer
    ) external view returns (Influencer memory) {
        return influencers[_influencer];
    }

    // Get access tiers
    function getAccessTiers(
        address _influencer
    ) external view returns (AccessTier[] memory) {
        return accessTiers[_influencer];
    }

    // Receive ETH
    receive() external payable {}
}
