<template>
  <div class="flex-center column">
    <div class="arrow-button">
      <button class="px-1 py-0" v-if="index !== 0" @click="$emit('move-up', index, index - 1)">
        <FontAwesome class="move-arrow" icon="caret-up" />
      </button>
    </div>
    <div class="arrow-button">
      <button v-if="!isLast" class="px-1 py-0" @click="$emit('move-down', index, index + 1)">
        <FontAwesome class="move-arrow" icon="caret-down" />
      </button>
    </div>
  </div>
  <div class="flex align-center">
    <div>{{ photo.name }}</div>
  </div>

  <div class="flex-center column">
    <img class="imagePreview" :src="photoSrc(photo, 256)" />
  </div>
  <div class="flex align-center">
    <div @click="$emit('remove-photo', index)">
      <FontAwesome icon="dumpster-fire" size="lg" style="color: #f29c07" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import type { PhotoItem } from '@/types/Product'
import type { SelectedFile } from './usePhotoManager'
import { getPhotoUrl, type AllowedSizes } from '@/composables/usePhotoUtils'

const emit = defineEmits(['move-up', 'move-down', 'remove-photo'])
defineProps({
  photo: {
    type: Object as PropType<PhotoItem>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  isLast: {
    type: Boolean,
    required: false,
  },
})

function photoSrc(photo: PhotoItem | SelectedFile, size: AllowedSizes = 256) {
  return getPhotoUrl((photo as PhotoItem).path, size)
}
</script>

<style scoped lang="scss">
.move-arrow {
  --fa-li-margin: 0;
}
.arrow-button {
  min-width: 1rem;
}
</style>
