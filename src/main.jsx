import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App/App";
import { BrowserRouter } from "react-router-dom";

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
  </StrictMode>,
);
