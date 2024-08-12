import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

import * as echarts from "echarts";

const app = createApp(App);

app.use(ElementPlus);

app.config.globalProperties.$echarts = echarts;

app.mount("#app");
