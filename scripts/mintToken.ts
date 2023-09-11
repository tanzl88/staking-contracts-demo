// - npx hardhat run scripts/mintToken.ts --network [bsc|bsc_test]
import { ethers } from "hardhat";

// inputs
const tokenAddress = "0xD243805353884D606c30c69FA0440E5D87Bf53d7";
const recipient = "0xCF0CadA5875635353Acc0bEfF48b95AEa23202dd";

async function main() {
    const token = await ethers.getContractAt("GenericERC20", tokenAddress);
    await token.mint(recipient, ethers.utils.parseUnits("100000000000", "ether"));
}

main();
