import { network } from "hardhat";

// 2026 Modern Hardhat 3 Connection Pattern
const { ethers, networkHelpers } = await network.connect({
  network: "hardhatMainnet", // Ensure this matches your config key
  chainType: "l1",
});

const main = async () => {
  // Mainnet Addresses
  const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI_ADDR = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const ROUTER_ADDR = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const FACTORY_ADDR = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

  // Impersonate a holder who has both tokens (or has LP tokens already)
  const HOLDER = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await networkHelpers.impersonateAccount(HOLDER);
  const signer = await ethers.getSigner(HOLDER);

  // Contract Instances
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

  // 1. ADD LIQUIDITY FIRST (To ensure we have LP tokens to remove)
  const amountUSDC = ethers.parseUnits("1000", 6);
  const amountDAI = ethers.parseUnits("1000", 18);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  console.log("--- Step 1: Adding Liquidity ---");
  await (
    await USDC.approve(ROUTER_ADDR, amountUSDC, { gasLimit: 100000 })
  ).wait();
  await (
    await DAI.approve(ROUTER_ADDR, amountDAI, { gasLimit: 100000 })
  ).wait();

  const addTx = await ROUTER.addLiquidity(
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
  await addTx.wait();
  console.log("Liquidity added successfully.");

  // 2. GET LP TOKEN DETAILS
  const pairAddress = await FACTORY.getPair(USDC_ADDR, DAI_ADDR);
  const LP_TOKEN = await ethers.getContractAt("IERC20", pairAddress, signer);
  const lpBalance = await LP_TOKEN.balanceOf(signer.address);

  console.log("LP Token Address:", pairAddress);
  console.log("LP Balance to remove:", lpBalance.toString());

  // 3. REMOVE LIQUIDITY
  console.log("--- Step 2: Removing Liquidity ---");

  // MUST approve the Router to spend the LP Tokens
  console.log("Approving LP Tokens...");
  await (
    await LP_TOKEN.approve(ROUTER_ADDR, lpBalance, { gasLimit: 100000 })
  ).wait();

  const usdcBefore = await USDC.balanceOf(signer.address);
  const daiBefore = await DAI.balanceOf(signer.address);
  
  const removeTx = await ROUTER.removeLiquidity(
    USDC_ADDR,
    DAI_ADDR,
    lpBalance,
    0, // amountAMin (Set 0 for testing, use slippage calc for production)
    0, // amountBMin
    signer.address,
    deadline,
    { gasLimit: 1000000 }, // Manual limit to stay under EDR cap
  );
  await removeTx.wait();

  const usdcAfter = await USDC.balanceOf(signer.address);
  const daiAfter = await DAI.balanceOf(signer.address);

  console.log("--- Results ---");
  console.log("USDC Received:", ethers.formatUnits(usdcAfter - usdcBefore, 6));
  console.log("DAI Received:", ethers.formatUnits(daiAfter - daiBefore, 18));
  console.log("Liquidity removed successfully!");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
