import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), visualizer()],
  base: process.env.DEV ? "/" : "/stk_ygo_svelte",
  resolve: {
    alias: {
      "@stk_utils": path.join(__dirname, "src/stk_utils"),
      "@app": path.join(__dirname, "src/app"),
      "@ygo": path.join(__dirname, "src/ygo"),
      "@ygo_deck_editor": path.join(__dirname, "src/ygo_deck_editor"),
      "@ygo_duel": path.join(__dirname, "src/ygo_duel"),
      "@ygo_duel_view": path.join(__dirname, "src/ygo_duel_view"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: "./index.html",
        note: "./note.html",
      },
      output: {
        manualChunks(id) {
          if (id.endsWith("cardInfo.json")) {
            return "cardInfo";
          }
        },
        chunkFileNames: "assets/cardInfo.js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});

console.log(process.env.DEV);
