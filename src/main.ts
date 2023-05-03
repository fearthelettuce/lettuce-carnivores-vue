import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'bootstrap'

import BaseModal from './components/app/UI/BaseModal.vue';

library.add(fas);
library.add(far);

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('fa', FontAwesomeIcon)
app.component('BaseModal',BaseModal)
app.mount('#app')
