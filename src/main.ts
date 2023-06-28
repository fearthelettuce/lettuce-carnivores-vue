import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'bootstrap'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'


import BaseModal from '@/components/app/UI/BaseModal.vue'
import Spinner from '@/components/app/UI/Spinner.vue'

library.add(fas);
library.add(far);

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, { showCloseButtonOnHover: true,})
app.component('fa', FontAwesomeIcon)
app.component('far', FontAwesomeIcon)
app.component('BaseModal', BaseModal)
app.component('Spinner',Spinner)
app.mount('#app')
