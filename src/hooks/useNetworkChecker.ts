import { useEffect, useState } from "react";

export const useNetworkStatus = () => {
  const [isOnline, setOnline] = useState<boolean | "broken">(true);

  const updateNetworkStatus = () => {
    setOnline(
      typeof navigator.onLine === "boolean" ? navigator.onLine : "broken",
    );
  };

  useEffect(() => {
    window.addEventListener("load", updateNetworkStatus);
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("load", updateNetworkStatus);
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  if (isOnline === "broken") {
    console.error("online indicator is down");
  }

  return { isOnline };
};
