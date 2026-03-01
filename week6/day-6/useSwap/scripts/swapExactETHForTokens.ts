import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect({
  network: "hardhatMainnet",
  chainType: "l1",
});

const main = async () => {
  const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH_ADDR = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const ROUTER_ADDR = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const TOKEN_HOLDER = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await networkHelpers.impersonateAccount(TOKEN_HOLDER);
  const signer = await ethers.getSigner(TOKEN_HOLDER);

  const USDC = await ethers.getContractAt("IERC20", USDC_ADDR, signer);
  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router",
    ROUTER_ADDR,
    signer,
  );

  // 1. Parameters
  const ethToSpend = ethers.parseEther("1"); // Spending exactly 1 ETH
  const amountOutMin = 0; // In production, calculate this based on slippage
  const path = [WETH_ADDR, USDC_ADDR];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const ethBalBefore = await ethers.provider.getBalance(signer.address);
  const usdcBalBefore = await USDC.balanceOf(signer.address);

  console.log(
    "Before: ETH:",
    ethers.formatEther(ethBalBefore),
    "USDC:",
    ethers.formatUnits(usdcBalBefore, 6),
  );

  // 2. Swap (No Approve needed for ETH)
  console.log(`Swapping 1 ETH for USDC...`);
  const tx = await ROUTER.swapExactETHForTokens(
    amountOutMin,
    path,
    signer.address,
    deadline,
    {
      value: ethToSpend, // This is the "Exact ETH" part
      gasLimit: 500000,
    },
  );
  await tx.wait();

  const ethBalAfter = await ethers.provider.getBalance(signer.address);
  const usdcBalAfter = await USDC.balanceOf(signer.address);

  console.log(
    "After:  ETH:",
    ethers.formatEther(ethBalAfter),
    "USDC:",
    ethers.formatUnits(usdcBalAfter, 6),
  );
  console.log(
    "Received USDC:",
    ethers.formatUnits(usdcBalAfter - usdcBalBefore, 6),
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
