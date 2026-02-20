import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const rootEnvDir = path.resolve(__dirname, "..");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootEnvDir, "VITE_");
  const apiUrl = env.VITE_API_URL || "http://127.0.0.1:5000";

  return {
    plugins: [react()],
    envDir: rootEnvDir,
    server: {
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
