import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CounterModule", (m) => {
  const counter = m.contract("Todo");

  // m.call(counter, "incBy", [5n]);

  return { counter };
});
