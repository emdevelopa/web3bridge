import { expect } from "chai";
import { network } from "hardhat";

// const { ethers } = await network.connect();
describe("Uniswap V2 Swap (Forking)", function () {
  // Define constants
  const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH_ADDR = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const ROUTER_ADDR = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const TOKEN_HOLDER = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  async function deploySwapFixture() {
    // 1. Connect to the network
    const { ethers, networkHelpers } = await network.connect({
      network: "hardhatMainnet",
      chainType: "l1",
    });

    // 2. Impersonate account
    await networkHelpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    // 3. Get contract instances
    const USDC = await ethers.getContractAt("IERC20", USDC_ADDR);
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDR);

    return { ethers, impersonatedSigner, USDC, ROUTER };
  }

  it("Should swap ETH for exact amount of USDC", async function () {
    const { ethers, impersonatedSigner, USDC, ROUTER } =
      await deploySwapFixture();

    const amountOut = ethers.parseUnits("10000", 6); // 10k USDC
    const path = [WETH_ADDR, USDC_ADDR];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    // Record balances before
    const usdcBalanceBefore = await USDC.balanceOf(impersonatedSigner.address);
    const ethBalanceBefore = await ethers.provider.getBalance(
      impersonatedSigner.address,
    );

    // Perform the swap
    const tx = await ROUTER.connect(impersonatedSigner).swapETHForExactTokens(
      amountOut,
      path,
      impersonatedSigner.address,
      deadline,
      {
        value: ethers.parseEther("5.0"),
        gasLimit: 1000000,
      },
    );
    await tx.wait();

    // Record balances after
    const usdcBalanceAfter = await USDC.balanceOf(impersonatedSigner.address);
    const ethBalanceAfter = await ethers.provider.getBalance(
      impersonatedSigner.address,
    );
 
    // 1. Check if USDC increased by exactly 10,000
    expect(usdcBalanceAfter - usdcBalanceBefore).to.equal(amountOut);

    // 2. Check if ETH balance decreased (Amount spent + gas)
    expect(ethBalanceAfter).to.be.lessThan(ethBalanceBefore);

    console.log("✅ Successfully swapped and verified 10,000 USDC");
  });
});
