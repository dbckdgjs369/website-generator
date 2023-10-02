import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom"; //🤔

import "./index.css";
import Router from "./Router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider
      router={createBrowserRouter([
        {
          id: "MainRouter",
          path: "*",
          element: <Router />,
        },
      ])}
    />
  </React.StrictMode>
);
