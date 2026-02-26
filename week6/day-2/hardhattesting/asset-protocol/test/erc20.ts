import { expect, use } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("ER20", function () {
  async function deployToken() {
    const [owner, user1, user2] = await ethers.getSigners();

    const mintAmount = ethers.parseEther("1");

    // Use the factory pattern or deployContract
    const erc20 = await ethers.deployContract("ER20");
    await erc20.mint(owner.address, mintAmount);
    await erc20.mint(user1.address, mintAmount);

    return { erc20, owner, user1, user2, mintAmount };
  }

  describe("Getting the Token Name and Symbole", () => {
    it("should get symbol of the token", async function () {
      const { erc20 } = await deployToken();
      const symbol = await erc20.symbol();

      expect(symbol).to.equal("TE");
    });

    it("should get symbol of the name", async function () {
      const { erc20 } = await deployToken();
      const symbol = await erc20.name();

      expect(symbol).to.equal("Teni");
    });
  });

  it("should confirm if token minting works for the acccouts", async () => {
    const { erc20, user1, mintAmount } = await deployToken();
    expect(await erc20.balanceOf(user1.address)).to.equal(mintAmount);
    // console.log(await erc20.balanceOf(user1.address));
  });

  it("should transfer token from one account to another", async () => {
    const { erc20, owner, user1, mintAmount } = await deployToken();
    const trfAmount = 1n;
    await erc20.transfer(user1.address, trfAmount);
    expect(await erc20.balanceOf(user1.address)).to.equal(mintAmount + 1n);
    expect(await erc20.balanceOf(owner.address)).to.equal(mintAmount - 1n);
  });

  describe("Token Approval and Transfer", () => {
    it("it should approve token", async () => {
      const { erc20, owner, user1, user2, mintAmount } = await deployToken();
      // Approving user1 to spend from owners balance
      await erc20.Approve(user1.address, 4n);

      // checking if the allowance has been given
      expect(await erc20.allowance(owner.address, user1.address)).to.equal(4n);
    });

    it("it should test the transferFrom", async () => {
      const { erc20, owner, user1, user2, mintAmount } = await deployToken();
      await erc20.Approve(user1.address, 4n);
      const trfAmount = 2n;

      await erc20.connect(user1).transferFrom(owner, user2, trfAmount);

      expect(await erc20.balanceOf(user2.address)).to.equal(trfAmount);
      expect(await erc20.allowance(owner.address, user1.address)).to.equal(2n);
      expect(await erc20.balanceOf(owner.address)).to.equal(
        mintAmount - trfAmount,
      );
    });
  });
});
