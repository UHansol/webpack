import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

import VMask from "@ssibrahimbas/v-mask";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const app = createApp(App).use(VMask).use(router);

axios.defaults.baseURL = "http://localhost:8083";

app.use(router);

app.component("VueDatePicker", VueDatePicker);
app.mount("#app");
