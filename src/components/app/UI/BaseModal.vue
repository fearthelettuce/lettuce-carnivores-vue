<template>

<div
    :id="props.modalId"
    class="modal fade"
    tabindex="-1"
    :aria-labelledby="props.modalId +'Label'"
    aria-hidden="true"
>
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header border-0">
                <h5 class="modal-title" :id="props.modalId +'Label'"><slot name="title"></slot></h5>
                <button 
                type="button" 
                class="btn-close" 
                aria-label="Close"
                data-bs-dismiss="modal"
                ></button>
                <slot name="close-action"></slot>
            </div>
            <div class="modal-body text-center">
                <slot name="body"></slot>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <slot v-if="this.$slots.modalAction" name="modalAction"></slot>

            </div>
        </div>

    </div>
</div>

</template>

<script setup lang="ts">

const props = defineProps({
    modalId: String,
})

</script>














<!-- <template>

    <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="modalLabel"><slot name="modalTitle"></slot></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                    <div class="modal-body text-center">
                    <slot name="modalContent"></slot>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <slot name="modalAction"></slot>
                    <button type="button" class="btn" :class="actionButtonClass" @click="clickAction">{{ actionButtonLabel }}</button>
                </div>
            </div>
        </div>
    </div>
</template> -->

<!-- <script setup lang="ts">
import {reactive, onMounted, defineExpose} from 'vue'
import {Modal} from 'bootstrap'

const props = defineProps({
    modalId: String,
    modalTitle: String,
    modalText: String,
    actionButtonLabel: String,
    actionButtonClass: String,

})

const emit = defineEmits(['submitAction'])

const state = reactive({
    baseModal: null
})

onMounted(() => {
    state.baseModal = new Modal(`#${props.modalId}`,{})
})

function clickAction() {

    hideModal()
    emit('submitAction')
}

defineExpose(() => { showModal })
function showModal() {
    state.baseModal.show()
}
function hideModal() {
    state.baseModal.hide()
}

</script> -->