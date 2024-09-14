import { useRoutes } from "react-router-dom";

import Layout from "./layout/Layout";
import EditorPage from "./pages/Mainpage/EditorPage";
import TestPage from "./pages/Mainpage/TestPage";
import ComponentPage from "./pages/ComponentPage/ComponentPage";
import ResultPage from "./pages/ResultPage/ResultPage";
import DNDPage from "./pages/DNDPage/DNDPage";

const PATHS = {
  main: "/main",
  test: "/test",
  component: "/component/*",
  dnd: "/dnd",
  result: "",
};

const withLayout = (element: React.ReactNode) => <Layout>{element}</Layout>;

export default function Router() {
  return useRoutes([
    {
      path: PATHS.result,
      element: <ResultPage />,
    },
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
    {
      path: PATHS.dnd,
      element: <DNDPage />,
    },
  ]);
}
