import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import path from "path";
import zipPack from "vite-plugin-zip-pack";

const pkg = readJsonFile("package.json");

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: process.env.NODE_ENV === "production" ? "esbuild" : false,
  },
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
    process.env.PREVIEW !== "true" &&
      webExtension({
        manifest: generateManifest,
        disableAutoLaunch: false,
        browser: process.env.BROWSER,
      }),
    process.env.NODE_ENV === "production" &&
      zipPack({
        outDir: ".",
        outFileName: `devpod-ext-${process.env.BROWSER}-${pkg.version}.zip`,
      }),
  ],
  define: {
    APP_VERSION: JSON.stringify(pkg.version),
    PREVIEW: JSON.stringify(process.env.PREVIEW === "true"),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    BROWSER: JSON.stringify(process.env.BROWSER ?? "chrome"),
  },
});
