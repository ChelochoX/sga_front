// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      // Redirige automáticamente cualquier petición que empiece con /api
      "/api": {
        target: "https://localhost:7200", // 🔥 Backend en desarrollo
        changeOrigin: true,
        secure: false, // 🔐 Ignora problemas de certificado
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Ajusta la ruta
      },
    },
  },
});
