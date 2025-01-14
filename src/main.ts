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

import BaseSpinner from '@/components/UI/BaseSpinner.vue'
import BaseContainer from '@/components/UI/BaseContainer.vue'
import BaseButton from './components/UI/BaseButton.vue'
app.component('BaseSpinner', BaseSpinner)
app.component('BaseContainer', BaseContainer)
app.component('BaseButton', BaseButton)

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
          focusColor: '{stone.800}'
        },
        list: {
          option: {
            focusColor: '#e1dcbd',
          },
        },
        text: {
          color: '#e1dcbd'
        },
        formField: {
          color: '#e1dcbd',
          background: '{stone.600}',
        },
        header: {
          color: 'red',
          background: '{stone.100'
        }

      },
      chip: {
        background: '{stone.200}',
      },
      accordion: {
        header: {
          background: 'red',
        }
      }
    }
  }
});

app.use(PrimeVue, {
  theme: {
    preset: primeVuePreset
  }
})

import { useUserStore } from '@/stores/users.js'
const userStore = useUserStore()

import { router } from '@/router'
userStore.initializeAuthListener().then(() => {
  app.use(router).mount('#app')
})