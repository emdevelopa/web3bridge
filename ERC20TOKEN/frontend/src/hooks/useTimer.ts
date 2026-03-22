import { useEffect, useState } from "react";

export const useTimer = (lastClaim: number | null) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastClaim) return;
      const diff = 24 * 60 * 60 * 1000 - (Date.now() - lastClaim);
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastClaim]);

  return timeLeft;
};
