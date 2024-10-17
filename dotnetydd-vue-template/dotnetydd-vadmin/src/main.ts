import router from '@/router';
import { createApp, Directive } from "vue";
import App from "./App.vue";
import i18n from './plugins/i18n';
import store from "./store";
import "./styles/index.scss";
import "./styles/reset.scss";


const app = createApp(App);


// 自定义指令
import * as directives from "@/directives";
Object.keys(directives).forEach(key => {
    app.directive(key, (directives as { [key: string]: Directive })[key]);
});

app.use(store)
    .use(i18n)
    .use(router)
    .mount("#app");
