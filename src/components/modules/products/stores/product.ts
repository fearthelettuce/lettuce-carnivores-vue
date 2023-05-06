import { defineStore } from 'pinia'
import { saveItem, findAll, findByProperty, deleteItem, findDocById } from '@/apis/dataServices'
import type { Plant } from '../types/plants'
const collectionName = 'products'
export const useProductStore = defineStore('product', {
    state: () => {
        return {
            productList: undefined as Array<Plant> | undefined,
            filteredProductList: undefined as Array<Plant> | undefined,
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
        getFilteredProducts(state) {
            return this.filteredProductList
        },
        getSearchFilters(state) {
            return this.searchFilters
        }
    },
    actions: {
        async fetchSearchResults() {
            this.isLoading = true
            this.findAllProducts()
            this.isLoading = false
        },

        async findProduct(property: any, value: any) {
            const products = await findByProperty(collectionName, property, value)
            console.log(products)
            return products
        },

        async findProductById(id: number) {
            const res = await findDocById(collectionName, id)
            return res
        },

        async findAllProducts() {
            this.productList = await findAll(collectionName) as Array<Plant>
        },

        async saveProduct(product: Plant) {
            try {
                const res = await saveItem(collectionName, product)
                const productDetails =JSON.parse(JSON.stringify( res.documentDetails))
                const productIndex = this.productList?.findIndex(item => item.id === productDetails.id)
                if (this.productList && productIndex && productIndex > -1) {
                    this.productList[productIndex] = productDetails
                } else {
                    this.productList?.push(productDetails)
                }
                return { success: true, message: res.message }
            } catch (err) {
                console.log(err)
                return {success: false, error: true, errorDetails: err, errorMessage: 'There was an error saving'}
            }
        },

        async deleteById(id: number | string) {
            await deleteItem(collectionName, id).then((res) => {
                const productIndex = this.productList?.findIndex(item => item.id === id)
                if (this.productList && productIndex && productIndex > -1) {
                    this.productList?.splice(productIndex, 1)
                }
                return {deleted: true, response: res}
            }).catch((err) => {
                return { error: true, response: err }
            })
        }
    }
})