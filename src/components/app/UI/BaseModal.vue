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