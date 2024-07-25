import type { PlantCategory, Plant, Sizes } from "@/types/Plant"
import type { PhotoItem } from "@/types/Product"

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

export const statusListArr = ['', 'In Stock', 'Coming Soon', 'Archived', 'Hidden', 'Sold']
export const experienceList = ['', 'Beginner Friendly', 'Intermediate', 'Advanced']
export const speciesHybridArr = ['', 'Species', 'Hybrid']
export const otherFiltersList = [
    {label: 'Species', value: 'Species', hidden: false},
    {label: 'Hybrid', value: 'Hybrid', hidden: false},
    {label: 'Specimen', value: 'Specimen', hidden: false},
    {label: 'Representative', value: 'Representative', hidden: false},
    {label: 'Only Sale Items', value: 'Only Sale Items', hidden: false},
]
export const statusList = [
    {label:'', value: false, hidden: true}, 
    {label:'In Stock', value: 'In Stock', hidden: false}, 
    {label:'Coming Soon', value: false, hidden: false},
    {label:'Archived', value: false, hidden: true}, 
    {label:'Hidden', value: false, hidden: true},
    {label:'Sold', value: false, hidden: true}
]
export const defaultFilters = {
    genus: {
        label: 'Genus',
        filterKey: 'genus',
        items: genusList
    },
    status: {
        label: 'Availability',
        filterKey: 'status',
        items: [
            {label:'In Stock', value: 'In Stock', hidden: false}, 
        ]
    },
    experience: {
        label: 'Experience',
        items: experienceList.filter(item => item !== '')
    },
    other: {
        label: 'Other Filters',
        items: [
            {label: 'Species', value: 'Species', hidden: false},
            {label: 'Hybrid', value: 'Hybrid', hidden: false},
            {label: 'Specimen', value: 'Specimen', hidden: false},
            {label: 'Representative', value: 'Representative', hidden: false},
        ]
    },



}

export const sortOptions = []
export const defaultSort = [
    {
        label: 'A - Z', 
        value: 'asc',
        sortFunction: (arr: Object[], value: String) => {
            return arr.sort()
        }
    },
    {
        label: 'Z - A', 
        value: 'asc',
        sortFunction: (arr: Object[], value: String) => {
            return arr.sort()
        }
    },
    {
        label: '$ - $$$',
        value: 'asc',
        sortFunction: (arr: Object[], value: String) => {
            return arr.sort()
        }
    },
    {
        label: '$$$ - $',
        value: 'asc',
        sortFunction: (arr: Object[], value: String) => {
            return arr.sort()
        }
    },

]



export const newPlantCategory: PlantCategory = {
    id: '',
    name: '',
    genus: '',
    clone: '',
    speciesHybrid: '',
    experience: '',
    description: '',
    plants: [] as Plant[],
    status: 'In Stock',
    photos: [] as PhotoItem[]
}

export const newPlant: Plant = {
    id: '',
    sku: '',
    isRepresentative: false,
    size: '',
    propagationDate: new Date().toString(),
    status: 'In Stock',
    price: 0,
    discountedPrice: 0,
    isDiscounted: false,
    quantity: 1,
    photos: [],
    plantCategoryId: '',
}