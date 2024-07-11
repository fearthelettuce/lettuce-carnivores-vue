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

export const statusList = [
    {label:'', value: ''}, 
    {label:'Available', value: 'Available'}, 
    {label:'Coming Soon', value: 'Coming Soon'},
    {label:'Sold', value: 'Sold'}, 
    {label:'Archived', value: 'Archived'}, 
    {label:'Hidden', value: 'Hidden'}
]

export const defaultFilters = {
    genus: {
        label: 'Genus',
        filterKey: 'genus',
        options: genusList
    },
    status: {
        label: 'Availability',
        filterKey: 'status',
        options: ['In Stock', 'Coming Soon', 'Out of Stock']
    },
    tags: {
        species: {
            label: 'Species',
            value: true,
        },
        hybrid: {
            label: 'Hybrid',
            value: true,
        },
        specimen: {
            label: 'Specimen',
            value: true
        },
        representative: {
            label: 'Representative',
            value: true
        },
        beginner: {
            label: 'Beginner Friendly',
            value: true,
        },
        intermediate: {
            label: 'Intermediate',
            value: true,
        },
        advanced: {
            label: 'Advanced',
            value: true,
        },
        sale: {
            label: 'On Sale',
            value: true,
            hidden: true,
        },
    }
}

export const defaultSort = [
    {
        label: 'Sort: A - Z', 
        value: 'asc',
        sortFunction: (arr: Object[], value: String) => {
            return arr.sort()
        }
    },
    {
        label: 'Sort: Z - A', 
        value: 'asc',
        sortFunction: (arr: Object[], value: String) => {
            return arr.sort()
        }
    },
    {
        label: 'Sort: $ - $$$',
        value: 'asc',
        sortFunction: (arr: Object[], value: String) => {
            return arr.sort()
        }
    },
    {
        label: 'Sort: $$$ - $',
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