<template>
    <div class="toast bg-success" role="alert" aria-live="assertive" aria-atomic="true">
        <div v-if="this.$slots.toastHeader" class="toast-header">
            <slot name="toastHeader"></slot>
        </div>
        <div class="d-flex">
            <div class="toast-body">
                <slot name="toastBody"></slot>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    toastId: String,
})
</script>