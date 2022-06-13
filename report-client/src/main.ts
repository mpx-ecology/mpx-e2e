import { createApp } from 'vue'
import { createPinia } from 'pinia'
import initSocket from './common/js/socket'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(createPinia())
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(router)

app.mount('#app')

initSocket()
