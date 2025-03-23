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
      "@ygo": path.join(__dirname, "src/ygo"),
      "@ygo_app": path.join(__dirname, "src/ygo_app"),
      "@ygo_deck_editor": path.join(__dirname, "src/ygo_deck_editor"),
      "@ygo_duel": path.join(__dirname, "src/ygo_duel"),
      "@ygo_duel_view": path.join(__dirname, "src/ygo_duel_view"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          console.log(id);
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
