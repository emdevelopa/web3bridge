import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect({
  network: "hardhatMainnet",
  chainType: "l1",
});

const main = async () => {
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const TokenHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await networkHelpers.impersonateAccount(TokenHolder);
  const impersonatedSigner = await ethers.getSigner(TokenHolder);

  const USDC = await ethers.getContractAt(
    "IERC20",
    USDCAddress,
    impersonatedSigner,
  );
  const WETH = await ethers.getContractAt(
    "IERC20",
    WETHAddress,
    impersonatedSigner,
  );
  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router",
    UNIRouter,
    impersonatedSigner,
  );

  // 1. Define Swap Parameters
  const amountOut = ethers.parseEther("1"); // I want exactly 1 WETH
  const amountInMax = ethers.parseUnits("4000", 6); // Max I will pay is 4,000 USDC
  const path = [USDCAddress, WETHAddress];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  // 2. APPROVE the Router to spend the MAX amount
  console.log("Approving Router...");
  const approveTx = await USDC.approve(UNIRouter, amountInMax, {
    gasLimit: 100000,
  });
  await approveTx.wait();

  const usdcBalBefore = await USDC.balanceOf(TokenHolder);
  const wethBalBefore = await WETH.balanceOf(TokenHolder);

  console.log("Before Swap:");
  console.log("- USDC:", ethers.formatUnits(usdcBalBefore, 6));
  console.log("- WETH:", ethers.formatEther(wethBalBefore));

  // 3. EXECUTE Swap
  console.log(`Swapping USDC for exactly 1 WETH (Max Spend: 4000 USDC)...`);
  const swapTx = await ROUTER.swapTokensForExactTokens(
    amountOut,
    amountInMax,
    path,
    TokenHolder,
    deadline,
    { gasLimit: 500000 }, // Staying safe under the EDR cap
  );

  const receipt = await swapTx.wait();

  const usdcBalAfter = await USDC.balanceOf(TokenHolder);
  const wethBalAfter = await WETH.balanceOf(TokenHolder);

  console.log("After Swap:");
  console.log("- USDC:", ethers.formatUnits(usdcBalAfter, 6));
  console.log("- WETH:", ethers.formatEther(wethBalAfter));

  const actualSpent = usdcBalBefore - usdcBalAfter;
  console.log("Actual USDC spent:", ethers.formatUnits(actualSpent, 6));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
