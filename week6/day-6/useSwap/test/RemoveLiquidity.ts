import { expect } from "chai";
import { network } from "hardhat";

describe("Uniswap V2: removeLiquidity", function () {
  // Mainnet Addresses (2026)
  const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI_ADDR = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const ROUTER_ADDR = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const FACTORY_ADDR = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const HOLDER = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  async function deployFixture() {
    // Modern Hardhat 3 EDR Connection
    const { ethers, networkHelpers } = await network.connect({
      network: "hardhatMainnet",
      chainType: "l1",
    });

    await networkHelpers.impersonateAccount(HOLDER);
    const signer = await ethers.getSigner(HOLDER);

    const USDC = await ethers.getContractAt("IERC20", USDC_ADDR, signer);
    const DAI = await ethers.getContractAt("IERC20", DAI_ADDR, signer);
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

    return { ethers, signer, USDC, DAI, ROUTER, FACTORY };
  }

  it("Should successfully add and then remove USDC/DAI liquidity", async function () {
    const { signer,ethers, USDC, DAI, ROUTER, FACTORY } = await deployFixture();

    const amountUSDC = ethers.parseUnits("5000", 6);
    const amountDAI = ethers.parseUnits("5000", 18);
    const deadline = Math.floor(Date.now() / 1000) + 600;

    // --- STEP 1: ADD LIQUIDITY ---
    // Approve both tokens
    await USDC.approve(ROUTER_ADDR, amountUSDC, { gasLimit: 100000 });
    await DAI.approve(ROUTER_ADDR, amountDAI, { gasLimit: 100000 });

    await ROUTER.addLiquidity(
      USDC_ADDR,
      DAI_ADDR,
      amountUSDC,
      amountDAI,
      0, // amountAMin
      0, // amountBMin
      signer.address,
      deadline,
      { gasLimit: 1000000 },
    );

    // --- STEP 2: VERIFY LP TOKENS ---
    const pairAddr = await FACTORY.getPair(USDC_ADDR, DAI_ADDR);
    const LP = await ethers.getContractAt("IERC20", pairAddr, signer);
    const lpBalance = await LP.balanceOf(signer.address);

    expect(lpBalance).to.be.gt(0n, "Should have received LP tokens");

    // --- STEP 3: REMOVE LIQUIDITY ---
    // Record balances before removal
    const usdcBefore = await USDC.balanceOf(signer.address);
    const daiBefore = await DAI.balanceOf(signer.address);

    // Approve Router to spend LP tokens
    await LP.approve(ROUTER_ADDR, lpBalance, { gasLimit: 100000 });

    // Execute removal
    await expect(
      ROUTER.removeLiquidity(
        USDC_ADDR,
        DAI_ADDR,
        lpBalance,
        0, // amountAMin
        0, // amountBMin
        signer.address,
        deadline,
        { gasLimit: 1000000 },
      ),
    ).to.not.be.reverted;

    // --- STEP 4: ASSERTIONS ---
    const usdcAfter = await USDC.balanceOf(signer.address);
    const daiAfter = await DAI.balanceOf(signer.address);
    const lpAfter = await LP.balanceOf(signer.address);

    expect(usdcAfter).to.be.gt(usdcBefore, "USDC balance should increase");
    expect(daiAfter).to.be.gt(daiBefore, "DAI balance should increase");
    expect(lpAfter).to.equal(0n, "LP tokens should be burned");
  });
});
