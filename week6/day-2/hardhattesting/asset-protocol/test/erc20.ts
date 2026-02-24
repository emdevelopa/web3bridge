import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("ER", function () {
   async function deployToken() {
    //  const ethers = await getEthers();
     // Use the factory pattern or deployContract
     const erc20 = await ethers.deployContract("ER");
     return { erc20 };
   }
  
   it("should get symbol of the token", async function () {
     const { erc20 } = await deployToken();
     const symbol = await erc20.symbol()

     expect(symbol).to.equal("TE")

   });
  
  it("should get symbol of the name", async function () {
    const { erc20 } = await deployToken();
    const symbol = await erc20.name();

    expect(symbol).to.equal("Teni");
  });
});


