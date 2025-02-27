import "./index.css";
import "@/assets/font/index.css";
import flexible from "./script/flexible.ts";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
flexible(window, document);

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
