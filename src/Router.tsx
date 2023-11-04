import { useNavigate, useRoutes } from "react-router-dom";

import MainPage from "./pages/Mainpage/MainPage";
import Layout from "./layout/Layout";
import { useEffect } from "react";
import MainPage2 from "./pages/Mainpage/MainPage2";

const PATHS = {
  main: "/main",
};

const withLayout = (element: React.ReactNode) => <Layout>{element}</Layout>;

export default function Router() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("main", { replace: true });
  }, []);
  return useRoutes([
    {
      path: PATHS.main,
      element: withLayout(<MainPage2 />),
    },
  ]);
}
