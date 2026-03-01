import { expect } from "chai";
import { network } from "hardhat";

describe("Uniswap V2: removeLiquidityETHWithPermit", function () {
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

  it("Should remove ETH liquidity without a separate approve call", async function () {
    const { ethers, signer, USDC, ROUTER, FACTORY } = await deployFixture();

    // 1. Setup: Add Liquidity
    const amountUSDC = ethers.parseUnits("1000", 6);
    const deadline = Math.floor(Date.now() / 1000) + 1200;
    await USDC.approve(ROUTER_ADDR, amountUSDC, { gasLimit: 100000 });
    await ROUTER.addLiquidityETH(
      USDC_ADDR,
      amountUSDC,
      0,
      0,
      HOLDER,
      deadline,
      { value: ethers.parseEther("1"), gasLimit: 800000 },
    );

    const pairAddr = await FACTORY.getPair(USDC_ADDR, WETH_ADDR);
    const LP = await ethers.getContractAt("IUniswapV2Pair", pairAddr, signer);
    const lpBalance = await LP.balanceOf(HOLDER);

    // 2. Generate Permit Signature
    const nonce = await LP.nonces(HOLDER);
    const domain = {
      name: "Uniswap V2",
      version: "1",
      chainId: 1,
      verifyingContract: pairAddr,
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
      nonce,
      deadline,
    };

    const signature = await signer.signTypedData(domain, types, values);
    const { v, r, s } = ethers.Signature.from(signature);

    // 3. Execute Removal
    await expect(
      ROUTER.removeLiquidityETHWithPermit(
        USDC_ADDR,
        lpBalance,
        0,
        0,
        HOLDER,
        deadline,
        false,
        v,
        r,
        s,
        { gasLimit: 1000000 },
      ),
    ).to.emit(LP, "Transfer"); // LP tokens burned

    expect(await LP.balanceOf(HOLDER)).to.equal(0n);
  });
});
