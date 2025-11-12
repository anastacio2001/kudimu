
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/responsive.css";
import "./utils/pwa";

createRoot(document.getElementById("root")!).render(<App />);  