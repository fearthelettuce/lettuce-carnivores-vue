import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import { createPinia } from 'pinia'
app.use(createPinia())

import PrimeVue from 'primevue/config';
import Lara from '@/lib/lara';
app.use(PrimeVue, {
  unstyled: true,
  pt: Lara,
  ripple: true,
});
app.directive('ripple', Ripple)

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(fas);
library.add(far);
app.component('FontAwesome', FontAwesomeIcon)

import Vue3Toastify, {type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';
app.use(Vue3Toastify, {
    autoClose: 2000,
    clearOnUrlChange: false,
    theme: 'colored',
  } as ToastContainerOptions)

import { plugin, defaultConfig } from '@formkit/vue'
app.use(plugin, defaultConfig)

import BaseModal from '@/components/app/UI/BaseModal.vue'
import BaseSpinner from '@/components/app/UI/BaseSpinner.vue'
import BaseContainer from './components/app/UI/BaseContainer.vue'
app.component('BaseModal', BaseModal)
app.component('BaseSpinner',BaseSpinner)
app.component('BaseContainer', BaseContainer)

import { useUserStore } from './components/modules/auth/stores/users';
const userStore = useUserStore()

import { router } from './router'
import Ripple from 'primevue/ripple'
userStore.initializeAuthListener().then(() => {
    app.use(router).mount('#app')
})