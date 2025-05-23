import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";

// https://vite.dev/config/

const tmpDate = new Date();

const y = tmpDate.getFullYear().toString();
const m = ("0" + (tmpDate.getMonth() + 1)).slice(-2);
const d = ("0" + tmpDate.getDate()).slice(-2);
const h = ("0" + tmpDate.getHours()).slice(-2);
const n = ("0" + tmpDate.getMinutes()).slice(-2);
const s = ("0" + tmpDate.getSeconds()).slice(-2);
const timestamp = `${y}${m}${d}_${h}${n}${s}`;
console.log(timestamp);
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
        },
        chunkFileNames: `assets/[name]_${timestamp}.js`,
        assetFileNames: `[name]_${timestamp}.[ext]`,
      },
    },
  },
  define: {
    "import.meta.env.VITE_BUILD_TIMESTAMP": JSON.stringify(timestamp),
  },
});
