<template>
    <component :is="icon" class="fill-current" />
  </template>

<script setup>
  import { defineAsyncComponent } from 'vue';

  const props = defineProps({
    name: {
      type: String,
      required: true,
    }
  });

  const icon = defineAsyncComponent(() =>
    import(`./src/assets/icons/${props.name}.svg`)
  );
</script>
