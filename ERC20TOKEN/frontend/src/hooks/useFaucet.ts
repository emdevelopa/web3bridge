import { useEffect, useState } from "react";
import { useWriteFaucet } from "./specific/useWrite";
import { useReadFaucet } from "./specific/useRead";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { useToken } from "./useToken";
import { useBalance } from "./useBalance";

export const useFaucet = () => {
  const { getRequestToken } = useWriteFaucet();
  const { getLastClaim } = useReadFaucet();
  const { address } = useAppKitAccount();
  const { refreshTotalSupply } = useToken();
  const { refreshBalance } = useBalance();

  // const { tokenBalance } = useBalance();
  const [lastClaim, setLastClaim] = useState<number | null>(null);

  const requestToken = async () => {
    // if (!address) {
    //   //  setTokenBalance(0);
    //   return;
    // }
    // if (lastClaim && now - lastClaim < 24 * 60 * 60 * 1000) {
    //   throw new Error("WAIT_FOR_24_HOURS");
    // }
    const toastId = toast.loading("Requesting...");

    const { success, error } = await getRequestToken();
    // const lastTimeClaim = await getLastClaim(address);
    console.log(success, error);

    if (!success) {
      toast.update(toastId, {
        render: `Error: ${error}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render: "Request Successful",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      // Refresh total supply and balance after successful request
      await refreshTotalSupply();
      await refreshBalance();
    }

    // console.log("time claimed", lastTimeClaim);

    // console.log("the tokenn",requestToken);

    // setBalance((prev) => prev + FAUCET_AMOUNT);
    // setLastClaim(now);
  };

  useEffect(() => {
    const fetchLastClaim = async () => {
      if (!address) {
        setLastClaim(null);
        return;
      }

      try {
        const lastTimeClaim = await getLastClaim(address);
        console.log("time claimed", lastTimeClaim);

        if (lastTimeClaim) {
          setLastClaim(Number(lastTimeClaim));
        }
      } catch (error) {
        console.log("Error fetching last claim", error);
      }
      // if (lastClaim && now - lastClaim < 24 * 60 * 60 * 1000) {
      //   throw new Error("WAIT_FOR_24_HOURS");
      // }
    };

    fetchLastClaim();
  }, [address, getLastClaim]);

  return { lastClaim, requestToken };
};
