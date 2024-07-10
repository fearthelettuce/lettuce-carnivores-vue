import type { PlantCategory, Plant, Sizes } from "@/types/Plant"
import type { PhotoItem } from "@/types/Product"

export const defaultFilters = {
    genus: {
        label: 'Genus',
        options: [
            {label: 'Heliamphora', value: true, visible: true,},
            {label: 'Nepenthes', value: true, visible: true,},
            {label: 'Cephalotus', value: true, visible: true,},
            {label: 'Other', value: true, visible: false,},
        ],
    },
    status: {
        label: 'Availability',
        options: [
            {label:'In-Stock',value: true, visible: true,},
            {label: 'Coming Soon', value: false, visible: true,},
            {label: 'Archived', value: false, visible: false,}
        ],
    },
    experienceLevel:{
        label: 'Experience',
        options: [
            {label:'Beginner', value: true, visible: true,},
            {label: 'Intermediate', value: true, visible: true,},
            {label: 'Advanced', value: true, visible: false,}
        ],
    },
    other:{
        label: 'Other FIlters',
        options: [
            {label:'Species', value: true, visible: true,},
            {label: 'Hybrid', value: true, visible: true,},
            {label:'Specimen', value: true, visible: true,},
            {label: 'Represenatative', value: true, visible: true,},
            {label:'On Sale', value: true, visible: false,},
        ],
    },
}

export const sortCategories = [
    {
        label: 'Alphabetical', 
        value: 'asc',
        sortFunction: (arr: Object[], value: String) => {
            return arr.sort()
        }
    },
    {
        label: 'Price',
        value: 'asc',
        sortFunction: (arr: Object[], value: String) => {
            return arr.sort()
        }
    },

]

export const sizeList = [
    {label: '', value: '',},
    {label: '2.5"', value: '2,5"'},
    {label: '3" deep', value: '3" deep'},
    {label: '3.5"', value: '3,5"'},
    {label: '3.5" deep', value:'3.5" deep'},
    {label: '4" deep', value: '4" deep'},
    {label: 'Bare Root', value: 'Bare Root'}
]

export const genusList = ['Heliamphora', 'Nepenthes', 'Cephalotus', 'Other']

export const statusList = [
    {label:'', value: ''}, 
    {label:'Available', value: 'Available'}, 
    {label:'Coming Soon', value: 'Coming Soon'},
    {label:'Sold', value: 'Sold'}, 
    {label:'Archived', value: 'Archived'}, 
    {label:'Hidden', value: 'Hidden'}
]

export const newPlantCategory: PlantCategory = {
    id: '',
    name: '',
    genus: '',
    clone: '',
    description: '',
    plants: [] as Plant[],
    status: 'Available',
    photos: [] as PhotoItem[]
}

export const newPlant: Plant = {
    id: '',
    sku: '',
    isRepresentative: false,
    size: '',
    propagationDate: new Date(),
    status: '',
    price: 0,
    discountedPrice: 0,
    isDiscounted: false,
    quantity: 1,
    photos: [],
}