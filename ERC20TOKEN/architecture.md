# ERC20 Faucet Token Architecture

## Overview
A capped-supply ERC20 token with a faucet-style claim function. Any user can claim a fixed amount every 24 hours, while the owner can mint additional tokens as long as the total supply never exceeds `MAX_SUPPLY`.

## Goals
- Standard ERC20 behavior (balances, transfers, approvals, allowances).
- `requestToken()` faucet for anyone, rate-limited to once per 24 hours per address.
- `mint()` owner-only, never exceeding `MAX_SUPPLY`.
- Thorough tests for faucet and mint edge cases.
- Straightforward deployment and verification flow.

## On-Chain Components

### Contract: `FaucetToken`
**Location:** `contracts/FaucetToken.sol`

**Core Constants**
- `MAX_SUPPLY = 10,000,000 * 10^18`
- `FAUCET_AMOUNT = 1,000 * 10^18`
- `FAUCET_COOLDOWN = 1 days`

**State**
- `owner`: contract owner for admin-only minting
- `totalSupply`: current total minted tokens
- `balances`: token balances per address
- `allowances`: ERC20 allowances
- `lastClaim`: timestamp of last faucet claim per address

**Public Interface**
- `requestToken()`
  - Mints `FAUCET_AMOUNT` to caller if cooldown passed.
  - Updates `lastClaim` for caller.
  - Reverts if cooldown not met or `MAX_SUPPLY` would be exceeded.
- `mint(address to, uint256 amount)`
  - Only owner can call.
  - Mints up to `MAX_SUPPLY`.
  - Reverts if `to` is zero or cap would be exceeded.
- Standard ERC20 functions
  - `transfer`, `approve`, `transferFrom`, `balanceOf`, `allowance`, `totalSupply`

**Events**
- `Transfer` (ERC20)
- `Approval` (ERC20)

## Test Architecture

### Test Suite: `FaucetToken.ts`
**Location:** `test/FaucetToken.ts`

Coverage highlights:
- Correct initialization (name, symbol, owner, zero supply).
- Faucet claim success and cooldown enforcement.
- Owner-only minting, including cap enforcement.
- Faucet behavior at supply boundary (revert when maxed).

## Deployment Architecture

### Script: `deploy-faucet-token.ts`
**Location:** `scripts/deploy-faucet-token.ts`

Deploys the contract with constructor args:
- `TOKEN_NAME` (env var, default: `FaucetToken`)
- `TOKEN_SYMBOL` (env var, default: `FTK`)

## Verification Architecture

- Uses Hardhat verify plugin.
- Requires `ETHERSCAN_API_KEY`.

Example command:
```
npx hardhat verify --network sepolia <DEPLOYED_ADDRESS> "FaucetToken" "FTK"
```

## Environment & Config

Required env vars for Sepolia:
- `SEPOLIA_RPC_URL`
- `SEPOLIA_PRIVATE_KEY`

For verification:
- `ETHERSCAN_API_KEY`

## Assumptions
- Faucet amount and cooldown are fixed constants (can be changed in code).
- Owner is the deployer.
- The token uses 18 decimals.

## Future Extensions (Optional)
- Make faucet amount configurable by owner.
- Add `pause()` and `unpause()` to disable faucet temporarily.
- Add `Ownable`-style ownership transfer.
- Add `permit()` (EIP-2612) for gasless approvals.
