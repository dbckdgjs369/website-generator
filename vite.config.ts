import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: [
          [
            "@emotion/babel-plugin",
            {
              autoLabel: "dev-only",
              labelFormat: "[dirname]--[filename]--[local]___",
            },
          ],
        ],
      },
    }),
  ],
});
