import { useNavigate, useRoutes } from "react-router-dom";

import Layout from "./layout/Layout";
import { useEffect } from "react";
import EditorPage from "./pages/Mainpage/EditorPage";

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
      element: withLayout(<EditorPage />),
    },
  ]);
}
