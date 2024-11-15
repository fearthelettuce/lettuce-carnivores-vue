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

<style scoped lang="scss">
.base-button {
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 0 2px darkslategray;
    height: fit-content
}
.base-button:hover {
    filter: brightness(105%);
}
.base-button:active {
    box-shadow: inset 0px 0px 0px #c1c1c1;
    outline: none;
}
.base-button:disabled {
    filter: brightness(75%);
    cursor:not-allowed;
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
/* .secondary {

}
.warning {

}  */
.danger {
    background-color: $medium-red;
    color: white;
    border: 0;
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
.trick {
    background: linear-gradient(0.15turn,#BFDA7A, #5E32BA);
    color: white;
}

.treat {
    background: linear-gradient(0.0turn,#ffffff, #EB6123, #F5CD08 );
    color: white;
}

.small {
    font-size: .875rem;
    padding: .25rem .5rem;
    border-radius: .2rem;
}

.normal {
    font-size: 1rem;
    padding: .5rem;
    border-radius: .5rem;
}

.large {
    font-size: 1.25rem;
    padding: .5rem 1.5rem;
    border-radius: .5rem;
}

</style>
