<template>
   <div>
       <fwb-modal v-if="isShowModal" :ref="props.id" @close="hideModal">
        <h5>
            <slot name="title"></slot>
        </h5>
        <slot name="body"></slot>
        <template #footer>
          <div class="flex justify-between">
            <fwb-button @click="hideModal" color="alternative">
              Close
            </fwb-button>
            <slot name="modalAction"></slot>
          </div>
        </template>
         </fwb-modal>
   </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { FwbButton, FwbModal } from 'flowbite-vue'
const props = defineProps(['id'])
const isShowModal = ref(false)

function showModal () {
  isShowModal.value = true
}

function hideModal () {
  isShowModal.value = false
}

defineExpose({
    showModal,
    hideModal
})
</script>

<style scoped>
   
    .btn-close{
        position: absolute;
        top: 0;
        right: 0;
        padding: 1em 2em;
        cursor: pointer;
    }
    .btn-close:hover{
        cursor: pointer;
    }
</style>