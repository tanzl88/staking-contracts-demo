// - npx hardhat run scripts/checkAmountStacked.ts --network [bsc|bsc_test]
import { ethers } from "hardhat";

// inputs
const stakingContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const whitelistAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

async function main() {
    const stakingContract = await ethers.getContractAt("StakingContract", stakingContractAddress);
    const stakedAmount = await stakingContract.getStakedAmount(whitelistAddress);
    console.log(stakedAmount);
}

main();
