import BaseButton from '@/components/UI/BaseButton.vue'

declare module 'vue' {
    export interface GlobalComponents {
        BaseButton: typeof BaseButton,
    }
  }