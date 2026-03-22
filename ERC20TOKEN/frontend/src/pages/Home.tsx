import { MintForm } from "../components/Admin/MintForm";
import { TransferForm } from "../components/Transfer/TransferForm";
import { ReadCards } from "../components/Read/ReadCards";
import { FaucetCard } from "../components/Faucet/FaucetCard";
import { Button } from "../components/ui/Button";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export const Home = () => {
  const { open } = useAppKit();
  const { address } = useAppKitAccount();


  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        {/* Header Section */}
<button onClick={openInMetaMask}>
  Open in MetaMask
</button>
        <header className="w-full flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            Next-Gen Token Faucet
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Pluto Token Dashboard
          </h1>
          <p className="max-w-2xl text-slate-400 text-lg">
            A premium, high-performance dashboard for claiming, minting, and transferring Pluto (PLT) tokens on the Lisk Sepolia network.
          </p>
          
          <div className="mt-4">
            <Button 
              onClick={() => open()} 
              variant={!address ? "primary" : "outline"}
              className="min-w-[240px] group"
            >
              {!address ? (
                "Connect Wallet"
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-blue-400 font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <span className="text-slate-500 group-hover:text-red-400 transition-colors border-l border-slate-700 pl-2 ml-1">
                    Disconnect
                  </span>
                </span>
              )}
            </Button>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          <FaucetCard />
          <TransferForm />
          <MintForm />
        </main>

        {/* Stats Section */}
        <section className="w-full border-t border-slate-800 pt-12">
           <ReadCards />
        </section>

        {/* Footer */}
        <footer className="w-full text-center text-slate-500 text-sm pb-8">
          &copy; {new Date().getFullYear()} Pluto Finance. Built with Hardhat 3 and React 19.
        </footer>
      </div>
    </div>
  );
};
