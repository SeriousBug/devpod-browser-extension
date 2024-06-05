import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import path from "path";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@pages": path.resolve(__dirname, "src", "pages"),
      "@lib": path.resolve(__dirname, "src", "lib"),
      "@src": path.resolve(__dirname, "src"),
      "@public": path.resolve(__dirname, "public"),
    },
  },
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
      disableAutoLaunch: false,
    }),
  ],
});
