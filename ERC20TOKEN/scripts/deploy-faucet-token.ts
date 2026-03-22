import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const name = process.env.TOKEN_NAME ?? "FaucetToken";
  const symbol = process.env.TOKEN_SYMBOL ?? "FTK";

  const token = await ethers.deployContract("FaucetToken", [name, symbol]);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("FaucetToken deployed to:", address);
  console.log("Constructor args:", [name, symbol]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
