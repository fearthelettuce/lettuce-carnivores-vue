<template>
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div v-if="this.$slots.toastHeader" class="toast-header">
        <slot name="toastHeader"></slot>
    </div>
    <div class="toast-body">
        <slot name="toastBody"></slot>
    </div>
</div>
</template>

<script setup lang="ts">
const props = defineProps({
    toastId: String,
})
</script>