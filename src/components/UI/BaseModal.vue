<template>
    <div
        ref="modal"
        id="modal"
        class="modal fade"
        tabindex="-1"
        aria-hidden="true"
    >
        <div   
            class="modal-dialog modal-lg"
            @closeModal="hideModal"
        >
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title"><slot name="title"></slot></h5>
                    <CloseButton
                        @click="hideModal"
                    />
                    <slot name="close-action"></slot>
                </div>
                
                <div class="modal-body textcenter">
                    <slot name="body"></slot>
                </div>
                <div class="modal-footer border-0">
                    <BaseButton theme="secondary" @click="hideModal">Close</BaseButton>
                    <slot name="modalAction"></slot>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { Modal } from 'bootstrap'
import CloseButton from './CloseButton.vue'


const state = reactive({
    modal: Modal || null,
})

defineProps({
    modalAction: {
        type: Object,
        required: false,
    }
})

defineExpose({
    showModal,
    hideModal
})

onMounted(()=>{
    state.modal = new Modal('#modal', {})
})

function showModal() {
    state.modal.show()
}

function hideModal() {
    state.modal.hide()
}
</script>