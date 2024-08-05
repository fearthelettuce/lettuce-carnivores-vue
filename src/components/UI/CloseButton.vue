<template>
    <div class="close" type="button" aria-label="Close"></div>
</template>

<script setup lang="ts">
// defineProps({
//     buttonColor: {
//         type: String,
//         default: 'default'
//     }
// })
</script>
<style scoped>
.close {
  position: absolute;
  right: 1.5rem;
  top: .7rem;
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0.5;
}
.close:hover {
  opacity: 1;
}
.close:before, .close:after {
  position: absolute;
  left: 15px;
  content: ' ';
  height: 33px;
  width: 2px;
  background-color: #e1dcbd;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}


</style>