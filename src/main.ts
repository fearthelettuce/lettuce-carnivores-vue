import { createApp } from 'vue'
import App from '@/App.vue'
const app = createApp(App)
import '@/assets/index.css'
import { createPinia } from 'pinia'
app.use(createPinia())
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(fas);
library.add(far);
app.component('FontAwesome', FontAwesomeIcon)

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';
app.use(Vue3Toastify, {
  autoClose: 2000,
  clearOnUrlChange: false,
  theme: 'colored',
} as ToastContainerOptions)

import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
app.component('BaseSpinner', BaseSpinner)
app.component('BaseContainer', BaseContainer)
app.component('BaseButton', BaseButton)

import { plugin, defaultConfig } from '@formkit/vue'
// @ts-ignore  
import customConfig from '../formkit.config.js'

app.use(plugin, defaultConfig({
  config: customConfig.config
}))

import { useUserStore } from '@/stores/users.js'
const userStore = useUserStore()

import { router } from '@/router'
userStore.initializeAuthListener().then(() => {
  app.use(router).mount('#app')
})