import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    __VUE_OPTIONS_API__: 'false',
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/scss/_variables.scss";'
      }
    }
  }
})
