// import { useAppKitAccount } from "@reown/appkit/vue";
import { useFaucetContract } from "../useContract";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

export const useReadFaucet = () => {
  const faucetContract = useFaucetContract();

  const [isGettingSymbol, setIsGettingSymbol] = useState(false);

  // Get Contract Symbol
  const getTokenSymbol = useCallback(async () => {
    if (!faucetContract) {
      toast.error("Contract not Found");
      return null;
    }
    try {
      //   setIsGettingSymbol(true);
      const symbol = await faucetContract.Symbol();
      return symbol;
    } catch (error) {
    } finally {
      //   setIsGettingSymbol(false);
    }
  }, [faucetContract]);

  const getTokenName = useCallback(async () => {
    if (!faucetContract) {
      toast.error("Contract not Found");
      return null;
    }
    try {
      // setIsGettingSymbol(true);
      const name = await faucetContract.TokenName();
      return name;
    } catch (error) {
    } finally {
      // setIsGettingSymbol(false);
    }
  }, [faucetContract]);

  const getMaxSupply = useCallback(async () => {
    if (!faucetContract) {
      toast.error("Contract not Found");
      return null;
    }
    try {
      // setIsGettingSymbol(true);
      const max_supply = await faucetContract.MAX_SUPPLY();
      return max_supply;
    } catch (error) {
    } finally {
      // setIsGettingSymbol(false);
    }
  }, [faucetContract]);

  const getTotalSupply = useCallback(async () => {
    if (!faucetContract) {
      toast.error("Contract not Found");
      return null;
    }
    try {
      // setIsGettingSymbol(true);
      const total_supply = await faucetContract.TotalSupply();
      return total_supply;
    } catch (error) {
    } finally {
      // setIsGettingSymbol(false);
    }
  }, [faucetContract]);

  const getOwner = useCallback(async () => {
    if (!faucetContract) {
      toast.error("Contract not Found");
      return null;
    }
    try {
      // setIsGettingSymbol(true);
      const owner = await faucetContract.owner();
      return owner;
    } catch (error) {
    } finally {
      // setIsGettingSymbol(false);
    }
  }, [faucetContract]);

  const getTokenBalance = useCallback(
    async (_address: string) => {
      // if (!address) {
      //   toast.error("Wallet Not Connected");
      //   return null;
      // }

      if (!faucetContract) {
        toast.error("Contract not Found");
        return null;
      }

      console.log("connected", _address);

      try {
        // setIsGettingSymbol(true);
        const balance = await faucetContract.balanceOf(_address);
        return balance;
      } catch (error) {
      } finally {
        // setIsGettingSymbol(false);
      }
    },
    [faucetContract],
  );

  const getLastClaim = useCallback(
    async (_address: string) => {
      if (!_address) {
        // toast.error("Wallet not Connected");
        return null;
      }
      if (!faucetContract) {
        // toast.error("Contract not Found");
        return null;
      }

      try {
        // setIsGettingSymbol(true);
        const time = await faucetContract.lastRequestTime(_address);
        return time;
      } catch (error) {
        console.error("Error fetching last claim time:", error);
        return null;
      }
    },
    [faucetContract],
  );

  return {
    getTokenSymbol,
    getTokenName,
    getMaxSupply,
    getTotalSupply,
    getOwner,
    getTokenBalance,
    getLastClaim,
  };
};
