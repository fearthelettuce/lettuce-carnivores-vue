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