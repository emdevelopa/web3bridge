import { expect } from "chai";
import { network } from "hardhat";

describe("Uniswap V2: swapExactTokensForTokens", function () {
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
    const WETH = await ethers.getContractAt("IERC20", WETH_ADDR, signer);
    const ROUTER = await ethers.getContractAt(
      "IUniswapV2Router",
      ROUTER_ADDR,
      signer,
    );

    return { ethers, signer, USDC, WETH, ROUTER };
  }

  it("Should spend exactly 5,000 USDC and receive WETH", async function () {
    const { signer, ethers, USDC, WETH, ROUTER } = await deployFixture();

    const amountIn = ethers.parseUnits("5000", 6);
    const amountOutMin = 0; // Set to 0 for testing; use getAmountsOut for production
    const path = [USDC_ADDR, WETH_ADDR];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    await USDC.approve(ROUTER_ADDR, amountIn, { gasLimit: 100000 });

    const usdcBefore = await USDC.balanceOf(signer.address);
    const wethBefore = await WETH.balanceOf(signer.address);

    await ROUTER.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      signer.address,
      deadline,
      { gasLimit: 500000 },
    );

    const usdcAfter = await USDC.balanceOf(signer.address);
    const wethAfter = await WETH.balanceOf(signer.address);

    expect(usdcBefore - usdcAfter).to.equal(amountIn);
    expect(wethAfter).to.be.greaterThan(wethBefore);
  });
});
