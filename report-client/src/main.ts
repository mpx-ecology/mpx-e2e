import { createApp } from 'vue'
import { createPinia } from 'pinia'
import initSocket from './common/js/socket'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import 'highlight.js/styles/monokai-sublime.css'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import hljsVuePlugin from "@highlightjs/vue-plugin";

import App from './App.vue';
import router from './router';

hljs.registerLanguage('javascript', javascript);

const app = createApp(App)
app.component('highlightjs', hljsVuePlugin.component);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
