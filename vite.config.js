import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      ...(mode === "production"
        ? [
            VitePWA({
              registerType: "autoUpdate",
              injectRegister: "auto",
              includeAssets: [
                "favicon.svg",
                "favicon.ico",
                "robots.txt",
                "apple-touch-icon.png",
              ],
              manifest: {
                name: "FinMark by Imperionite",
                short_name: "FMI",
                description: "Online ordering system by Imperionite",
                theme_color: "#1976d2",
                background_color: "#ffffff",
                display: "standalone",
                start_url: "/",
                icons: [
                  {
                    src: "/pwa-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                  },
                  {
                    src: "/pwa-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                  },
                  {
                    src: "/pwa-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any maskable",
                  },
                ],
              },
              workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
                runtimeCaching: [
                  {
                    urlPattern: /^https:\/\/www\.arnelimperial\.com\/api\/.*$/,
                    handler: "NetworkFirst",
                    options: {
                      cacheName: "api-cache",
                      expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 60, // 1 minute
                      },
                      cacheableResponse: {
                        statuses: [0, 200],
                      },
                    },
                  },
                ],
              },
              devOptions: {
                enabled: false,
              },
            }),
          ]
        : []),
    ],
  };
});
