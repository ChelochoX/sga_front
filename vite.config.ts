import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    host: "0.0.0.0", // Permite conexiones externas
    port: 5173, // El puerto que usas
  },
});
