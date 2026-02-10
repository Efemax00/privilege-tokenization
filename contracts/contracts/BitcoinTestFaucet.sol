// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BitcoinTestFaucet is ERC20 {
    uint256 public constant CLAIM_AMOUNT = 0.0001 ether;
    uint256 public constant REFERRAL_BONUS = 0.00005 ether; // 5% of claim
    uint256 public constant COOLDOWN = 1 days;

    mapping(address => uint256) public lastClaimTime;
    mapping(address => address) public referrer; // Who referred this user
    mapping(address => uint256) public referralCount; // How many people referred them
    mapping(address => uint256) public totalReferralBonus; // Total bonus earned

    event Claimed(address indexed user, uint256 amount);
    event ReferralBonus(
        address indexed referrer,
        address indexed newUser,
        uint256 amount
    );
    event ReferrerSet(address indexed user, address indexed referrer);

    constructor() ERC20("Bitcoin Test Token", "TESTBTC") {
        _mint(address(this), 1000 ether);
    }

    // Set referrer when first claiming with a ref link
    function setReferrer(address _referrer) external {
        require(_referrer != msg.sender, "Cannot refer yourself");
        require(_referrer != address(0), "Invalid referrer");
        require(referrer[msg.sender] == address(0), "Already has a referrer");

        referrer[msg.sender] = _referrer;
        emit ReferrerSet(msg.sender, _referrer);
    }

    // Claim tokens - gives bonus to referrer if they have one
    function claim() external {
        require(
            block.timestamp >= lastClaimTime[msg.sender] + COOLDOWN,
            "Must wait 24 hours between claims"
        );

        lastClaimTime[msg.sender] = block.timestamp;
        _mint(msg.sender, CLAIM_AMOUNT);

        // Give bonus to referrer on EVERY claim
        if (referrer[msg.sender] != address(0)) {
            address ref = referrer[msg.sender];
            _mint(ref, REFERRAL_BONUS);
            referralCount[ref]++;
            totalReferralBonus[ref] += REFERRAL_BONUS;
            emit ReferralBonus(ref, msg.sender, REFERRAL_BONUS);
        }

        emit Claimed(msg.sender, CLAIM_AMOUNT);
    }

    // Get user stats
    function getUserStats(
        address user
    )
        external
        view
        returns (
            uint256 balance,
            uint256 timeSinceLastClaim,
            address userReferrer,
            uint256 referrals,
            uint256 bonusEarned
        )
    {
        balance = balanceOf(user);
        timeSinceLastClaim = block.timestamp - lastClaimTime[user];
        userReferrer = referrer[user];
        referrals = referralCount[user];
        bonusEarned = totalReferralBonus[user];
    }
}
