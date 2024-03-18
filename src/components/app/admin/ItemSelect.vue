<template>
    <select 
        :name="props.id" 
        :id="props.id"
        class="" 
        :aria-label="props.label"  
        v-model="model">
        <option v-for="option in options" :value="option" :key="option.id" >{{ option.name }} ({{ option.id }})</option>
    </select>
    <label :for="props.id" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">{{ props.label }}</label>
</template>

<script setup lang="ts" generic="T extends SelectItem">
import {type PropType } from 'vue';
    
    export type SelectItem = {
        id: number, 
        name: string,
    }
    const model = defineModel({type: Object as PropType<T>})
    const props = defineProps<{
        options: T[],
        label: string,
        id: string,
        includeCreate: boolean,
    }>();


</script>

<style scoped>

</style>