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
  const amountIn = ethers.parseUnits("5000", 6); // Swap 5,000 USDC
  const amountOutMin = 0; // In production, use a slippage calculation!
  const path = [USDCAddress, WETHAddress];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  // 2. APPROVE the Router (Crucial Step for Token-to-Token swaps)
  console.log("Approving Router...");
  const approveTx = await USDC.approve(UNIRouter, amountIn, {
    gasLimit: 100000,
  });
  await approveTx.wait();

  const usdcBalBefore = await USDC.balanceOf(TokenHolder);
  const wethBalBefore = await WETH.balanceOf(TokenHolder);

  console.log(
    "Before: USDC:",
    ethers.formatUnits(usdcBalBefore, 6),
    "WETH:",
    ethers.formatEther(wethBalBefore),
  );

  // 3. EXECUTE Swap
  console.log("Swapping Exact Tokens for Tokens...");
  const swapTx = await ROUTER.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    TokenHolder,
    deadline,
    { gasLimit: 1000000 },
  );
  await swapTx.wait();

  const usdcBalAfter = await USDC.balanceOf(TokenHolder);
  const wethBalAfter = await WETH.balanceOf(TokenHolder);

  console.log(
    "After:  USDC:",
    ethers.formatUnits(usdcBalAfter, 6),
    "WETH:",
    ethers.formatEther(wethBalAfter),
  );
  console.log(
    "Swapped:",
    ethers.formatUnits(usdcBalBefore - usdcBalAfter, 6),
    "USDC for WETH",
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
