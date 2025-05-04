import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    visualizer({ filename: "visualizer_treemap.html", template: "treemap" }),
    visualizer({ filename: "visualizer_network.html", template: "network" }),
    visualizer({ template: "raw-data" }),
    checker({
      typescript: true,
    }),
  ],
  base: process.env.DEV ? "/" : "/stk_ygo_svelte",
  resolve: {
    alias: {
      "@stk_utils": path.join(__dirname, "src/stk_utils"),
      "@app": path.join(__dirname, "src/app"),
      "@ygo": path.join(__dirname, "src/ygo"),
      "@ygo_entity_proc": path.join(__dirname, "src/ygo_entity_proc"),
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
        md: "./md.css",
      },
      output: {
        manualChunks(id) {
          if (id.endsWith("cardInfo.json")) {
            return "json";
          }
          if (id.includes("src/ygo_entity_proc")) {
            return "entity_proc";
          }
          if (id.includes("src/ygo_duel")) {
            return "duel";
          }
        },
        chunkFileNames: "assets/[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});

console.log(process.env.DEV);
