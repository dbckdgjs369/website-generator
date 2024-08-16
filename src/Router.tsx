import { useNavigate, useRoutes } from "react-router-dom";

import Layout from "./layout/Layout";
import EditorPage from "./pages/Mainpage/EditorPage";
import TestPage from "./pages/Mainpage/TestPage";
import ComponentPage from "./pages/ComponentPage/ComponentPage";
import { useEffect } from "react";

const PATHS = {
  main: "/main",
  test: "/test",
  component: "/component",
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
    {
      path: PATHS.test,
      element: withLayout(<TestPage />),
    },
    {
      path: PATHS.component,
      element: withLayout(<ComponentPage />),
    },
  ]);
}
