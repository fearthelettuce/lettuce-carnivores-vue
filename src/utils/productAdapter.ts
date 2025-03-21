import type { Plant, PlantCategory} from '@/types/Plant'
import type { Product, ProductCategory, PlantCategory as NewPlantCategory, Plant as NewPlant } from '@/types/Product'

export function plantToProduct(plant: Plant, plantCategory: PlantCategory) {
  const product = {
    sku: plant.sku,
    quantity: plant.quantity,
    productCategoryId: plantCategory.id,
    size: plant.size,
    price: plant.price,
    status: getProductStatus(plant.status),
    photos: plantCategory.photos,
    isDiscountable: null,
    createdDate: plant.dateListedForSale || new Date(),
    updatedDate: new Date(),
  } as Product

  const productCategory = {
    id: plantCategory.id,
    category: 'plant',
    subCategory: 'Carnivorous Plants',
    name: plantCategory.name,
    status: getCategoryStatus(plantCategory.status),
    photos: plantCategory.photos,
    isDiscountable: null,
    tags: [],
    createdDate: getOldestDate(plantCategory),
    dateUpdated: new Date(),
    description: plantCategory.description,
  } as ProductCategory

  const newPlantCategory = {
    ...productCategory,
    type: 'plant',
    speciesHybrid: plantCategory.speciesHybrid,
    source: null,
    genus: plantCategory.genus,
    clone: plantCategory.clone,
  } as NewPlantCategory

  const newPlant = {
    ...product,
    additionalInformation: {
      propagationDate: plant.propagationDate,
      shipping: 'Standard',
      ageGroup: 'Adult',
      isSpecimen: false,
    }
  } as NewPlant

  return {
    product,
    productCategory,
    plantCategory: newPlantCategory, 
    plant: newPlant
  }
  
}

function getOldestDate(plantCategory: PlantCategory) {
  return plantCategory.plants.reduce((oldestDate, plant) => {
    if(!plant.dateListedForSale) return oldestDate;
    const date = new Date(plant.dateListedForSale)
    return oldestDate < date ? oldestDate : date
  }, new Date())
}

function getCategoryStatus(status: PlantCategory['status']) {
  const statusMap = new Map([
    ['In Stock', 'active'],
    ['Coming Soon', 'inactive'],
    ['Archived', 'archived'],
    ['Hidden', 'hidden'],
    ['Sold', 'inactive'],
    ['Delete', 'archived'],
  ])
  return statusMap.get(status)
}

function getProductStatus(status: Plant['status']) {
  const statusMap = new Map([
    ['In Stock', 'active'],
    ['Coming Soon', 'inactive'],
    ['Archived', 'archived'],
    ['Hidden', 'hidden'],
    ['Sold', 'sold'],
    ['Delete', 'archived'],
  ])
  return statusMap.get(status)
}
