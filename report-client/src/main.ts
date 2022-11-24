import { createApp } from 'vue'
import { createPinia } from 'pinia'
import initSocket from './common/js/socket'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import App from './App.vue';
import router from './router';


const app = createApp(App)
// @ts-ignore
app.use(createPinia())
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(router)

// 注册element图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app')

initSocket()
