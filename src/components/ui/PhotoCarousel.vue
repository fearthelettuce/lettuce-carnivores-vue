<template>
<div class="embla" ref="emblaRef">
  <div class="embla__viewport">

    <div class="embla__container">
      <div v-for="photo in photos" :key="photo.path" class="embla__slide">
        <img class="embla__slide__image" :src="getPhotoUrl(photo.path, 960)" />
      </div>
    </div>
  </div>

  <div class="embla-thumbs">
    <div class="embla-thumbs__viewport">
      <div class="arrow-button">Back</div>
      <div class="embla-thumbs__container">
        <div v-for="photo in photos" :key="`${photo.path}-thumb`" 
        class="embla-thumbs__slide" :class="true ?  'embla-thumbs__slide--selected' : ''">
          <button type="button" class="embla-thumbs__slide__button">
              <img class="embla__thumbs__image" :src="getPhotoUrl(photo.path, 256)" />
          </button>
        </div>
      </div>
      <div class="arrow-button">Onward</div>
    </div>
  </div>


</div>

</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { PhotoItem } from '@/types/Product'
import emblaCarouselVue from 'embla-carousel-vue'
import { getPhotoUrl } from '@/composables/usePhotoUtils';
  const props = defineProps<{photos: Array<PhotoItem>}>()
  const [emblaRef] = emblaCarouselVue()
</script>

<style scoped>

/* .embla {
    overflow: hidden;
  }
  .embla__container {
    display: flex;
  }
  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
  } */

.arrow-button {
  width: 5rem;
  display: flex;
  align-items: center;
}
.embla {
  margin: auto;
  --slide-height: 50rem;
  --slide-spacing: 1rem;
  --slide-size: 100%;
}
.embla__viewport {
  overflow: hidden;
  width: 100%;
}
.embla__container {
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);

}
.embla__slide {
  transform: translate3d(0, 0, 0);
  flex: 0 0 var(--slide-size);
  min-width: 0;
  padding-left: var(--slide-spacing);
}
.embla__slide__image {
  box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast);
  border-radius: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  width: 100%;
}
.embla-thumbs {
  --thumbs-slide-spacing: 0.8rem;
  --thumbs-slide-height: 6rem;
  margin-top: var(--thumbs-slide-spacing);
}
.embla-thumbs__viewport {
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.embla-thumbs__container {
  display: flex;
  flex-direction: row;
  margin-left: calc(var(--thumbs-slide-spacing) * -1);
  width: 100%;
}
.embla-thumbs__slide {
  flex: 0 0 22%;
  min-width: 0;
  padding-left: var(--thumbs-slide-spacing);
}
/* @media (min-width: 576px) {
  .embla-thumbs__slide {
    flex: 0 0 15%;
  }
}
.embla-thumbs__slide__button {
  border-radius: 1.8rem;
  -webkit-tap-highlight-color: rgba(var(--text-high-contrast-rgb-value), 0.5);
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
  touch-action: manipulation;
  display: inline-flex;
  text-decoration: none;
  cursor: pointer;
  border: 0;
  padding: 0;
  margin: 0;
  box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--detail-high-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--thumbs-slide-height);
  width: 100%;
}
.embla-thumbs__slide--selected .embla-thumbs__slide__number {
  color: var(--text-body);
} */

</style>