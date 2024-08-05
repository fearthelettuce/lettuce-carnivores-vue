import BaseButton from '@/components/UI/BaseButton.vue'
import BaseDialog from './components/UI/BaseDialog.vue'

declare module 'vue' {
    export interface GlobalComponents {
        BaseButton: typeof BaseButton,
        BaseDialog: typeof BaseDialog
    }
  }