import { expect } from "chai";
import { network } from "hardhat";

describe("Uniswap V2: swapTokensForExactETH", function () {
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

  it("Should receive exactly 1 ETH for USDC", async function () {
    const { ethers, signer, USDC, ROUTER } = await deployFixture();

    const amountOutETH = ethers.parseEther("1");
    const amountInMaxUSDC = ethers.parseUnits("5000", 6);
    const path = [USDC_ADDR, WETH_ADDR];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    await USDC.approve(ROUTER_ADDR, amountInMaxUSDC, { gasLimit: 100000 });

    const ethBefore = await ethers.provider.getBalance(signer.address);

    const tx = await ROUTER.swapTokensForExactETH(
      amountOutETH,
      amountInMaxUSDC,
      path,
      signer.address,
      deadline,
      { gasLimit: 500000 },
    );
    const receipt = await tx.wait();

    // Calculate gas spent to accurately check ETH balance
    const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

    const ethAfter = await ethers.provider.getBalance(signer.address);

    // (ETH After) should be (ETH Before + 1 ETH - Gas)
    expect(ethAfter).to.equal(ethBefore + amountOutETH - gasUsed);
  });

  it("Should revert if price of 100 ETH exceeds max USDC", async function () {
    const { signer,ethers, USDC, ROUTER } = await deployFixture();

    const amountOutETH = ethers.parseEther("100");
    const amountInMaxUSDC = ethers.parseUnits("10", 6); // Only 10 USDC for 100 ETH
    const path = [USDC_ADDR, WETH_ADDR];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    await USDC.approve(ROUTER_ADDR, amountInMaxUSDC, { gasLimit: 100000 });

    await expect(
      ROUTER.swapTokensForExactETH(
        amountOutETH,
        amountInMaxUSDC,
        path,
        signer.address,
        deadline,
        { gasLimit: 500000 },
      ),
    ).to.be.revertedWith("UniswapV2Router: EXCESSIVE_INPUT_AMOUNT");
  });
});
