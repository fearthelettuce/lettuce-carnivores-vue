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
                    <button 
                    type="button" 
                    class="btn-close" 
                    aria-label="Close"
                    @click="hideModal"
                    ></button>
                    <slot name="close-action"></slot>
                </div>
                <div class="modal-body text-center">
                    <slot name="body"></slot>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" @click="hideModal">Close</button>
                    <slot name="modalAction"></slot>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
// import { Modal } from 'bootstrap' TODO: primevue replace modal


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