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
                :options="experienceList"
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
                class="filter-item" 
            />

            <!-- <Select 
                v-model="sortMethod"
                :options="defaultSort"
                optionLabel="label"
                placeholder="Sort"
                class="filter-item" 
             /> -->
             <button v-if="!isHidden" class="btn btn-sm-primary" @click="isHidden = !isHidden">Collapse Filters</button>
        </div>
        <div v-else>
            <button v-if="isHidden" class="btn btn-sm-primary" @click="isHidden = !isHidden">Expand Filters</button>
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

onMounted(() => {
    productFilters.value.status.items = productFilters.value.status.items.filter(item => !item.hidden)
})

function updateFilters() {

}

//Size - 2.5, 3.0, 3.5, 3.5d, etc.

//Sort:
//Popular?
//Size Big - Small Small - Big

// import { reactive } from 'vue';
// import { useProductStore } from '../stores/product'

// const productStore = useProductStore()
// const filters = reactive({
//     genus: []
// })


//Design:
// Product Store
// Set fitler - takes in a filter type and filter criteria
// loop through products and apply filter
// Need an array/obj of filters and criteria

</script>

<style scoped>
.filter-container {
    display: flex;
    flex-direction: row;
    justify-content:center;

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