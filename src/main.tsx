import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom"; //🤔

import "./index.css";
import Router from "./Router";
import { GlobalEventEmitterProvider } from "./GlobalEventEmitterContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GlobalEventEmitterProvider>
    <RouterProvider
      router={createBrowserRouter([
        {
          id: "MainRouter",
          path: "*",
          element: <Router />,
        },
      ])}
    />
  </GlobalEventEmitterProvider>
);
