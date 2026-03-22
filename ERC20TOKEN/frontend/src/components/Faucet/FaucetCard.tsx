import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useFaucet } from "../../hooks/useFaucet";
import { useToken } from "../../hooks/useToken";
import { useBalance } from "../../hooks/useBalance";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

export const FaucetCard = () => {
  const { lastClaim, requestToken } = useFaucet();
  const { tokenBalance } = useBalance();
  const { symbol } = useToken();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const timeSinceLastClaim = lastClaim ? currentTime - lastClaim * 1000 : 0;
  const timeLeft = lastClaim ? Math.max(0, COOLDOWN_MS - timeSinceLastClaim) : 0;

  const formatTimeLeft = (ms: number) => {
    if (ms <= 0) return "";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Faucet</h2>
        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
          Daily Claim
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-sm">Your Balance</p>
        <p className="text-2xl font-bold text-white tracking-tight">
          {ethers.formatEther(tokenBalance ?? 0)} <span className="text-slate-500 text-lg font-medium">{symbol}</span>
        </p>
      </div>

      <div className={`p-4 rounded-xl border transition-all duration-300 ${
        timeLeft > 0 
          ? "bg-slate-900/50 border-slate-800" 
          : "bg-green-500/5 border-green-500/20"
      }`}>
        <p className="text-sm font-medium">
          {timeLeft > 0 ? (
            <span className="text-slate-400">Next claim in: <span className="text-blue-400 font-mono">{formatTimeLeft(timeLeft)}</span></span>
          ) : (
            <span className="text-green-400 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Ready to claim!
            </span>
          )}
        </p>
      </div>

      <Button 
        onClick={requestToken} 
        disabled={timeLeft > 0}
        variant={timeLeft > 0 ? "secondary" : "primary"}
        className="w-full"
      >
        {timeLeft > 0 ? "On Cooldown" : "Request 2 PLT"}
      </Button>
    </Card>
  );
};
