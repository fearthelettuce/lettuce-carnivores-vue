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

import Vue3Toastify, {type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';
app.use(Vue3Toastify, {
    autoClose: 2000,
    clearOnUrlChange: false,
    theme: 'colored',
  } as ToastContainerOptions)

import BaseModal from '@/components/app/UI/BaseModal.vue'
import BaseSpinner from '@/components/app/UI/BaseSpinner.vue'
import BaseContainer from './components/app/UI/BaseContainer.vue'
app.component('BaseModal', BaseModal)
app.component('BaseSpinner',BaseSpinner)
app.component('BaseContainer', BaseContainer)

import { plugin, defaultConfig } from '@formkit/vue'
// @ts-ignore  
import customConfig from '../formkit.config.js'

app.use(plugin, defaultConfig({
  config: customConfig.config
}))

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes'
const primeVuePreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      dark: {
          surface: {
              0: '{stone.200}',
              50: '{stone.50}',
              100: '{stone.100}',
              200: '{stone.200}',
              300: '{stone.300}',
              400: '{stone.400}',
              500: '{stone.500}',
              600: '{stone.600}',
              700: '{stone.700}',
              800: '{stone.800}',
              900: '{stone.900}',
              950: '{stone.950}'
          },
          primary: {
              color: '{stone.200}',
              inverseColor: '{stone.950}',
              hoverColor: '{stone.100}',
              activeColor: '{stone.200}'
          },
          highlight: {
              background: 'hsl(33, 7%, 25%)',
              focusBackground: '#e1dcbd',
              color: '#e1dcbd',
              focusColor: '#e1dcbd'
          },
          text: {
            color: '#e1dcbd'
          },
          formField: {
            color: '#e1dcbd',
            background: '{stone.600}',
          },
          
      },
      chip: {
        background: '{stone.200}',
      }
    }
  }
});

app.use(PrimeVue, {
  theme: {
    preset: primeVuePreset
  }
})

import { useUserStore } from './components/modules/auth/stores/users';
const userStore = useUserStore()

import { router } from './router'
userStore.initializeAuthListener().then(() => {
    app.use(router).mount('#app')
})