import socketService from "@app/socket/Socket";
import { useEffect, useState } from "react";

export default function useSocketConnect(): { isLoading: boolean } {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const interval = setInterval(() => {
      onHandleLoading();
    }, 2000);
    return () => clearInterval(interval);
  }, [])

  const onHandleLoading = () => {
    const status: boolean = socketService.status();

    if (status) {
      console.log('Connected to the server');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    return;
  }

  return { isLoading }

}
