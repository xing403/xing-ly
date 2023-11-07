import { createApp } from 'vue'
import App from './App.vue'
import XingLY from 'xing-ly'

import 'xing-ly/dist/style.css'

import './assets/style.css'

const app = createApp(App)
app.use(XingLY)
app.mount('#app')
