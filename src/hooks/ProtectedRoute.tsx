import socketService from "@app/socket/Socket";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: any }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    socketService.connect();
    if (!window.localStorage.getItem("user")) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [window.localStorage.getItem("user")]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
