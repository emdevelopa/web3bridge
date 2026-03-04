import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

const main = async () => {
    // two token adresses

    // router adress

    // usdcHolder/]


};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});