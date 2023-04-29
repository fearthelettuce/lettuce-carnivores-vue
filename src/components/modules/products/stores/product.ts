import { defineStore } from 'pinia'
import { getSearchResults } from '@/apis/dataServices'
import type { Plant } from '../types/plants'

export const useProductStore = defineStore('product', {
    state: () => {
        return {
            productList: undefined as Array<Plant> | undefined,
            searchFilters: undefined,
            isLoading: false,
        }
    },
    getters: {
        getProductList(state) {
            return this.productList
        },
        getSearchFilters(state) {
            return this.searchFilters
        }
    },
    actions: {
        fetchSearchResults() {
            this.isLoading = true
            this.productList = getSearchResults()
            this.isLoading = false
        }
    }
})