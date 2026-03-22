export const FAUCET_ABI = [
  // ── Errors ──────────────────────────────────────────────────────

  "error INSUFFICIENT_BALANCE()",
  "error MAX_SUPPLY_EXCEEDED()",
  "error NOT_ALLOWED()",
  "error NOT_OWNER()",
  "error WAIT_FOR_24_HOURS()",

  // ── Events ──────────────────────────────────────────────────────

  // Emitted when an allowance is set via approve()
  "event Approval(address indexed owner, address indexed spender, uint256 value)",

  // Emitted on every token transfer
  "event Transfer(address indexed from, address indexed to, uint256 value)",

  // ── Read Functions ──────────────────────────────────────────────

  // Maximum token supply allowed
  "function MAX_SUPPLY() view returns (uint256)",

  // Token symbol (e.g. "TKN")
  "function Symbol() view returns (string)",

  // Full token name
  "function TokenName() view returns (string)",

  // Current total supply minted so far
  "function TotalSupply() view returns (uint256)",

  // Token decimal precision
  "function decimals() view returns (uint256)",

  // Amount of tokens distributed per faucet request
  "function faucetAmount() view returns (uint256)",

  // Token balance of a given address
  "function balanceOf(address) view returns (uint256)",

  // Timestamp of the last faucet request for a given address
  "function lastRequestTime(address) view returns (uint256)",

  // Contract owner address
  "function owner() view returns (address)",

  // ── Write Functions ─────────────────────────────────────────────

  // Approves a spender to use up to _amount tokens on your behalf
  "function approve(address spender, uint256 _amount) returns (bool)",

  // Mints new tokens to a given address (owner only)
  "function mint(address to, uint256 amount)",

  // Claims faucet tokens — can only be called once every 24 hours
  "function requestToken()",

  // Transfers tokens from caller to _to
  "function transfer(address _to, uint256 _amount) returns (bool)",

  // Transfers tokens on behalf of _from (requires prior approval)
  "function transferFrom(address _from, address _to, uint256 _amount) returns (bool)",
] as const;
