import { expect } from "chai";
import { network } from "hardhat";

describe("Uniswap V2: swapExactETHForTokens", function () {
  const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH_ADDR = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const ROUTER_ADDR = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const TOKEN_HOLDER = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  async function deployFixture() {
    const { ethers, networkHelpers } = await network.connect({
      network: "hardhatMainnet",
      chainType: "l1",
    });

    await networkHelpers.impersonateAccount(TOKEN_HOLDER);
    const signer = await ethers.getSigner(TOKEN_HOLDER);

    const USDC = await ethers.getContractAt("IERC20", USDC_ADDR, signer);
    const ROUTER = await ethers.getContractAt(
      "IUniswapV2Router",
      ROUTER_ADDR,
      signer,
    );

    return { ethers, signer, USDC, ROUTER };
  }

  it("Should swap exactly 1 ETH and receive variable USDC", async function () {
    const { ethers, signer, USDC, ROUTER } = await deployFixture();

    const ethToSpend = ethers.parseEther("1");
    const amountOutMin = 100; // Expect at least 100 USDC (safety check)
    const path = [WETH_ADDR, USDC_ADDR];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    const usdcBefore = await USDC.balanceOf(signer.address);
    const ethBefore = await ethers.provider.getBalance(signer.address);

    const tx = await ROUTER.swapExactETHForTokens(
      amountOutMin,
      path,
      signer.address,
      deadline,
      { value: ethToSpend, gasLimit: 500000 },
    );
    const receipt = await tx.wait();

    // Account for gas spent
    const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

    const usdcAfter = await USDC.balanceOf(signer.address);
    const ethAfter = await ethers.provider.getBalance(signer.address);

    // 1. Verify ETH decreased by (spent + gas)
    expect(ethBefore - ethAfter).to.equal(ethToSpend + gasUsed);

    // 2. Verify USDC increased
    expect(usdcAfter).to.be.greaterThan(usdcBefore);
    expect(usdcAfter - usdcBefore).to.be.at.least(amountOutMin);
  });

  it("Should revert if output tokens are less than amountOutMin", async function () {
    const { signer, ethers, ROUTER } = await deployFixture();

    const ethToSpend = ethers.parseEther("1");
    // Set an impossible minimum (e.g., 1 ETH = 1,000,000 USDC)
    const amountOutMin = ethers.parseUnits("1000000", 6);
    const path = [WETH_ADDR, USDC_ADDR];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    await expect(
      ROUTER.swapExactETHForTokens(
        amountOutMin,
        path,
        signer.address,
        deadline,
        { value: ethToSpend, gasLimit: 500000 },
      ),
    ).to.be.revertedWith("UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT");
  });
});
