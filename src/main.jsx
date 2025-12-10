import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Dashboard from "./Dashboard";
import Demo from "./Demo";
import ImageEditor from "./ImageEditor";

const router = createBrowserRouter([
  {
    path: "*",
    element: <div>No page found</div>,
  },
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/demo",
    element: <Demo />,
  },
  {
    path: "/demo/:id",
    element: <div>Recipes ID here</div>,
  },
  {
    path: "/product",
    element: <div>Hello from product page</div>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <RouterProvider router={router} />, */}
    <ImageEditor />
  </StrictMode>
);
