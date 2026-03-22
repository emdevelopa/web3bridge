import { useEffect, useState } from "react";
import { useReadFaucet } from "./specific/useRead";
import { useAppKitAccount } from "@reown/appkit/react";

export const useBalance = () => {
  const { getTokenBalance } = useReadFaucet();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const { address } = useAppKitAccount();

  const refreshBalance = async () => {
    if (!address) {
      setTokenBalance(0);
      return;
    }

    try {
      const bal = await getTokenBalance(address);
      console.log("tokenn balance", bal);
      setTokenBalance(bal);
    } catch (error) {
      console.error("Failed to load token balance", error);
      setTokenBalance(0);
    }
  };

  useEffect(() => {
    refreshBalance();

    // Poll every 15 seconds
    const interval = setInterval(refreshBalance, 15000);
    return () => clearInterval(interval);
  }, [address]);

  return { tokenBalance, refreshBalance };
};
