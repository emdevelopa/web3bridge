import { expect } from "chai";
import { network } from "hardhat";

describe("Todo", function () {
  // Hardhat 3 helper
  const getEthers = async () => (await network.connect()).ethers;

  async function deploy() {
    const ethers = await getEthers();

    const todo = await ethers.getContractFactory("Todo");

    return { todo };
  }


  it("should get all todos", async ()=>{})
});
