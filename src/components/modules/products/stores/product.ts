import { defineStore } from 'pinia'
// import {toRaw} from 'vue'
import { saveItem, findAll, findByProperty, deleteItem, findDocById } from '@/apis/dataServices'
import type { Plant } from '../types/plants'
import type { Product, ProductFilters } from '../types/product'
import type {PhotoItem} from '@/components/modules/products/types/product'
import { deleteFile } from '@/apis/fileServices'
import { resourceLimits } from 'worker_threads'
const collectionName = 'products'

const newProduct = {
    id: undefined,
    name: '',
    price: undefined,
    isForSale: true,
    quantity: 1,
    isDiscountable: true,
    photos: [] as Array<PhotoItem>,
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
        //need to destructure object so newProduct doesn't retain properties
        productToEdit:  {...newProduct} as Plant | typeof newProduct ,
        genusList: [ 
            { id: 1, label: 'Nepenthes' }, 
            { id: 2, label: 'Heliamphora' }, 
            { id: 3, label: 'Cephalotus' },
            { id: 4, label: 'Pinguicula'},
            { id: 5, label: 'Drosera' }
        ],
        propagationMethodList: ['Stem Cutting', 'Basal Division', 'Division', 'Seed', 'Tissue Culture', 'Other', 'Unknown'],
        sourceList: ['Borneo Exotics', 'Exotica Plants', 'Wistuba', 'Florae', 'Carnivero', 'eBay', 'Facebook', 'Other', 'Unknown'],
        growingConditionsList: ['Highland', 'Intermediate', 'Lowland', 'Temperate'],
        experienceLevelList: ['Beginner', 'Intermediate', 'Expert'],
        classificationList: ['Species', 'Hybrid', 'Registered Cultivar', 'Unregistered Cultivar'],
        sizeList: ['2.5"', '3.5"', '3.5" deep', '4.25" deep', 'Specimen']
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
        getSourceList(): Array<string>{
            return this.sourceList;
        },
        getSizeList(): Array<string>{
            return this.sizeList;
        },
        getPropagationMethodList(): Array<string>{
            return this.propagationMethodList;
        },
        getProductToEdit(): Plant | typeof newProduct {
            return this.productToEdit
        },
    },

    actions: {
        setProductToEdit(product: Plant | null) {
            if(product) {
                this.productToEdit = product
            }
            else { 
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

        async deleteById(id: number) { 
            this.deleteAllPhotos(await this.findProductById(id))
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

            if (product.id) {
                this.saveProduct(product)
            }
        },
        async removePhoto(product: Product | typeof newProduct, photoToRemove: PhotoItem) {
            //BUG: if photo was uploaded without a type, one is assinged, but product.photoData is not updated.
            if(!product || !photoToRemove || !product.photos) return {success: false, error: true, message: 'Unable to find photo or product'}
            const photoIndex = product.photos.findIndex((ele) => ele.path === photoToRemove.path)
            product.photos.splice(photoIndex, 1)
            if(product.id) {
                try {
                    const res = await deleteFile(photoToRemove)
                    this.saveProduct(product)
                    return res
                } catch (err) {
                    return {success: false, error: true, message: 'Something went wrong', errorDetails: err}
                }                
            } else {
                return {success: true, error: false, message: 'Photo removed'}
            }
        },

        async deleteAllPhotos(product: Product) {
            product.photos.forEach(async (photo) => {
                await deleteFile(photo)
            })
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