import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  resolve:{
    alias: {
      "@stk_utils": "./src/stk_utils",
      "@ygo":  "./src/ygo",
      "@ygo_duel":  "./src/ygo_duel",
      "@ygo_duel_view": "src/ygo_duel_view",
    }
  }}

