import { expect } from "chai";
import { Contract, ContractFactory, Wallet } from "ethers";
import { ethers, deployments } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("StakingContract", function () {
    let stakingContract: Contract;
    let mockToken: Contract;
    let owner: SignerWithAddress;
    let localTester: SignerWithAddress;
    let staker: SignerWithAddress;
    let nonWhitelistedUser: SignerWithAddress;

    const stakingAmount = ethers.utils.parseEther("100"); // 100 tokens
    const vestingDuration = 10; // 1 hour

    beforeEach(async function () {
        await deployments.fixture();
        const stakingContractDeployed = await deployments.get("StakingContract");
        stakingContract = await ethers.getContractAt("StakingContract", stakingContractDeployed.address);
        [owner, localTester, staker, nonWhitelistedUser] = await ethers.getSigners();

        const mockTokenDeployed = await deployments.get("GenericERC20");
        mockToken = await ethers.getContractAt("GenericERC20", mockTokenDeployed.address);
        await mockToken.mint(staker.address, stakingAmount.mul(100));
        await mockToken.connect(staker).approve(stakingContract.address, stakingAmount);

        // Whitelist the staker
        await stakingContract.updateWhitelist(staker.address, true);
    });

    it("should allow a whitelisted user to stake tokens", async function () {
        await expect(stakingContract.connect(staker).stake(stakingAmount))
            .to.emit(stakingContract, "Staked")
            .withArgs(staker.address, stakingAmount);

        const stakedAmount = await stakingContract.getStakedAmount(staker.address);
        console.log("STAKED", stakedAmount);
        expect(stakedAmount).to.equal(stakingAmount);
        expect(await mockToken.balanceOf(staker.address)).to.equal(stakingAmount.mul(99));
    });

    it("should not allow non-whitelisted users to stake tokens", async function () {
        await mockToken.mint(nonWhitelistedUser.address, stakingAmount.mul(100));
        await mockToken.connect(nonWhitelistedUser).approve(stakingContract.address, stakingAmount);
        await expect(stakingContract.connect(nonWhitelistedUser).stake(stakingAmount)).to.be.revertedWith(
            "You are not whitelisted."
        );
    });

    it("should not allow staking if the user already has an active stake", async function () {
        await stakingContract.connect(staker).stake(stakingAmount);

        await expect(stakingContract.connect(staker).stake(stakingAmount)).to.be.revertedWith(
            "You have an active stake"
        );
    });

    it("should allow withdrawal after the vesting period", async function () {
        await stakingContract.connect(staker).stake(stakingAmount);

        // Increase time to simulate the vesting period
        await ethers.provider.send("evm_increaseTime", [vestingDuration + 1]);
        await ethers.provider.send("evm_mine", []);

        await expect(stakingContract.connect(staker).withdraw())
            .to.emit(stakingContract, "Withdrawn")
            .withArgs(staker.address, stakingAmount);

        const stakedAmount = await stakingContract.getStakedAmount(staker.address);
        expect(stakedAmount).to.equal(0);
        expect(await mockToken.balanceOf(staker.address)).to.equal(stakingAmount.mul(100));
    });

    it("should not allow withdrawal before the vesting period ends", async function () {
        await stakingContract.connect(staker).stake(stakingAmount);

        await expect(stakingContract.connect(staker).withdraw()).to.be.revertedWith("Vesting period has not ended yet");
    });

    // Add more test cases as needed
});
