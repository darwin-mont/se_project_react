import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App/App";
import { BrowserRouter } from "react-router-dom";

// Compute a sensible basename so the router works both locally and when
// deployed under a subpath (e.g. GitHub Pages /se_project_react/).
const detectedBase = import.meta.env.BASE_URL || "/";
const autoBase =
  detectedBase && detectedBase !== "/"
    ? detectedBase
    : window.location.pathname.startsWith("/se_project_react")
    ? "/se_project_react"
    : "/";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={autoBase}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
