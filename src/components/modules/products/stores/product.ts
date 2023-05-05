import { defineStore } from 'pinia'
import { saveItem, findAll, findByProperty, deleteItem } from '@/apis/dataServices'
import type { Plant } from '../types/plants'
import mockPlantData from '@/apis/mockPlantData.json' //TODO: Remove when done testing

export const useProductStore = defineStore('product', {
    state: () => {
        return {
            productList: undefined as Array<Plant> | undefined,
            searchFilters: undefined,
            isLoading: false,
            genusList: ['Nepenthes', 'Heliamphora', 'Cephalotus'],
            propagationMethodList: ['Stem Cutting', 'Basal Division', 'Division', 'Seed', 'Tissue Culture', 'Other', 'Unknown'],
            sourceList: ['Borneo Exotics', 'Exotica Plants', 'Wistuba', 'eBay/Facebook', 'Other', 'Unknown'],
            growingConditionsList: ['Highland', 'Intermediate'],
            experienceLevelList: ['Beginner', 'Intermediate', 'Expert'],
            classificationList: ['Species', 'Hybrid', 'Registered Cultivar', 'Unregistered Cultivar'],
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
        async fetchSearchResults() {
            this.isLoading = true
            this.productList = await findAll('products') as Array<Plant>
            this.setupMockData() //TODO: Remove when done testing
            await saveItem('products', {
                "id": 1009,
                "name": "Heliamphora exappendiculata (Apc.) - Ewok",
                "price": 190,
                "genus": "Heliamphora",
                "propagationType": "Division",
                "source": "Wistuba",
                "isForSale": true,
                "quantity": 1
            }).then((data)=>{console.log(data)})
            this.isLoading = false
            console.log(await this.findProduct('genus','asdfNepenthes'))
        },

        async setupMockData() { //TODO: Remove when done testing
            if (this.productList && this.productList.length === 0) {
                for (let item of mockPlantData) {
                    await saveItem('products',item)
                }
            }
        },

        async findProduct(property:any, value:any) {
            return await findByProperty('products',property,value)
        },

        async saveProduct(product: Plant) {
            try {
                const res = await saveItem('products', product)
                console.log(res)
                return {success: true}
            } catch (err) {
                console.log(err)
                return {success: false, error: true, errorDetails: err, errorMessage: 'Unable to save'}
            }
        },

        async deleteById(id: number) {
            await deleteItem('products', id).then((res) => {
                return {deleted: true, response: res}
            }).catch((err) => {
                return { error: true, response: err }
            })
        }
    }
})