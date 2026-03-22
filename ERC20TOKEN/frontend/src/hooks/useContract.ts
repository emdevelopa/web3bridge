import { useMemo } from "react";
import { Contract } from "ethers";
import { getAddress } from "ethers";
import { FAUCET_ABI } from "../ABI/faucet";
import useRunners from "./useRunner";

export const useFaucetContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();
  const contractAddress = import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS;

  return useMemo(() => {
    if (!contractAddress) {
      console.warn("VITE_FAUCET_CONTRACT_ADDRESS is not defined");
      return null;
    }

    if (withSigner) {
      if (!signer) return null;
      return new Contract(
        getAddress(contractAddress),
        FAUCET_ABI,
        signer,
      );
    }

    //if withSigner is False
    return new Contract(
      getAddress(contractAddress),
      FAUCET_ABI,
      readOnlyProvider,
    );
  }, [readOnlyProvider, signer, withSigner, contractAddress]);
};
