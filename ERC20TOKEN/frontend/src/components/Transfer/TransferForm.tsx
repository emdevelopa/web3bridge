import { useState } from "react";
import { useTransfer } from "../../hooks/useTransfer";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";

export const TransferForm = () => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const { transfer } = useTransfer();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !amount) return;
    await transfer(to, Number(amount));
    setTo("");
    setAmount("");
  };

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Transfer</h2>
        <span className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
          Peer-to-Peer
        </span>
      </div>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 px-1">Recipient Address</label>
          <Input
            placeholder="0x..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
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
          variant="primary" 
          className="w-full mt-2"
          disabled={!to || !amount}
        >
          Send Tokens
        </Button>
      </form>
    </Card>
  );
};
