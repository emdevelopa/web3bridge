// import { useAppKitAccount } from "@reown/appkit/vue";
import { useAppKitAccount } from "@reown/appkit/react";
import { useFaucetContract } from "../useContract";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { ErrorDecoder } from "ethers-decode-error";
import { FAUCET_ABI } from "../../ABI/faucet";
import { Interface } from "ethers";
import type { BigNumberish } from "ethers";
import { getAddress } from "ethers";

const faucetInterface = new Interface(FAUCET_ABI);

const errorDecoder = ErrorDecoder.create([faucetInterface as any]);

export const useWriteFaucet = () => {
  const faucetContract = useFaucetContract(true);
  const { address } = useAppKitAccount();

  // Get Contract Symbol
  const getRequestToken = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!address) {
      toast.error("Wallet Not Connected");
      return { success: false, error: "Wallet Not Connected" };
    }
    if (!faucetContract) {
      toast.error("Contract not Found");
      return { success: false, error: "Contract not Found" };
    }
    try {
      const requestToken = await faucetContract.requestToken();
      await requestToken.wait();
      return { success: true };
    } catch (error) {
      const decodedError = await errorDecoder.decode(error);
      console.log(decodedError.reason);
      return {
        success: false,
        error: decodedError.reason || "Unknown error",
      };
    }
  }, [faucetContract, address]);

  const getMint = useCallback(
    async (
      _address: string,
      amount: BigNumberish,
    ): Promise<{
      success: boolean;
      error?: string;
    }> => {
      if (!address) {
        toast.error("Wallet Not Connected");
        return { success: false, error: "Wallet Not Connected" };
      }
      if (!faucetContract) {
        toast.error("Contract not Found");
        return { success: false, error: "Contract not Found" };
      }
      try {
        // Validate and normalize the recipient address
        let normalizedAddress: string;
        try {
          normalizedAddress = getAddress(_address);
        } catch (error) {
          return {
            success: false,
            error: "Invalid recipient address format",
          };
        }

        const mint = await faucetContract.mint(normalizedAddress, amount);
        await mint.wait();
        return { success: true };
      } catch (error) {
        const decodedError = await errorDecoder.decode(error);
        console.log(decodedError.reason);
        return {
          success: false,
          error: decodedError.reason || "Unknown error",
        };
      }
    },
    [faucetContract, address],
  );

  const getTransfer = useCallback(
    async (
      to: string,
      amount: BigNumberish,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!address) {
        toast.error("Wallet Not Connected");
        return { success: false, error: "Wallet Not Connected" };
      }
      if (!faucetContract) {
        toast.error("Contract not Found");
        return { success: false, error: "Contract not Found" };
      }

      try {
        const tranferTx = await faucetContract.transfer(to, amount);
        const receipt = await tranferTx.wait();

        return { success: receipt.status === 1 };
      } catch (error) {
        const decodedError = await errorDecoder.decode(error);
        console.log(decodedError.reason);

        // toast.error(decodedError.reason)
        return {
          success: false,
          error: decodedError.reason || "Unknown error",
        };
      } finally {
      }
    },
    [faucetContract, address],
  );

  return {
    getRequestToken,
    getMint,
    getTransfer,
  };
};
