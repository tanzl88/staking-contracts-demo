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

    const mockToken = await deploy("GenericERC20", {
        from: deployer.address,
        log: true,
        skipIfAlreadyDeployed: true,
        args: ["Lynn Coin", "LYNN"],
    });

    console.log("Mock token deployed to:", mockToken.address);
};
export default func;
func.tags = ["Production", "Test", "Dev"];
