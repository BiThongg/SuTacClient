import { useRoutes } from "react-router-dom";
import Home from "@pages/Home";
import Game from "@pages/Game";
import ErrorPage from "@pages/Error";
import Room from "@pages/Room";
import Auth from "@pages/Auth";

const router = () => {
  const routes = useRoutes([
    {
      path: "/auth",
      element: <Auth />,
      errorElement: <ErrorPage />,
    },
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
    },
  ]);
  return routes;
};

export default router;
