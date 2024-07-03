<template>
     <FormKit 
        type="text"
        :label="isGeneric ? 'SKU' : 'Specimen #'"
      />
      <FormKit 
        type="text"
        label="Size"
      />
      <FormKit 
        type="text"
        number
        label="Price"
      />
      <FormKit 
        type="text"
        number
        label="Sale Price"
      />
      <FormKit 
        type="text"
        number
        label="Quantity"
      />
      <FormKit 
        type="text"
        number
        label="For Sale?"
      />
      <FormKit 
        type="text"
        number
        label="Discounted?"
      />
      <button class="btn btn-primary" @click="savePlantItem">Add Photos</button>

</template>

<script setup lang="ts">
const { isGeneric } = defineProps<{ isGeneric: boolean, }>()

function savePlantItem() {
    
}
</script>

<style> 