<template>
    <button class="base-button" :class="type, size"><slot></slot><span v-if="isLoading" class="spinner-border"></span></button>
</template>

<script setup lang="ts">

const props = defineProps({
    type: {
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
    }
})
</script>

<style scoped>
.base-button {
    border-radius: .5rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 0 2px darkslategray;
}
.base-button:hover {
    filter: brightness(105%);
}
.base-button:active {
    box-shadow: 2px 3px darkslategray;
    transform: translateY(3px);
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
}
.secondary {

}
.warning {

}
.danger {

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
.checkout {
    background: linear-gradient(0.15turn,#FFBF46, #fccb72, #FFBF46);
    color: black;
}

.small {
    font-size: .75rem;
    padding: .125rem .5rem;
}

.normal {
    font-size: 1rem;
    padding: .25rem .75rem;
}

.large {
    font-size: 1.25rem;
    padding: .5rem 1.25rem;
}

</style>