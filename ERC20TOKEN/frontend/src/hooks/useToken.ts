import { useEffect, useState } from "react";
import { useReadFaucet } from "./specific/useRead";

export const useToken = () => {
  const [totalSupply, setTotalSupply] = useState();
  const [maxSupply, setMaxSupply] = useState();
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [tokenOwner, setTokenOwner] = useState("");
  // const [allowance] = useState(0);
  const {
    getTokenSymbol,
    getTokenName,
    getMaxSupply,
    getTotalSupply,
    getOwner,
  } = useReadFaucet();

  const refreshTotalSupply = async () => {
    try {
      const TotalSupply = await getTotalSupply();
      setTotalSupply(TotalSupply);
    } catch (error) {
      console.error("Failed to refresh total supply", error);
    }
  };

  useEffect(() => {
    const getSymbol = async () => {
      const symbol = await getTokenSymbol();
      setSymbol(symbol);
    };

    const getName = async () => {
      const name = await getTokenName();
      setName(name);
    };

    const getMaximuTokenSupply = async () => {
      const maxTokenSupply = await getMaxSupply();
      setMaxSupply(maxTokenSupply);
    };

    const getTotalTokenSupply = async () => {
      const TotalSupply = await getTotalSupply();
      setTotalSupply(TotalSupply);
    };

    const getTokenOwner = async () => {
      const owner = await getOwner();
      setTokenOwner(owner);
    };

    getTokenOwner();
    getTotalTokenSupply();
    getMaximuTokenSupply();
    getName();
    getSymbol();

    // Poll total supply every 15 seconds to reflect network changes
    const interval = setInterval(getTotalTokenSupply, 15000);
    return () => clearInterval(interval);
  }, []);

  return {
    totalSupply,
    maxSupply,
    symbol,
    name,
    tokenOwner,
    refreshTotalSupply,
  };
};
