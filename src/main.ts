import { createApp } from 'vue'
import './assets/style.css'

import App from './App.vue'
import XingLY from './index'
const app = createApp(App)

app.use(XingLY)

app.mount('#app')
