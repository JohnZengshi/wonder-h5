import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/upload/www",
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
  ],
  css: {},
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // 允许局域网访问
    port: 7777,
  },
  define: {
    // 兼容旧式 process 写法
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    // 注入其他必要变量
    global: {},
  },
});
