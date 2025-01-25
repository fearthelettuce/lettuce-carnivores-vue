export interface ProductCategory {
    id: string,
    type: 'plant' | 'supplies',
    category: string,
    name: string,
    description: string,
    status: 'active' | 'inactive' | 'archived',
    photos: Array<PhotoItem>,
    isDiscountable?: boolean,
    tags: string[],
    createdDate: Date,
    dateUpdated: Date,
    isBestSeller: boolean,
}
export interface PlantCategory extends ProductCategory {
    type: 'plant',
    speciesHybrid: '' | 'Species' | 'Hybrid',
    source?: string,
    genus: string,
    clone: string,
    

}
export interface Product {
    sku: string,
    quantity: number | null,
    productCategoryId: string | null,
    productCategoryData: ProductCategory | null,
    size: string,
    price: number | null,
    status: string,
    photos: Array<PhotoItem>,
    createdDate: Date,
    updatedDate: Date,
    isDiscountable: boolean,
}

export interface Plant extends Product {
    additionalInformation: {
        propagationDate?: Date | string,
        shipping?: string | null,
        ageGroup: string | null,
        isSpecimen: boolean,
        shelfLocation: string,
    }
}

export type PotSize =
    '' |
    '2.5"' |
    '3" deep' |
    '3.5"' |
    '3.5" deep' |
    '4" deep' |
    '4.5" deep' |
    '5" deep' |
    'Bare Root' |
    'Specimen' |
    'Bundle - 2 sm' |
    'Bundle - 3 sm' |
    'Bundle - 2 lg' |
    'Bundle - 3 lg'
// Product Category:
//   - type: plant, supply
//     - category: Heli, Nep, pots, fertilizer, growingMedia

// Sort
//   - Name(alpha)
//   - Price($ - $$$)(calc - SKUs)
//   - Best Selling
//     - Date Updated(calc - SKUs)

// Filters
//   - By Product Type
//     - Product Type Specific Filters
//       - Plant
//       - Genus
//       - Experience
//       - Age(Fresh division, Recent division, Established divisions, Specimen, Immature)


export type PhotoItem = {
    name: string,
    folder: string,
    originalFilename: string,
    path: string,
    date: Date,
    resolutions: number[],
}

export type ProductFilters = {
    [key: string]: any
}

export type PhotoSizes = 256 | 512 | 960 | 1600
