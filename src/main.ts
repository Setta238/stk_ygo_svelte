import { mount } from "svelte";
import "@app/css/app.css";
import "@ygo/css/ygo_card.css";
import App from "@app/components/App.svelte";

const app = mount(App, {
  target: document.getElementById("app")!,
});
export default app;
