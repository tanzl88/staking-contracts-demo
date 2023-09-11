// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingContract is Ownable, ReentrancyGuard {
    // Address of the staking token
    address public tokenAddress;

//    Vesting duration
    uint256 public vestingDuration;

    // Mapping to track stakers and their stakes
    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public startTime;

    // Whitelisted addresses
    mapping(address => bool) public whitelist;

    // Events to log staking and withdrawal
    event Staked(address staker, uint256 amount);
    event Withdrawn(address staker, uint256 amount);

    // Modifiers to check if an address is whitelisted
    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "You are not whitelisted.");
        _;
    }

    // Constructor to set the owner
    constructor(address _tokenAddress, uint256 _vestingDuration) Ownable() {
        tokenAddress = _tokenAddress;
        vestingDuration = _vestingDuration;
    }

    // Add or remove addresses from the whitelist
    function updateWhitelist(address _address, bool _status) external onlyOwner {
        whitelist[_address] = _status;
    }

    // Stake tokens with a vesting schedule
    function stake(uint256 _amount) external onlyWhitelisted nonReentrant {
        require(_amount > 0, "Staked amount must be greater than 0");

        // Ensure the sender is not already staking
        require(stakedAmount[msg.sender] == 0, "You have an active stake");

        // Transfer tokens from the sender to this contract
        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        // Record the staking details
        stakedAmount[msg.sender] = _amount;
        startTime[msg.sender] = block.timestamp;

        emit Staked(msg.sender, _amount);
    }

    // Withdraw staked tokens after the vesting period
    function withdraw() external nonReentrant {
        require(stakedAmount[msg.sender] > 0, "No stake to withdraw");

        uint256 unlockTime = startTime[msg.sender] + vestingDuration;

        // Ensure the vesting period has ended
        require(block.timestamp >= unlockTime, "Vesting period has not ended yet");

        // Transfer the staked tokens to the sender
        uint256 amountToTransfer = stakedAmount[msg.sender];
        stakedAmount[msg.sender] = 0;
        startTime[msg.sender] = 0;

        emit Withdrawn(msg.sender, amountToTransfer);

        // Transfer the tokens back to the sender
        IERC20 token = IERC20(tokenAddress);
        require(token.transfer(msg.sender, amountToTransfer), "Token transfer failed");
    }

    function getStakedAmount(address _address) public view returns (uint256) {
        return stakedAmount[_address];
    }

    function isWhitelisted(address _address) public view returns (bool) {
        return whitelist[_address];
    }
}
