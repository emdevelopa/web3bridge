import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("MultiSig", function () {
  async function deploy() {
    const [user1, user2, user3, user4, user5] = await ethers.getSigners();

    const multiSig = await ethers.deployContract("MultiSig", [
      user1.address,
      user2.address,
      user3.address,
    ]);

    console.log(user1.address);

    return { user1, user2, user3, user4, user5, multiSig };
  }

  it("Should initiate a transaction", async function () {
    const { multiSig, user1, user5 } = await deploy();

    await multiSig.connect(user1).CreateTransactions(3n);

  });

  it("Allows Signing of transaction and initiates withdrawal", async () => {
    const { multiSig, user1, user2, user5 } = await deploy();
    await multiSig.connect(user1).CreateTransactions(3n);

    await multiSig.connect(user2).signTransaction1(1n);
    await multiSig.connect(user2).signTransaction2(1n);

    expect((await multiSig.getTransactionById(1n)).signer1).to.equal(true);
  
  });


});
