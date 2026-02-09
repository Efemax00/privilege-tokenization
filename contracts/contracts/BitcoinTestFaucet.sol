// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BitcoinTestFaucet is ERC20 {
    uint256 public constant CLAIM_AMOUNT = 0.0001 ether;
    uint256 public constant COOLDOWN = 1 days;

    mapping(address => uint256) public lastClaimTime;

    event Claimed(address indexed user, uint256 amount);

    constructor() ERC20("Bitcoin Test Token", "TESTBTC") {
        _mint(address(this), 1000 ether);
    }

    function claim() external {
        require(
            block.timestamp >= lastClaimTime[msg.sender] + COOLDOWN,
            "Must wait 24 hours between claims"
        );

        lastClaimTime[msg.sender] = block.timestamp;
        _mint(msg.sender, CLAIM_AMOUNT);

        emit Claimed(msg.sender, CLAIM_AMOUNT);
    }
}
