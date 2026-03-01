import { expect } from "chai";
import { network } from "hardhat";

describe("Uniswap V2: addLiquidityETH", function () {
  // Mainnet Addresses (2026)
  const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH_ADDR = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const ROUTER_ADDR = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const FACTORY_ADDR = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const HOLDER = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  async function deployFixture() {
    // Connect using Hardhat 3 EDR Pattern
    const { ethers, networkHelpers } = await network.connect({
      network: "hardhatMainnet",
      chainType: "l1",
    });

    await networkHelpers.impersonateAccount(HOLDER);
    const signer = await ethers.getSigner(HOLDER);

    const USDC = await ethers.getContractAt("IERC20", USDC_ADDR, signer);
    const ROUTER = await ethers.getContractAt(
      "IUniswapV2Router",
      ROUTER_ADDR,
      signer,
    );
    const FACTORY = await ethers.getContractAt(
      "IUniswapV2Factory",
      FACTORY_ADDR,
      signer,
    );

    return { ethers, signer, USDC, ROUTER, FACTORY };
  }

  it("Should add USDC and ETH to the pool and receive LP tokens", async function () {
    const { ethers, signer, USDC, ROUTER, FACTORY } = await deployFixture();

    const amountUSDC = ethers.parseUnits("1000", 6); // 1,000 USDC
    const amountETH = ethers.parseEther("0.5"); // 0.5 ETH
    const deadline = Math.floor(Date.now() / 1000) + 600;

    // 1. Approve Router to spend USDC
    await USDC.approve(ROUTER_ADDR, amountUSDC, { gasLimit: 100000 });

    // 2. Track balances before
    const usdcBefore = await USDC.balanceOf(signer.address);
    const ethBefore = await ethers.provider.getBalance(signer.address);

    // 3. Execute addLiquidityETH
    const tx = await ROUTER.addLiquidityETH(
      USDC_ADDR,
      amountUSDC,
      0, // amountTokenMin (slippage check)
      0, // amountETHMin (slippage check)
      signer.address,
      deadline,
      {
        value: amountETH,
        gasLimit: 800000,
      },
    );

    const receipt = await tx.wait();
    const gasSpent = receipt!.gasUsed * receipt!.gasPrice;

    // 4. Get Pair Address and LP Balance
    const pairAddr = await FACTORY.getPair(USDC_ADDR, WETH_ADDR);
    const LP = await ethers.getContractAt("IERC20", pairAddr, signer);
    const lpBalance = await LP.balanceOf(signer.address);

    // 5. Assertions
    const usdcAfter = await USDC.balanceOf(signer.address);
    const ethAfter = await ethers.provider.getBalance(signer.address);

    // USDC should have decreased
    expect(usdcAfter).to.be.lt(usdcBefore, "USDC balance did not decrease");

    // ETH should have decreased by (amount + gas)
    // We use a small buffer or check that it's significantly less
    expect(ethAfter).to.be.lt(
      ethBefore - amountETH,
      "ETH balance did not decrease correctly",
    );

    // LP tokens should be greater than zero
    expect(lpBalance).to.be.gt(0n, "Did not receive LP tokens");

    console.log("✅ Liquidity Added. LP Balance:", lpBalance.toString());
  });

  it("Should revert if user has insufficient USDC", async function () {
    const { ethers, signer, USDC, ROUTER } = await deployFixture();

    // Try to add more USDC than the holder has
    const hugeAmount = ethers.parseUnits("999999999", 6);
    const deadline = Math.floor(Date.now() / 1000) + 600;

    await USDC.approve(ROUTER_ADDR, hugeAmount, { gasLimit: 100000 });

    await expect(
      ROUTER.addLiquidityETH(
        USDC_ADDR,
        hugeAmount,
        0,
        0,
        signer.address,
        deadline,
        { value: ethers.parseEther("0.1"), gasLimit: 800000 },
      ),
    ).to.be.reverted; // Typically reverts with 'STF' (SafeTransferFrom)
  });
});
