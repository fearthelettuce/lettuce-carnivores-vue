import { defineStore } from 'pinia'
// import {toRaw} from 'vue'
import { saveItem, findAll, findByProperty, deleteItem, findDocById } from '@/apis/dataServices'
import type { Plant } from '../types/plants'
import type { Product, ProductFilters } from '../types/product'
import type {PhotoItem, PhotoDetails} from '@/components/modules/products/types/product'
const collectionName = 'products'

const newProduct = {
    id: undefined,
    name: '',
    price: undefined,
    isForSale: true,
    quantity: 1,
    isDiscountable: true,
    photos: [] as Array<PhotoItem>,
    photoData: {} as PhotoDetails,
    genus: undefined,
    clone: '',
    propagationMethod: '',
    propagationDate: new Date().toLocaleDateString('en-us'),
    source: '',
    size: '',
    description: '',
}

export const useProductStore = defineStore('product', {
    state: () => ({
        productList: [] as Array<Plant>,
        filteredProductList: [] as Array<Plant>,
        searchFilters: {} as ProductFilters,
        isLoading: false,
        productToEdit:  {...newProduct} as Plant | typeof newProduct ,
        genusList: [ 
            { id: 1, label: 'Nepenthes' }, 
            { id: 2, label: 'Heliamphora' }, 
            { id: 3, label: 'Cephalotus' },
            { id: 4, label: 'Pinguicula'},
            { id: 5, label: 'Drosera' }
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
                return (id: number) => state.productList.find(product => product.id == id)
            }
        },
        getProductList(): Array<Plant> {
            return this.productList
        },
        getFilteredProducts(): Array<Plant> {
            return this.filteredProductList
        },
        getSearchFilters(): ProductFilters {
            return this.searchFilters
        },
        getGenusList(): Array<object>{
            return this.genusList
        },
        getProductToEdit(): Plant | typeof newProduct {
            return this.productToEdit
        },
    },

    actions: {
        setProductToEdit(product: Plant | null) {
            console.log('calling setProductToEdit in store ' + product)
            if(product) {
                this.productToEdit = product
            }
            else { 
                // @ts-expect-error TODO
                for(const [key] of Object.entries(this.productToEdit.photoData)) {
                    if(this.productToEdit.photoData) {
                        this.productToEdit.photoData[key as keyof PhotoDetails] = undefined
                    }
                    
                }
                this.productToEdit = {...newProduct};
            }
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
            if (Object.prototype.hasOwnProperty.call(this.searchFilters, key)) {
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
            return res as Product
        },

        async findAllProducts() {
            this.productList = await findAll(collectionName) as Array<Plant>
        },

        findAllAvailableProducts(): Array<Plant> {
            return this.productList?.filter((product: Plant) => {
                return product.quantity > 0 && product.isForSale
            })
        },

        async saveProduct(product: Product | Plant) {
            try {
                const res = await saveItem(collectionName, product)
                //TODO convert to toRaw
                if(res.success) {
                    const productDetails = JSON.parse(JSON.stringify( res.documentDetails))
                    const productIndex = this.productList?.findIndex(item => item.id === productDetails.id)
                    if (this.productList && productIndex !== null && productIndex !== undefined && productIndex > -1) {
                        this.productList.splice(productIndex, 1, productDetails)
                    } else {
                        this.productList?.push(productDetails)
                    }
                    if (this.searchFilters) {
                        this.filterProducts()
                    }
                    return { success: true, message: res.message }
                } else {
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

        async appendPhotoData(product: Product | typeof newProduct, photoArr: Array<PhotoItem>) {
            if(!product || !photoArr) return
            if(product.photos) {
                product.photos = product.photos.concat(photoArr)
            } else {
                product.photos = photoArr
            }
            if(!('photoData' in product)) {
                product['photoData'] = {} as PhotoDetails
            }
            for(const photo of product.photos) {
                if(photo.type && photo.type !== 'additional' && product.photoData) {
                    product.photoData[photo.type] = {name: photo.name, fullPath:photo.path}
                }
            }

            if (product.id) {
                this.saveProduct(product)
                //this.setProductToEdit(product)
                // const someProduct = await this.findProductById(product.id).catch((err) => { console.log(err)}) as Product
                // if (someProduct) {
                //     this.saveProduct(someProduct)
                // }
            }
        },
        async removePhoto(product: Product | typeof newProduct, photoToRemove: PhotoItem) {
            if(!product || !photoToRemove || !product.photos) return
            const photoIndex = product.photos.findIndex((ele) => ele.path === photoToRemove.path)
            product.photos.splice(photoIndex,1)
            //look through product.photoData to see if photoData.fullPath === photoToRemove.path and delete that item from photoData
            if(product.photoData) {
                for(const [key, value] of Object.entries(product.photoData)) {
                    if(value.fullPath === photoToRemove.path) {
                        product.photoData[key as keyof PhotoDetails] = undefined
                    }
                }
            }
            if (product.id) {
                this.saveProduct(product)
                this.setProductToEdit(product)
            }
            return
            //TODO: delete photo from firestore
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