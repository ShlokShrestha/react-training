import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Dashboard from "./Dashboard";
import Demo from "./Demo";
import ImageEditor from "./ImageEditor";
import ImageCropper from "./Cropper";
import TestCropper from "./TestCropper";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <RouterProvider router={router} />, */}
    {/* <ImageEditor/> */}
    {/* <ImageCropper /> */}
    <TestCropper />
  </StrictMode>
);
