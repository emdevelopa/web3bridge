import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect({
  network: "hardhatMainnet",
  chainType: "l1",
});

async function main() {
  const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const ROUTER_ADDR = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const HOLDER = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await networkHelpers.impersonateAccount(HOLDER);
  const signer = await ethers.getSigner(HOLDER);
  const USDC = await ethers.getContractAt("IERC20", USDC_ADDR, signer);
  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router",
    ROUTER_ADDR,
    signer,
  );

  const amountUSDC = ethers.parseUnits("1000", 6);
  const amountETH = ethers.parseEther("0.5");
  const deadline = Math.floor(Date.now() / 1000) + 600;

  // console.log("===================");
  // const beforeUSDCbal = await USDC.balanceOf(HOLDER);
  // console.log(beforeUSDCbal);
  

  await USDC.approve(ROUTER_ADDR, amountUSDC, { gasLimit: 100000 });

  console.log("Adding ETH Liquidity...");
  const tx = await ROUTER.addLiquidityETH(
    USDC_ADDR,
    amountUSDC,
    0,
    0,
    signer.address,
    deadline,
    { value: amountETH, gasLimit: 500000 },
  );
  await tx.wait();
  console.log("Liquidity Added!");
}
main().catch(console.error);
