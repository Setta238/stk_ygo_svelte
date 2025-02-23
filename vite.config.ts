import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "/",
  resolve: {
    alias: {
      "@stk_utils": path.join(__dirname, "src/stk_utils"),
      "@ygo": path.join(__dirname, "src/ygo"),
      "@ygo_duel": path.join(__dirname, "src/ygo_duel"),
      "@ygo_duel_modal": path.join(__dirname, "src/ygo_duel_modal"),
    },
  },
});
