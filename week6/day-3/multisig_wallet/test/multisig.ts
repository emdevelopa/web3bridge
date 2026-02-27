import { expect } from "chai";
import { formatEther } from "ethers";
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

    // console.log(user1.address);

    return { user1, user2, user3, user4, user5, multiSig };
  }

  it("Should initiate a transaction", async function () {
    const { multiSig, user1, user5 } = await deploy();

    await multiSig.connect(user1).CreateTransactions(3n);
  });

  it("Allows Signing of transaction and initiates withdrawal", async () => {
    const { multiSig, user1, user2, user5 } = await deploy();

    // Fund contract with 1 ETH
    await user5.sendTransaction({
      to: await multiSig.getAddress(),
      value: ethers.parseEther("1"),
    });

    console.log(
      "contract balance",
      formatEther(await ethers.provider.getBalance(multiSig.getAddress())),
    );

    const amount = ethers.parseEther("1");

    console.log("amounut", formatEther(amount));

    await multiSig.connect(user1).CreateTransactions(amount);

    const balBefore = await ethers.provider.getBalance(user1.address);

    console.log("balance before", formatEther(balBefore));
    await multiSig.connect(user2).signTransaction1(amount);
    await multiSig.connect(user2).signTransaction2(amount);

    const balAfter = await ethers.provider.getBalance(user1.address);
    console.log("balance after", formatEther(balAfter));
      console.log(
        "contract balance after",
        formatEther(await ethers.provider.getBalance(multiSig.getAddress())),
      );

    console.log("the trx", await multiSig.getTransactionById(1n));

    expect((await multiSig.getTransactionById(1n)).signer1).to.equal(false);
    expect((await multiSig.getTransactionById(1n)).signer2).to.equal(false);
    expect((await multiSig.getTransactionById(1n)).signed).to.equal(false);
    // expect(expect multiSig.connect(user1).getBalance())
  });
});
