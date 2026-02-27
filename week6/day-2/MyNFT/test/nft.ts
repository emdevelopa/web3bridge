import { expect } from "chai";
import { network } from "hardhat";


const { ethers } = await network.connect();

describe("MyNFT", function () {
  async function deployToken() {
    const [owner, user1, user2] = await ethers.getSigners();

    const mintAmount = ethers.parseEther("1");

    // Use the factory pattern or deployContract
    const nft = await ethers.deployContract("MyNFT", [owner.address]);

    return { nft, owner, user1 };
  }

  it("Should deploy correctly", async function () {
    const { nft } = await deployToken();
    expect(await nft.name()).to.equal("MyNFT");
    expect(await nft.symbol()).to.equal("MFT");    
  });
    
    it("Sshould mint nft", async () => {
        const { nft,owner, user1 } = await deployToken();
        
        await nft.connect(owner).mintNFT(user1.address, 1n, "https://gateway.pinata.cloud/ipfs/bafkreibcgf7ch72my4yhujfemcecjnjrdnscy7xwhytertumpmy5czo7ca")
        // expect(await nft.)
    })
    
});
