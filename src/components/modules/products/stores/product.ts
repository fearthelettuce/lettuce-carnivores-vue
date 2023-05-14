import { defineStore } from 'pinia'
import {toRaw} from 'vue'
import { saveItem, findAll, findByProperty, deleteItem, findDocById } from '@/apis/dataServices'
import type { Plant } from '../types/plants'
import type { ProductFilters } from '../types/product'
const collectionName = 'products'
export const useProductStore = defineStore('product', {
    state: () => {
        return {
            productList: undefined as Array<Plant> | undefined,
            filteredProductList: undefined as Array<Plant> | undefined,
            searchFilters: {} as ProductFilters,
            isLoading: false,
            genusList: [ 
                { id: 1, label: 'Nepenthes' }, 
                { id: 2, label: 'Heliamphora' }, 
                { id:3, label: 'Cephalotus' }
            ],
            photoTypes: [
                { id: 1, label: 'Primary' },
                { id: 2, label: 'Card' },
                { id: 3, label: 'Additional'},
                { id: 4, label: 'Upper' },
                { id: 5, label: 'Lower' }
            ],
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
        },
        getGenusList(state) {
            return this.genusList
        }
    },
    actions: {
        async fetchSearchResults() {
            this.isLoading = true
            await this.findAllProducts()
            await this.filterProducts()
            this.isLoading = false
        },

        setFilterCriteria(key: string, value: any) {
            console.log(key)
            console.log(value)
            if (this.searchFilters.hasOwnProperty(key)) {
               (this.searchFilters as any)[key] = [value] 
            } else {
                this.searchFilters[key] = value
            }
            this.filterProducts()
            console.log(this.filteredProductList)
        },

        filterProducts() {
            let filteredProductsArr = this.productList
            //let filteredProductsArr = toRaw(this.productList)
            if (this.searchFilters && Object.keys(this.searchFilters).length > 0) {
                for (const [key, value] of Object.entries(this.searchFilters)) {
                    filteredProductsArr = filteredProductsArr?.filter((item: any) => { return item[key] === value })
                }
            } else {
                filteredProductsArr = this.productList
            }
            this.filteredProductList = filteredProductsArr
        },

        async findProduct(property: any, value: any) {
            const products = await findByProperty(collectionName, property, value)
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
                //TODO convert to toRaw
                const productDetails =JSON.parse(JSON.stringify( res.documentDetails))
                const productIndex = this.productList?.findIndex(item => item.id === productDetails.id)
                if (this.productList && productIndex && productIndex > -1) {
                    this.productList[productIndex] = productDetails
                } else {
                    this.productList?.push(productDetails)
                }
                if (this.searchFilters) {
                    this.filterProducts()
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
        },

        async updatePhotoData(productId: number, photoData: object) {
            if (productId && photoData) {
                const product = await this.findProductById(productId).catch((err) => { console.log(err) })
                if (product) {
                    product.photoData = photoData
                    console.log(product)
                    this.saveProduct(product)
                }
            }
        },

        getPhotoUrl(fileName: string) {
            const urlRoot = 'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/'
            const encodedFileName = encodeURIComponent(fileName)
            const urlSuffix = '?alt=media'
            return `${urlRoot}${encodedFileName}${urlSuffix}`
        }
    }

    
})