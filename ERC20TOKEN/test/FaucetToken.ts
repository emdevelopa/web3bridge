import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("FaucetToken", function () {
  const NAME = "Pluto";
  const SYMBOL = "PLT";
  const DECIMALS = 18n;
  const MAX_SUPPLY = 10_000_000n * 10n ** DECIMALS;
  const FAUCET_AMOUNT = 2n * 10n ** DECIMALS;
  const COOLDOWN = 24 * 60 * 60;

  async function deploy() {
    const token = await ethers.deployContract("FaucetToken");
    const [owner, alice, bob] = await ethers.getSigners();
    return { token, owner, alice, bob };
  }

  it("initializes name, symbol, owner and zero supply", async function () {
    const { token, owner } = await deploy();

    // comparing the token name
    expect(await token.TokenName()).to.equal(NAME);

    // comparing the token symbol
    expect(await token.Symbol()).to.equal(SYMBOL);

    // checking if owner is owner
    expect(await token.owner()).to.equal(owner.address);

    // initial suppply should be 0
    expect(await token.TotalSupply()).to.equal(0n);
  });

 

  it("should allow user to request tokens", async function () {
    const { token, owner, alice } = await deploy();

    await token.connect(alice).requestToken();

    expect(await token.balanceOf(alice.address)).to.equal(FAUCET_AMOUNT);
  });

  it("should not allow requesting twice within 24 hours", async function () {
    const { token, owner, alice } = await deploy();

    await token.connect(alice).requestToken();

    await expect(
      token.connect(alice).requestToken(),
    ).to.be.revertedWithCustomError(token, "WAIT_FOR_24_HOURS");
  });

  it("should allow request after 24 hours", async function () {
    const { token, owner, alice } = await deploy();

    await token.connect(alice).requestToken();

    // move time forward by 1 day
    await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);

    await ethers.provider.send("evm_mine", []);

    await token.connect(alice).requestToken();

    expect(await token.balanceOf(alice.address)).to.equal(FAUCET_AMOUNT * 2n);
  });

  it("should allow different users to request independently", async function () {
    const { token, owner, alice, bob } = await deploy();

    await token.connect(alice).requestToken();
    await token.connect(bob).requestToken();

    expect(await token.balanceOf(alice.address)).to.equal(FAUCET_AMOUNT);

    expect(await token.balanceOf(bob.address)).to.equal(FAUCET_AMOUNT);
  });

  it("owner should be able to mint", async function () {
    const { token, owner, alice, bob } = await deploy();

    await token.mint(alice.address, FAUCET_AMOUNT);

    expect(await token.balanceOf(alice.address)).to.equal(FAUCET_AMOUNT);
  });
});
