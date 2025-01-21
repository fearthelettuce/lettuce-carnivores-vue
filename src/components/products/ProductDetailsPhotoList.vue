<template>
    <!-- <section class="align-center">
        <div v-if="props.photos.length === 0" class="text-center text-warning">
            <h3>No photos to display :(</h3>
        </div>
        <div v-else class="photo-grid">
            <figure v-for="photo of props.photos" :key=photo.path.toString() @click="setSelectedPhoto(photo)"
                @mouseover="setSelectedPhoto(photo)" class="photo-list-item">
                <img :src="getPhotoUrl(photo.path.toString())">
            </figure>
            <figure class="selected-image" @click="showImageZoomModal"><img :src="displayPhoto"></figure>
        </div>
    </section> -->

  <div class="carousel-container">
    <Carousel
      class="w-full"
      @init-api="(val) => emblaMainApi = val"
    >
      <CarouselContent class="photo-content">
        <CarouselItem v-for="(photo, index) of props.photos" :key=photo.path.toString()>
          <div class="p-1">
            <Card>
              <CardContent class="flex aspect-square items-center justify-center p-6">
                <img class="display-photo" :src="getPhotoUrl(photo.path.toString(), 960)">
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext /> 
    </Carousel>
    <Carousel class="w-full d-block" @init-api="(val) => emblaThumbnailApi = val">
      <CarouselContent class="flex gap-1 ml-0 justify-space-evenly">
        <CarouselItem v-for="(photo, index) of props.photos" :key=photo.path.toString() class="pl-0 basis-1/4 cursor-pointer" @click="onThumbClick(index)">
          <div class="p-1" :class="index === selectedIndex ? '' : 'opacity-50'">
            <img :src="getPhotoUrl(photo.path.toString())">
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </div>

  <ImageZoomModal v-if="props.photos.length !== 0" ref="imageZoomModalRef" :photo="state.selectedPhoto" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import ImageZoomModal from '@/components/ui/ImageZoomModal.vue';
import type { PhotoItem, } from '@/types/Product';
import { getPhotoUrl } from '@/composables/usePhotoUtils'
// import {
//   Carousel,
//   type CarouselApi,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel'
import { watchOnce } from '@vueuse/core'

const emblaMainApi = ref<CarouselApi>()
const emblaThumbnailApi = ref<CarouselApi>()
const selectedIndex = ref(0)

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value)
    return
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap()
  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap())
}

function onThumbClick(index: number) {
  if (!emblaMainApi.value || !emblaThumbnailApi.value)
    return
  emblaMainApi.value.scrollTo(index)
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi)
    return

  onSelect()
  emblaMainApi.on('select', onSelect)
  emblaMainApi.on('reInit', onSelect)
})

const props = defineProps<{
    photos: Array<PhotoItem>,
}>()

const state = reactive({
    selectedPhoto: {} as PhotoItem,
})

const displayPhoto = computed(() => {
    return getPhotoUrl(state.selectedPhoto.path, 960)
})

const imageZoomModalRef = ref<InstanceType<typeof ImageZoomModal> | null>(null)
watch(() => props.photos, () => {
    if (props.photos) {
        state.selectedPhoto = props.photos[0]
    }
})
onMounted(() => {
    if (props.photos) {
        state.selectedPhoto = props.photos[0]
    }
})

function setSelectedPhoto(photo: PhotoItem) {
    state.selectedPhoto = photo
    //TODO: add transitions when setSelectedPhoto is called https://vuejs.org/guide/built-ins/transition
}

function showImageZoomModal() {
    imageZoomModalRef.value?.toggleDialog()
}

</script>

<style scoped>
.carousel-container {
  width: 50rem;
  height: 50rem;

}
/* .selected-photo {
    height: 60dvh;
    min-width: 50rem;
} */
 /* .display-photo {
  max-width: 70dvh;
  max-height: 70dvh;
 } */
/* img {
    display: block;
    height: 100%;
    width: 100%;
} */

/* figure {
    margin: 0;
}



.photo-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 15dvh;
}

.selected-image {
    grid-row: 1 / 5;
    grid-column: 1 / 4;
    order: 1;

    img {
        height: 100%;
        object-fit: cover;
        border-radius: 1rem;
    }
}

.photo-list-item {
    grid-row: span 1 / auto;
    grid-column: span 1 / auto;

    img {
        object-fit: cover;
        border-radius: 1rem;
    }
} */

@media (min-width: 60rem) {
  .carousel-container {
    width: 90%; 
    margin-left: auto;
    margin-right: 5rem;
  }
    .photo-grid {
        grid-template-columns: 2fr 5fr;
        grid-auto-rows: 28dvh;
    }

    .selected-image {
        grid-row: 1 / 4;
        grid-column: 2 / auto;

        img {
            object-fit: contain;
        }
    }
}
</style>