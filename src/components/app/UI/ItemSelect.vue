<template>
    <div class="form-floating">
        <select 
            :name="props.id" 
            :id="props.id"
            class="form-select"
            :aria-label="props.label"  
            v-model="model"
        >
            <option v-for="option in options" :value="option" :key="option.id" >{{ option.name }} ({{ option.id }})</option>
        </select>
        <label :for="props.id">{{ props.label }}</label>
    </div>
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