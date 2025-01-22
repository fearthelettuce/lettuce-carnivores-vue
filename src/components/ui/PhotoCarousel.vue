<template>
<div class="embla">
  <div class="embla__viewport" ref="emblaRef">
    <div class="embla__container">
      <div v-for="(photo, index) in photos" :key="photo.path" class="embla__slide">
        <img class="display-image" :src="getPhotoUrl(photo.path, 960)" />
      </div>
    </div>
  </div>

  <div class="embla-thumbs">
    <button class="arrow-button" @click="back"><ArrowLeft /></button>
    <div class="embla-thumbs__viewport">
      <div class="embla-thumbs__container">
        <div v-for="(photo, index) in photos" :key="`${photo.path}-thumb`" 
        class="embla-thumbs__slide" :class="index === selectedIndex ?  'embla-thumbs__slide--selected' : ''">
          <button type="button" class="embla-thumbs__slide__button" @click="scrollTo(index)">
              <img class="thumb-image" :src="getPhotoUrl(photo.path, 256)" />
          </button>
        </div>
      </div>
    </div>
    <button class="arrow-button" @click="next"><ArrowRight /></button>

  </div>


</div>

</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';
import type { PhotoItem } from '@/types/Product'
import emblaCarouselVue from 'embla-carousel-vue'
import { getPhotoUrl } from '@/composables/usePhotoUtils';
import ArrowLeft from '@/assets/icons/ArrowLeft.vue';
import ArrowRight from '@/assets/icons/ArrowRight.vue';
  const props = defineProps<{photos: Array<PhotoItem>}>()
  const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true })
  const selectedIndex = ref(0)
  watch(() => props.photos, () => {
    scrollTo(0, true)
  })
  function scrollTo(index: number, jump: boolean = false) {
    emblaApi.value!.scrollTo(index)
    selectedIndex.value = index
  }
  function back() {
    emblaApi.value?.scrollPrev()
    selectedIndex.value = emblaApi.value!.selectedScrollSnap()
  }
  function next() {
    emblaApi.value?.scrollNext()
    selectedIndex.value = emblaApi.value!.selectedScrollSnap()
  }
</script>

<style scoped lang="scss">
.arrow-button {
  padding: .4rem;
  display: flex;
  align-items: center;
}
.embla {
  margin: auto;
  --slide-spacing: 1rem;
  --slide-size: 100%;
}
.embla__viewport {
  overflow: hidden;
  width: 100%;
	box-shadow: 0px -1px 10px 3px $light-gray;
	border-radius: 1.8rem;
}
.embla__container {
  display: flex;
  align-items: flex-start;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);
}
.embla__slide {
  transform: translate3d(0, 0, 0);
  padding-left: var(--slide-spacing);
  flex: 0 0 100%;
  min-width: 0;
}
.display-image {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 1.8rem;
	object-fit: cover;
	box-shadow: 0px 5px 4px 2px $light-gray;
}
.embla-thumbs {
  --thumbs-slide-spacing: 0.5rem;
  --thumbs-slide-height: 6rem;
  margin-top: var(--thumbs-slide-spacing);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}
.embla-thumbs__viewport {
  overflow: hidden;
}
.embla-thumbs__container {
  display: flex;
  flex-direction: row;
  margin-left: calc(var(--thumbs-slide-spacing) * -1);
  width: 100%;
}
.embla-thumbs__slide {
  display: flex;
	height: var(--thumbs-slide-height);
	justify-content: center;
  min-width: 0;
  padding-left: var(--thumbs-slide-spacing);
  opacity: 45%;
  transition: opacity 1s;
}
.thumb-image {
	border-radius: .5rem;
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.embla-thumbs__slide:hover {
  opacity: 80%;
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
} */
.embla-thumbs__slide--selected {
  opacity: 100% !important;
}
@media(min-width: 50rem) {
	.embla-thumbs {
		--thumbs-slide-spacing: 0.8rem;
		--thumbs-slide-height: 10rem;
		margin-top: var(--thumbs-slide-spacing);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}
	.arrow-button {
		padding: 2rem;
	}
}

</style>