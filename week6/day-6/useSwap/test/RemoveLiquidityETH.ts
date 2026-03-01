import { expect } from "chai";
import { network } from "hardhat";

describe("Uniswap V2: removeLiquidityETH", function () {
  const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH_ADDR = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const ROUTER_ADDR = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const FACTORY_ADDR = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const HOLDER = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  async function deployFixture() {
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

  it("Should successfully remove ETH liquidity", async function () {
    const { ethers, signer, USDC, ROUTER, FACTORY } = await deployFixture();

    // Setup: Add Liquidity
    const amtUSDC = ethers.parseUnits("1000", 6);
    const amtETH = ethers.parseEther("1");
    const deadline = Math.floor(Date.now() / 1000) + 600;

    await USDC.approve(ROUTER_ADDR, amtUSDC, { gasLimit: 100000 });
    await ROUTER.addLiquidityETH(
      USDC_ADDR,
      amtUSDC,
      0,
      0,
      signer.address,
      deadline,
      { value: amtETH, gasLimit: 800000 },
    );

    const pairAddr = await FACTORY.getPair(USDC_ADDR, WETH_ADDR);
    const LP = await ethers.getContractAt("IERC20", pairAddr, signer);
    const lpBal = await LP.balanceOf(signer.address);

    // Removal Logic
    await LP.approve(ROUTER_ADDR, lpBal, { gasLimit: 100000 });

    const ethBefore = await ethers.provider.getBalance(signer.address);

    const tx = await ROUTER.removeLiquidityETH(
      USDC_ADDR,
      lpBal,
      0,
      0,
      signer.address,
      deadline,
      { gasLimit: 1000000 },
    );
    const receipt = await tx.wait();
    const gasSpent = receipt!.gasUsed * receipt!.gasPrice;

    const ethAfter = await ethers.provider.getBalance(signer.address);

    // Verify ETH was received (Balance after should be higher than before once gas is considered)
    expect(ethAfter + gasSpent).to.be.greaterThan(ethBefore);
  });
});
