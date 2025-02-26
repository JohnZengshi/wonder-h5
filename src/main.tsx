import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import flexible from "./script/flexible.ts";

flexible(window, document);
createRoot(document.getElementById("root")!).render(<App />);
