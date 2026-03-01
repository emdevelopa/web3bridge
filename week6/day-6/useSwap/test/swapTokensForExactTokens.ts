import { expect } from "chai";
import { network } from "hardhat";

describe("Uniswap V2: swapTokensForExactTokens", function () {
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

  it("Should receive exactly 1 WETH by spending USDC", async function () {
    const { signer, ethers, USDC, WETH, ROUTER } = await deployFixture();

    const amountOut = ethers.parseEther("1"); // 1 WETH
    const amountInMax = ethers.parseUnits("4000", 6); // Max 4000 USDC
    const path = [USDC_ADDR, WETH_ADDR];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    await USDC.approve(ROUTER_ADDR, amountInMax, { gasLimit: 100000 });

    const wethBefore = await WETH.balanceOf(signer.address);

    await ROUTER.swapTokensForExactTokens(
      amountOut,
      amountInMax,
      path,
      signer.address,
      deadline,
      { gasLimit: 500000 },
    );

    const wethAfter = await WETH.balanceOf(signer.address);
    expect(wethAfter - wethBefore).to.equal(amountOut);
  });

  it("Should fail if the price is too high (EXCESSIVE_INPUT_AMOUNT)", async function () {
    const { signer, ethers ,USDC, ROUTER } = await deployFixture();

    const amountOut = ethers.parseEther("100"); // Impossible price
    const amountInMax = ethers.parseUnits("1", 6);
    const path = [USDC_ADDR, WETH_ADDR];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    await USDC.approve(ROUTER_ADDR, amountInMax, { gasLimit: 100000 });

    await expect(
      ROUTER.swapTokensForExactTokens(
        amountOut,
        amountInMax,
        path,
        signer.address,
        deadline,
        { gasLimit: 500000 },
      ),
    ).to.be.revertedWith("UniswapV2Router: EXCESSIVE_INPUT_AMOUNT");
  });
});
