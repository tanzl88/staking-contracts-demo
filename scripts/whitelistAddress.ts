// - npx hardhat run scripts/whitelistAddress.ts --network [bsc|bsc_test]
import { ethers } from "hardhat";

// inputs
const stakingContractAddress = "0xC288d45f7BC48d769371B8F75D8208Ee35c739c1";
const whitelistAddress = "0xCF0CadA5875635353Acc0bEfF48b95AEa23202dd";

async function main() {
    const stakingContract = await ethers.getContractAt("StakingContract", stakingContractAddress);
    await stakingContract.updateWhitelist(whitelistAddress, true);
}

main();
