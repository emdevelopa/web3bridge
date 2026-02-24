import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("ER20", function () {
   async function deployTodo() {
    //  const ethers = await getEthers();
     // Use the factory pattern or deployContract
     const erc20 = await ethers.deployContract("ER20");
     return { erc20 };
   }
  
   it("should get symbol of the token", async function () {
     const { erc20 } = await deployTodo();
     const symbol = await erc20.symbol()

     expect(symbol).to.equal("TE")

    //  expect(todos.length).to.equal(0);
   });
  
  it("should get symbol of the name", async function () {
    const { erc20 } = await deployTodo();
    const symbol = await erc20.name();

    expect(symbol).to.equal("Teni");

    //  expect(todos.length).to.equal(0);
  });
});


