import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("SaveEther", function () {
  async function deploy() {
    const [owner, user1, user2] = await ethers.getSigners();

    const token = await ethers.deployContract("ER20");
    const saveEther = await ethers.deployContract("SaveEther");

    const mintAmount = ethers.parseEther("1000");
    await token.mint(user1.address, mintAmount);
    await token.mint(user2.address, mintAmount);

    return { saveEther, token, owner, user1, user2, mintAmount };
  }
    
  describe("depositEther", function () {
    it("Should deposit ether and update user balance", async function () {
      const { saveEther, user1 } = await deploy();
      const amount = ethers.parseEther("1");

      await saveEther.connect(user1).depositEther({ value: amount });

      expect(await saveEther.connect(user1).getBalanceEther()).to.equal(amount);
    });

    it("Should update the contract's ether balance after deposit", async function () {
      const { saveEther, user1 } = await deploy();
      const amount = ethers.parseEther("2");

      await saveEther.connect(user1).depositEther({ value: amount });

      expect(await saveEther.getContractBalanceEther()).to.equal(amount);
    });

    it("Should emit a Deposit event on ether deposit", async function () {
      const { saveEther, user1 } = await deploy();
      const amount = ethers.parseEther("1");

      await expect(saveEther.connect(user1).depositEther({ value: amount }))
        .to.emit(saveEther, "Deposit")
        .withArgs(ethers.ZeroAddress, user1.address, amount);
    });

    it("Should accumulate deposits from the same user", async function () {
      const { saveEther, user1 } = await deploy();

      await saveEther
        .connect(user1)
        .depositEther({ value: ethers.parseEther("1") });
      await saveEther
        .connect(user1)
        .depositEther({ value: ethers.parseEther("2") });

      expect(await saveEther.connect(user1).getBalanceEther()).to.equal(
        ethers.parseEther("3"),
      );
    });
  });
 
});
