import { expect, use } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("ER20", function () {
  async function deployToken() {
    const [owner, user1] = await ethers.getSigners();


    const mintAmount = ethers.parseEther("1");

    // Use the factory pattern or deployContract
    const erc20 = await ethers.deployContract("ER20");
    await erc20.mint(owner.address, mintAmount);
    await erc20.mint(user1.address, mintAmount);

    return { erc20, owner, user1, mintAmount};
  }

  
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

  it("should confirm if token minting works for the acccouts", async () => {
    const { erc20, user1, mintAmount } = await deployToken();
    expect(await erc20.balanceOf(user1.address)).to.equal(mintAmount);
    console.log(await erc20.balanceOf(user1.address));
  });

  it("should transfer token from one account to another", async () => {
    const { erc20, owner, user1, mintAmount } = await deployToken();
    const trfAmount = 1n;
    await erc20.connect(owner).transfer(user1.address, trfAmount);
    expect(await erc20.balanceOf(user1.address)).to.equal(mintAmount+1n)
    expect(await erc20.balanceOf(owner.address)).to.equal(mintAmount - 1n);
  })

  it



  
});


