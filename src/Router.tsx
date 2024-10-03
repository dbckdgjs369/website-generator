import { useNavigate, useRoutes } from "react-router-dom";

import Layout from "./layout/Layout";
import EditorPage from "./pages/Mainpage/EditorPage";
import BlogMainPage from "./pages/Mainpage/BlogMainPage";
import ComponentPage from "./pages/ComponentPage/ComponentPage";
import ResultPage from "./pages/ResultPage/ResultPage";
import DNDPage from "./pages/DNDPage/DNDPage";
import LayoutWithComponent from "./layout/LayoutWithComponent";
import { useEffect } from "react";

const PATHS = {
  main: "/main",
  blog: "/blog",
  component: "/component/*",
  dnd: "/dnd",
  result: "",
};

const withToolBarLayout = (element: React.ReactNode) => (
  <Layout>{element}</Layout>
);

const withToolBarLayout2 = (element: React.ReactNode) => (
  <LayoutWithComponent>{element}</LayoutWithComponent>
);

export default function Router() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(PATHS.blog);
  }, []);

  return useRoutes([
    {
      path: PATHS.result,
      element: <ResultPage />,
    },
    {
      path: PATHS.main,
      element: withToolBarLayout(<EditorPage />),
    },
    {
      path: PATHS.blog,
      element: withToolBarLayout2(<BlogMainPage />),
    },
    {
      path: PATHS.component,
      element: withToolBarLayout(<ComponentPage />),
    },
    {
      path: PATHS.dnd,
      element: <DNDPage />,
    },
  ]);
}
