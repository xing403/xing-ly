import { createApp } from 'vue'
import './style.css'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'


import App from './App.vue'

import XingLy from '.'
createApp(App)
.use(XingLy)
.mount('#app')
