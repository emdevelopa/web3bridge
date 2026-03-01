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

  // 1. Get LP Token and Balance
  const pairAddress = await FACTORY.getPair(USDC_ADDR, WETH_ADDR);
  const LP = await ethers.getContractAt("IUniswapV2Pair", pairAddress, signer);
  const lpBalance = await LP.balanceOf(HOLDER);

  if (lpBalance === 0n)
    throw new Error("No LP tokens found. Run addLiquidityETH first.");

  // 2. Prepare Permit Data
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const nonce = await LP.nonces(HOLDER);
  const chainId = (await ethers.provider.getNetwork()).chainId;

  // EIP-712 Domain & Types
  const domain = {
    name: "Uniswap V2",
    version: "1",
    chainId: chainId,
    verifyingContract: pairAddress,
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const values = {
    owner: HOLDER,
    spender: ROUTER_ADDR,
    value: lpBalance,
    nonce: nonce,
    deadline: deadline,
  };

  // 3. Sign and Execute
  console.log("Signing Permit...");
  const signature = await signer.signTypedData(domain, types, values);
  const sig = ethers.Signature.from(signature);

  console.log("Executing removeLiquidityETHWithPermit...");
  const tx = await ROUTER.removeLiquidityETHWithPermit(
    USDC_ADDR,
    lpBalance,
    0,
    0, // amountMin
    HOLDER,
    deadline,
    false, // approveMax
    sig.v,
    sig.r,
    sig.s,
    { gasLimit: 1000000 },
  );

  await tx.wait();
  console.log("Successfully removed liquidity using Permit!");
};

main().catch(console.error);
