import { useToken } from "../../hooks/useToken";
import { ethers } from "ethers";

export const ReadCards = () => {
  const { totalSupply, maxSupply, symbol, name, tokenOwner } = useToken();

  const stats = [
    { label: "Token Name", value: name, sub: symbol },
    { label: "Token Symbol", value: symbol, sub: "Ticker" },
    { label: "Total Supply", value: `${ethers.formatEther(totalSupply ?? 0)}`, sub: symbol },
    { label: "Max Supply", value: `${ethers.formatEther(maxSupply ?? 0)}`, sub: symbol },
    { label: "Contract Owner", value: `${tokenOwner.slice(0, 10)}...${tokenOwner.slice(-8)}`, sub: "Admin" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card p-5 rounded-2xl flex flex-col gap-1 border-t border-slate-700/50">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-white tracking-tight truncate w-full" title={stat.value}>
              {stat.value}
            </p>
            <span className="text-blue-500/80 text-xs font-medium">{stat.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
