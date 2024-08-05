<template>
    <button class="base-button" :type :class="theme, size"><slot></slot><span v-show="isLoading" role="status" class="spinner-border"></span></button>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
    theme: {
        type: String,
        default: 'primary'
    },
    isLoading: {
        type: Boolean,
        required: false,
    },
    size: {
        type: String,
        default: 'normal'
    },
    type: {
        type: String as PropType<'button' | 'submit' | 'reset' | undefined>,
        default: 'button'
    }
})
</script>

<style scoped>
.base-button {
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 0 2px darkslategray;
}
.base-button:hover {
    filter: brightness(105%);
}
.base-button:active {
    box-shadow: 2px 3px darkslategray;
    transform: translateY(2px);
}
.base-button:disabled {
    filter: brightness(60%);
    cursor: not-allowed;
}
.spinner-border {
    height: 1rem;
    width: 1rem;
    margin-left: 1rem;
}

.primary {
    background-color: #9fdb50;
    color: black;
    border: none;
}
.info {
    background-color: #00A0E5;
    color: white;
    border: none;
}
.secondary {
    background-color: #c0c5b9;
    color: black;
    border: none;
}
.warning {
    background-color: #FFBF46;
    color: black;
    border: none;
}
.light {
    background-color: #f8f9fa;
    color: black;
    border: none;
}
.light-outline {
    color: #f8f9fa;
    background-color: transparent;
    border: 1px solid #f8f9fa;
    color: black;
}

.link-outline {
    color: #00A0E5;
    border: none;
    background-color: transparent;
    box-shadow: none;
}
.link-outline:active {
    box-shadow: none !important;
    transform: none;
}

.danger {
    background-color: #EB5E55;
    color: black;
    border: none;
}
.primary-outline {
    border: 1px solid #9fdb50;
    color: #9fdb50;
    background-color: transparent;
}
.primary-outline:hover {
    border: 1px solid #9fdb50;
    background-color: #9fdb50;
    color: black;
}
.secondary-outline {
    border: 1px solid #c0c5b9;
    color: #e1dcbd;
    background-color: transparent;
}
.secondary-outline:hover {
    border: 1px solid #c0c5b9;
    background-color: #c0c5b9;
    color: black;
}

.checkout {
    background: linear-gradient(0.15turn,#FFBF46, #fccb72, #FFBF46);
    color: black;
    border: none;
    box-shadow: 0 0 2px darkslategray;
}

.small {
    font-size: .875rem;
    padding: .25rem .5rem;
    border-radius: .2rem;
}

.normal {
    font-size: 1rem;
    padding: .4rem .75rem;
    border-radius: .3rem;
}

.large {
    font-size: 1.25rem;
    padding: .5rem 1.25rem;
    border-radius: .5rem;
    font-weight: 500;
}


</style>