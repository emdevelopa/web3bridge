import { expect } from "chai";
import { network } from "hardhat";

describe("MyNFT", function () {
  // Hardhat 3 helper
  const getEthers = async () => (await network.connect()).ethers;

  async function deployTodo() {
    const ethers = await getEthers();
    // Use the factory pattern or deployContract
    const nft = await ethers.deployContract("MyNFT");
    return { nft };
  }

  it("Should deploy correctly", async function () {
    const { nft } = await deployTodo();
    expect(await nft.name()).to.equal("MyNFT");
    expect(await nft.symbol()).to.equal("MNFT");
  });
});
