import { defineStore } from 'pinia'
import {toRaw} from 'vue'
import { saveItem, findAll, findByProperty, deleteItem, findDocById } from '@/apis/dataServices'
import type { Plant } from '../types/plants'
import type { Product, ProductFilters } from '../types/product'
import type {PhotoItem, PhotoDetails} from '@/components/modules/products/types//product'
const collectionName = 'products'

const newProduct = {
    id: undefined,
    name: '',
    price: 0,
    isForSale: true,
    quantity: 1,
    isDiscountable: true,
    photos: [] as Array<PhotoItem>,
    photoData: {} as PhotoDetails,
    genus: null,
    clone: '',
    propagationMethod: '',
    source: '',
}

export const useProductStore = defineStore('product', {
    state: () => ({
        productList: undefined as Array<Plant> | undefined,
        filteredProductList: undefined as Array<Plant> | undefined,
        searchFilters: {} as ProductFilters,
        isLoading: false,
        productToEdit: { ...newProduct } as Plant | typeof newProduct ,
        genusList: [ 
            { id: 1, label: 'Nepenthes' }, 
            { id: 2, label: 'Heliamphora' }, 
            { id: 3, label: 'Cephalotus' }
        ],
        propagationMethodList: ['Stem Cutting', 'Basal Division', 'Division', 'Seed', 'Tissue Culture', 'Other', 'Unknown'],
        sourceList: ['Borneo Exotics', 'Exotica Plants', 'Wistuba', 'eBay/Facebook', 'Other', 'Unknown'],
        growingConditionsList: ['Highland', 'Intermediate'],
        experienceLevelList: ['Beginner', 'Intermediate', 'Expert'],
        classificationList: ['Species', 'Hybrid', 'Registered Cultivar', 'Unregistered Cultivar'],
    }),
    getters: {
        getProductById: (state) => {
            if (state.productList) {
                return (id: number) => state.productList?.find(product => product.id == id)
            }
        },
        getProductList(state): Array<Plant> | undefined {
            return state.productList
        },
        getFilteredProducts(state): Array<Plant> | undefined {
            return state.filteredProductList
        },
        getSearchFilters(state): ProductFilters {
            return state.searchFilters
        },
        getGenusList(state): Array<object>{
            return state.genusList
        },
        getProductToEdit(state): Plant | typeof newProduct {
            return state.productToEdit
        },
    },

    actions: {
        setProductToEdit(product: Plant | null) {
            if(product) {
                this.productToEdit = product
            }
            else { this.productToEdit = newProduct }
        },

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
            const res = await findDocById(collectionName, id).catch(err => console.log(err))
            return res
        },

        async findAllProducts() {
            this.productList = await findAll(collectionName) as Array<Plant>
        },

        async saveProduct(product: Product | Plant) {
            console.log(product)
            try {
                const res = await saveItem(collectionName, product)
                //TODO convert to toRaw
                if(res.success) {
                    const productDetails = JSON.parse(JSON.stringify( res.documentDetails))
                    const productIndex = this.productList?.findIndex(item => item.id === productDetails.id)
                    if (this.productList && productIndex && productIndex > -1) {
                        this.productList.splice(productIndex, 1, productDetails)
                    } else {
                        console.log(this.productList)
                        console.log(this.productToEdit)
                        this.productList?.push(productDetails)
                        console.log(this.productList)
                         console.log(this.productToEdit)
                    }
                    if (this.searchFilters) {
                        this.filterProducts()
                    }
                    return { success: true, message: res.message }
                } else {
                    console.log(res)
                    return {success: false, error: true, errorDetails: res.error, message: 'There was an error saving'}
                }
            } catch (err) {
                console.log(err)
                return {success: false, error: true, errorDetails: err, message: 'There was an error saving'}
            }
        },

        async deleteById(id: number | string) {
            const res = await deleteItem(collectionName, id).catch(err => {
                console.log(err)
                return { success: false, error: true, response: err, message: 'Unable to delete' }
            })
            if(res.error) {
                return { success: false, error: true, response: res.error, message: 'Unable to delete' }
            }
            const productIndex = this.productList?.findIndex(item => item.id === id)
            if (this.productList && productIndex && productIndex > -1) {
                this.productList?.splice(productIndex, 1)
            }
            if (this.productToEdit.id === id) {
                this.setProductToEdit(null)
            }
            return { success: true, error: false, response: res, message: '' }
        },

        async updatePhotoData(product: Product | typeof newProduct, photoArr: Array<PhotoItem>) {
            if(!product || !photoArr) {
                return 
            }
            if(product.photos) {
                product.photos = product.photos.concat(photoArr)
            } else {
                product.photos = photoArr
            }
            if(!('photoData' in product)) {
                product['photoData'] = {} as PhotoDetails
            }
            console.log('banana')
            for(let photo of product.photos) {
                console.log(photo.type)
                if(photo.type && photo.type !== 'additional' && product.photoData) {
                    product.photoData[photo.type] = {name: photo.name, fullPath:photo.path}
                }
                console.log(product.photoData)
            }

            if (product.id) {
                this.saveProduct(product)
                this.setProductToEdit(product)
                // const someProduct = await this.findProductById(product.id).catch((err) => { console.log(err)}) as Product
                // if (someProduct) {
                //     this.saveProduct(someProduct)
                // }
            }
        },

        //TODO: Firebase extension storage -resize images

        getPhotoUrl(fileName: string) {
            const urlRoot = 'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/'
            const encodedFileName = encodeURIComponent(fileName)
            const urlSuffix = '?alt=media'
            return `${urlRoot}${encodedFileName}${urlSuffix}`
        },
    }

    
})