// import ReactDOM from "react-dom/client";

// import { createBrowserRouter, RouterProvider } from "react-router-dom"; //🤔

// import "./index.css";
// import Router from "./Router";
// import { GlobalEventEmitterProvider } from "./provider/GlobalEventProvider/GlobalEventEmitterContext";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <GlobalEventEmitterProvider>
//     <RouterProvider
//       router={createBrowserRouter([
//         {
//           id: "MainRouter",
//           path: "*",
//           element: <Router />,
//         },
//       ])}
//     />
//   </GlobalEventEmitterProvider>
// );

import { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GlobalEventEmitterProvider } from "./provider/GlobalEventProvider/GlobalEventEmitterContext";

const LazyRouter = lazy(() => import("./Router")); // Router를 lazy로 import
const router = createBrowserRouter([
  {
    id: "MainRouter",
    path: "*",
    element: <LazyRouter />, // lazy로 로드된 Router 사용
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GlobalEventEmitterProvider>
    <Suspense fallback={<div>Loading...</div>}>
      {/* Suspense로 감싸서 로딩 상태를 처리 */}
      <RouterProvider router={router} />
    </Suspense>
  </GlobalEventEmitterProvider>
);
