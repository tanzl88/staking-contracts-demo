import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, ethers } = hre;
    const { deploy } = deployments;
    const [deployer, localTester] = await ethers.getSigners();
    if (hre.network.name === "hardhat" || hre.network.name === "localhost") {
        await setBalance(deployer.address, ethers.utils.parseUnits("100000000000", "ether"));
    }

    // Replace with the address of the token you want to use
    const vestingDuration = 10; // 10 seconds
    const mockTokenDeployed = await deployments.get("GenericERC20");
    const tokenAddress = mockTokenDeployed.address;
    const stakingContract = await deploy("StakingContract", {
        from: deployer.address,
        log: true,
        skipIfAlreadyDeployed: true,
        args: [tokenAddress, vestingDuration],
    });

    console.log("StakingContract deployed to:", stakingContract.address);
};
export default func;
func.tags = ["Production", "Test", "Dev"];
