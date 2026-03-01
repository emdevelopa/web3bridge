import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect({
  network: "hardhatMainnet",
  chainType: "l1",
});

const main = async () => {
  const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH_ADDR = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const ROUTER_ADDR = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const FACTORY_ADDR = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const HOLDER = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

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

  const amountUSDC = ethers.parseUnits("1000", 6);
  const amountETH = ethers.parseEther("0.5");
  const deadline = Math.floor(Date.now() / 1000) + 600;

  // --- STEP 1: ADD LIQUIDITY ETH ---
  console.log("Adding ETH Liquidity to get LP tokens...");
  await (
    await USDC.approve(ROUTER_ADDR, amountUSDC, { gasLimit: 100000 })
  ).wait();

  const addTx = await ROUTER.addLiquidityETH(
    USDC_ADDR,
    amountUSDC,
    0,
    0,
    signer.address,
    deadline,
    { value: amountETH, gasLimit: 800000 },
  );
  await addTx.wait();

  // --- STEP 2: GET LP TOKEN ---
  const pairAddress = await FACTORY.getPair(USDC_ADDR, WETH_ADDR);
  const LP_TOKEN = await ethers.getContractAt("IERC20", pairAddress, signer);
  const lpBalance = await LP_TOKEN.balanceOf(signer.address);
  console.log("LP Balance found:", lpBalance.toString());

  // --- STEP 3: REMOVE LIQUIDITY ETH ---
  console.log("Approving LP Tokens for removal...");
  await (
    await LP_TOKEN.approve(ROUTER_ADDR, lpBalance, { gasLimit: 100000 })
  ).wait();

  const ethBefore = await ethers.provider.getBalance(signer.address);
  const usdcBefore = await USDC.balanceOf(signer.address);

  console.log("Removing ETH Liquidity...");
  const removeTx = await ROUTER.removeLiquidityETH(
    USDC_ADDR,
    lpBalance,
    0, // amountTokenMin
    0, // amountETHMin
    signer.address,
    deadline,
    { gasLimit: 1000000 },
  );
  await removeTx.wait();

  const ethAfter = await ethers.provider.getBalance(signer.address);
  const usdcAfter = await USDC.balanceOf(signer.address);

  console.log("--- Summary ---");
  console.log("USDC Received:", ethers.formatUnits(usdcAfter - usdcBefore, 6));
  console.log(
    "ETH Received (approx):",
    ethers.formatEther(ethAfter - ethBefore),
  );
};

main().catch(console.error);
