<template>
    <div class="filter-container">
        <div v-if="!isHidden" class="filter-item-container">
            <MultiSelect 
                v-model="productFilters.status.items" 
                display="chip"
                :options="statusList.filter(item => !item.hidden)"
                optionLabel="label"
                placeholder="Status"
                :showToggleAll="false"
                class="filter-item" 
            />

            <MultiSelect 
                v-model="productFilters.genus.items" 
                display="chip"
                :options="genusList"
                :showToggleAll="false"
                placeholder="Genus"
                class="filter-item" 
            />

            <MultiSelect 
                v-model="productFilters.experience.items" 
                display="chip"
                :options="displayExperienceList"
                :showToggleAll="false"
                placeholder="Experience"
                class="filter-item" 
            />

            <MultiSelect 
                v-model="productFilters.other.items" 
                display="chip"
                optionLabel="label"
                :options="otherFiltersList"
                filter
                placeholder="Other filters"
                 
            />

            <!-- <Select 
                v-model="sortMethod"
                :options="defaultSort"
                optionLabel="label"
                placeholder="Sort"
                class="filter-item" 
             /> -->
        </div>

        <div class="mt-3">
            <button class="btn btn-outline-primary btn-sm" @click="isHidden = !isHidden">{{`${isHidden ? 'Show' : 'Hide'} Filters`}}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { defaultSort, genusList, statusList, experienceList, otherFiltersList} from '@/constants/constants'
import { usePlantStore } from '../stores/plant';
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select';
import { storeToRefs } from 'pinia'

//TODO: make this responsive
const isHidden = ref(false)
const selectedGenus = ref()
const selectedOtherFilters = ref()
const {productFilters} = storeToRefs(usePlantStore())
const sortMethod = ref({...defaultSort})
const displayExperienceList = experienceList.filter(item => item !== '')
onMounted(() => {
    productFilters.value.status.items = productFilters.value.status.items.filter(item => !item.hidden)
    setFilterToggle()
})

function setFilterToggle() {
const screenWidth = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
  if(screenWidth < 1350) {
    isHidden.value = true;
  }
}

</script>

<style scoped>
.filter-container {
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items: center;

}
.filter-item-container {
    display: flex;
    flex-direction: column;
    justify-content:space-evenly;
    gap: .5rem;
    flex-wrap: wrap;
}

.filter-item {
    max-width: 90dvw;
}

@media(min-width: 45rem) {
    .filter-container {
        margin: 0 7dvw;
    }
    .filter-item-container { 
        gap: 1rem;
        flex-direction: row;
    }
    

}

</style>