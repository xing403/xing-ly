import { createApp } from 'vue'
import App from './App.vue'
import XingLY from './index'

import './assets/style.css'

const app = createApp(App)
app.use(XingLY)
app.mount('#app')
