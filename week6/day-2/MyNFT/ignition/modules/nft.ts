import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MyNFTModule = buildModule("MyNFTModule", (m) => {
  // Get the deployer account automatically
  const deployer = m.getAccount(0);

  console.log("deployer", deployer);
  

  const myNFT = m.contract("MyNFT", [deployer]);

  return { myNFT };
});

export default MyNFTModule;
