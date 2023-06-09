import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import { createPinia } from 'pinia'
app.use(createPinia())

import 'bootstrap'

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(fas);
library.add(far);
app.component('FontAwesome', FontAwesomeIcon)

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
app.use(Toast, { showCloseButtonOnHover: true,})

import { plugin, defaultConfig } from '@formkit/vue'
app.use(plugin, defaultConfig)

import BaseModal from '@/components/app/UI/BaseModal.vue'
import BaseSpinner from '@/components/app/UI/BaseSpinner.vue'
app.component('BaseModal', BaseModal)
app.component('BaseSpinner',BaseSpinner)

import { useUserStore } from './components/modules/auth/stores/users';
const userStore = useUserStore()

import { router } from './router'
userStore.initializeAuthListener().then(() => {
    app.use(router).mount('#app')
})