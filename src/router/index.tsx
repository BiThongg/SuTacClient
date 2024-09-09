import { useRoutes } from "react-router-dom";
import Home from "@pages/Home";
import Game from "@pages/Game";
import ErrorPage from "@pages/Error";
import Room from "@pages/Room";

const router = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/game",
      element: <Game />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/error",
      element: <ErrorPage />,
      
    },
    {
      path: "/room",
      element: <Room />,
    }
  ]);
  return routes;
};

export default router;
