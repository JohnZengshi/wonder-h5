import "./index.css";
import "@/assets/font/index.css";
import flexible from "./script/flexible.ts";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import VConsole from "vconsole";

console.log("import.meta.env", import.meta.env);
new VConsole();
flexible(window, document);
// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
