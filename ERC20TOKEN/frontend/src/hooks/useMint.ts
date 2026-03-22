import { toast } from "react-toastify";
import { useWriteFaucet } from "./specific/useWrite";
import { ethers } from "ethers";
import { useToken } from "./useToken";
import { useBalance } from "./useBalance";

export const useMint = () => {
  const { getMint } = useWriteFaucet();
  const { refreshTotalSupply } = useToken();
  const { refreshBalance } = useBalance();

  const mint = async (address: string, amount: number) => {
    // alert(`Mint ${amount} tokens to ${address}`);
    const toastId = toast.loading("Minting...");
    try {
      // Convert amount to wei (1 token = 10^18 wei)
      const amountInWei = ethers.parseEther(amount.toString());

      const result = await getMint(address, amountInWei);
      if (!result.success) {
        toast.update(toastId, {
          render: `Mint Failed: ${result.error}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: "Minting Successful",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        // Refresh total supply and balance after successful mint
        await refreshTotalSupply();
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
  return { mint };
};
