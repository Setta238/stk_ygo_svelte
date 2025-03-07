import { mount } from "svelte";
import "@ygo_app/css/app.css";
import App from "@ygo_app/components/App.svelte";

const app = mount(App, {
  target: document.getElementById("app")!,
});
export default app;
