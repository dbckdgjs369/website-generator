import { useRoutes } from "react-router-dom";

import MainPage from "./pages/Mainpage/MainPage";
import Layout from "./layout/Layout";

const PATHS = {
  main: "/main",
};

const withLayout = (element: React.ReactNode) => <Layout>{element}</Layout>;

export default function Router() {
  return useRoutes([
    {
      path: PATHS.main,
      element: withLayout(<MainPage />),
    },
  ]);
}
