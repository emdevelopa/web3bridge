import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FaucetTokenModule", (m) => {
  const counter = m.contract("FaucetToken");

  // m.call(counter, "incBy", [5n]);

  return { counter };
});
