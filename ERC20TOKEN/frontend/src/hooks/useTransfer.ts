import { useWriteFaucet } from "./specific/useWrite";
import { toast } from "react-toastify";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";
import { useBalance } from "./useBalance";

export const useTransfer = () => {
  const { getTransfer } = useWriteFaucet();
  const { address } = useAppKitAccount();
  const { refreshBalance } = useBalance();

  const transfer = async (to: string, amount: number) => {
    if (!address) {
      toast.error("Wallet Not Connected");
      return;
    }

    const toastId = toast.loading("Transferring...");

    try {
      // Convert amount to wei (1 token = 10^18 wei)
      const amountInWei = ethers.parseEther(amount.toString());

      const result = await getTransfer(to, amountInWei);

      if (!result.success) {
        toast.update(toastId, {
          render: `Transfer Failed: ${result.error}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: "Transfer Successful",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        // Refresh balance after successful transfer
        await refreshBalance();
      }
    } catch (error) {
      toast.update(toastId, {
        render: `Invalid amount: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  return { transfer };
};
