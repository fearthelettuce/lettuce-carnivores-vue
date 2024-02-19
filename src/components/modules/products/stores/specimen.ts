import { defineStore } from 'pinia'
import { saveItem, findAll, findByProperty, deleteItem, findDocById } from '@/apis/dataServices'
import type { Specimen } from '../types/plants'
import type {PhotoItem} from '@/components/modules/products/types/product'

const collectionName = 'specimens'

const newSpecimen = {
    id: undefined,
    productId: undefined,
    size: '',
    propagationMethod: '',
    propagationDate: new Date().toLocaleDateString('en-us'),
    isForSale: false,
    quantity: 1,
    photos: [] as Array<PhotoItem>,
}

export const useSpecimenStore = defineStore('specimen', () => {

    const specimenList = [] as Array<Specimen>;
    const filteredSpecimenList = [] as Array<Specimen>;
    let specimenToEdit = {...newSpecimen} as Specimen | typeof newSpecimen;
    const sizeList = ['2.5"', '3.5"', '3.5" deep', '4.25" deep', 'Specimen'];
    function getSpecimenById () {
        if(specimenList) {
            return (id: number) => specimenList.find(specimen => specimen.id == id)
        }
    }
    function setSpecimenToEdit(specimen: Specimen | null) {
        if(specimen) {
            specimenToEdit = specimen
        } else {
            specimenToEdit = {...newSpecimen}
        }
    }

    async function findSpecimenById(id: number) {
        try {
            const res = await findDocById(collectionName, id).catch(err => console.log(err))
            return res as Specimen
        } catch (err) {
            return {success: false, error: true, message: 'Unable to find specimen', errorDetails: err}
        }
    }
    async function findAllSpecimensByProductId(productId: number) {
        try {
            return await findByProperty('products', 'id', productId)
        } catch (err) {
            return {success: false, error: true, message: 'Error finding specimens', errorDetails: err}
        }
        }
    async function findAllSpecimens() {
        const res = await findAll(collectionName) as Array<Specimen>
        return res
    }
    async function saveSpecimen(specimen: Specimen) {
        const res = await saveItem(collectionName, specimen)
        return res
    }

    async function appendPhotoData(specimen: Specimen | typeof newSpecimen, photoArr: Array<PhotoItem>) {
        if(!specimen || !photoArr) return
        if(specimen.photos) {
            specimen.photos = specimen.photos.concat(photoArr)
        } else {
            specimen.photos = photoArr
        }

        if (specimen.id) {
            saveSpecimen(specimen)
        }
    }

    return {specimenList, filteredSpecimenList, specimenToEdit, sizeList, getSpecimenById, setSpecimenToEdit, findSpecimenById, 
        findAllSpecimensByProductId, findAllSpecimens, saveSpecimen, appendPhotoData}
})