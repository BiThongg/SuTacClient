import socketService from "@app/socket/Socket";
import { useEffect, useState } from "react";

export default function useSocketConnect(): { isLoading: boolean } {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      onHandleLoading();
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const onHandleLoading = () => {
    console.log("onHandleLoading");
    const status: boolean = socketService.status();

    if (status) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    return;
  };

  return { isLoading };
}
