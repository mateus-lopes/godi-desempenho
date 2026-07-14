import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router/index";
import "./style.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, { theme: { preset: Aura, options: { darkModeSelector: false } } });

app.mount("#app");
