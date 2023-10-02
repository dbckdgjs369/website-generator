import { useRoutes } from "react-router-dom";

import MainPage from "./pages/Mainpage/MainPage";

const PATHS = {
  main: "/main",
};

export default function Router() {
  return useRoutes([
    {
      path: PATHS.main,
      element: <MainPage />,
    },
  ]);
}
