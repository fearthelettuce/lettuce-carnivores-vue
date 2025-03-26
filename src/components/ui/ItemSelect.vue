<template>
    <div class="">
        <select 
            :name="props.id" 
            :id="props.id"
            :aria-label="props.label"  
            v-model="model"
        >
            <option v-for="option in options" :value="option" :key="option.id" >{{`${option.name} ${option?.clone} (${option.id})`}}</option>
        </select>
        <label :for="props.id">{{ props.label }}</label>
    </div>
</template>

<script setup lang="ts" generic="T extends SelectItem">
import {type PropType } from 'vue';
    
    export type SelectItem = {
        id: string | number, 
        name: string,
        clone?: string,
    }
    const model = defineModel({type: Object as PropType<T>})
    const props = defineProps<{
        options: T[],
        label?: string,
        id: string
    }>();


</script>

<style scoped>
    select {
        width: clamp(20rem, 50dvw, 60rem);
    }
</style>