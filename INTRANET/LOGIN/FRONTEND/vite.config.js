import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "./package.json";
import { VitePWA } from "vite-plugin-pwa";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "VITE_");

  const isProd = mode === "production";
  const BUILD_DATE = new Date().toISOString();

  if (!env.VITE_API_URL && mode === "development") {
    throw new Error("❌ VITE_API_URL no está definido en .env");
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        base: "/intranet/",
        registerType: "autoUpdate",
        injectRegister: "auto",
        includeAssets: ["icons/*.png"],
        devOptions: {
          enabled: false
        },
        manifest: {
          name: "Delfin Group Chile Intranet",
          short_name: "Delfin Intranet",
          description: "Intranet corporativa de Delfin Group Chile",
          start_url: "/intranet/",
          scope: "/intranet/",
          display: "standalone",
          orientation: "portrait",
          background_color: "#0F172A",
          theme_color: "#0F172A",
          icons: [
            {
              src: "/intranet/icons/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "/intranet/icons/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "/intranet/icons/apple-touch-icon.png",
              sizes: "180x180",
              type: "image/png"
            }
          ]
        },
        workbox: {
          navigateFallback: "/intranet/index.html",
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "document",
              handler: "NetworkFirst"
            },
            {
              urlPattern: ({ request }) => request.destination === "script" || request.destination === "style",
              handler: "StaleWhileRevalidate"
            },
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                }
              }
            }
          ]
        }
      })
    ],

    resolve: {
        alias: {
          "@core": path.resolve(__dirname, "src/core"),
          "@modules": path.resolve(__dirname, "src/modules"),
          "@shared": path.resolve(__dirname, "src/shared"),
          "@components": path.resolve(__dirname, "src/components"),
          "@assets": path.resolve(__dirname, "src/components/assets"),
          "@context": path.resolve(__dirname, "src/core/context"),
      }
    },

    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(BUILD_DATE),
    },

    base: isProd ? "/intranet/" : "/",

    build: {
      outDir: isProd
        ? "D:/DESARROLLO AMBIENTE WEB/192.168.100.49 (QA)/build"
        : "dist",
      sourcemap: !isProd,
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000,
    },

    server: {
      port: 5173,
      open: false,
      proxy: isProd
        ? undefined
        : {
          "/api": {
            target: env.VITE_API_URL,
            changeOrigin: true,
            secure: false,
          },
        },
    },

  };
});