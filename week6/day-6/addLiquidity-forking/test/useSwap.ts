import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("UseSwap", function () {
    async function deploy() {
        
        const useSwap = await ethers.deployContract("UseSwap");

        return {useSwap}
        
    }
    it("Should swap ETH For Exact Tokens", async function () {
        const { useSwap } = await deploy();
        
        await useSwap.handleSwapETH();
  });

  
});
