import { useState } from "react";
import { useMint } from "../../hooks/useMint";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";

export const MintForm = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const { mint } = useMint();

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !amount) return;
    await mint(address, Number(amount));
    setAddress("");
    setAmount("");
  };

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Admin Mint</h2>
        <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 text-xs font-medium border border-amber-500/20">
          Owner Only
        </span>
      </div>

      <form onSubmit={handleMint} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 px-1">Recipient Address</label>
          <Input
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 px-1">Amount (PLT)</label>
          <Input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button 
          type="submit" 
          variant="secondary" 
          className="w-full mt-2"
          disabled={!address || !amount}
        >
          Mint Tokens
        </Button>
      </form>
    </Card>
  );
};
