import { useMemo } from "react";
import { Contract } from "ethers";
import { getAddress } from "ethers";
import { FAUCET_ABI } from "../ABI/faucet";
import useRunners from "./useRunner";
// import useRunners from "./useRunner";

export const useFaucetContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();

  return useMemo(() => {
    if (withSigner) {
      if (!signer) return null;
      return new Contract(
        getAddress(import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS),
        FAUCET_ABI,
        signer,
      );
    }

    //if withSigner is False
    return new Contract(
      getAddress(import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS),
      FAUCET_ABI,
      readOnlyProvider,
    );
  }, [readOnlyProvider, signer, withSigner]);
};
