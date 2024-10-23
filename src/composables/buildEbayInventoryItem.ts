import { formattedDate } from '@/utils/utils'
import {getShippingSize } from '@/composables/useShippingUtils'
import type { Plant, PlantCategory } from '@/types/Plant'
import type { InventoryItem } from '@/types/ebayApi/types'
import type { AppError } from '@/types/App'
import type { PhotoItem } from '@/types/Product'
import { getPhotoDownloadUrl } from '@/apis/fileServices'

export async function createEbayInventoryItem (plantCategory: PlantCategory, plant: Plant): InventoryItem | AppError<any> {
    try {
        const inventoryItem: InventoryItem = {
            product: await buildProductDetails(plantCategory, plant),
            condition: 'NEW',
            packageWeightAndSize: getShippingSize(plant.size),
            availability: {
                shipToLocationAvailability: {
                    quantity: 1
                }
            }
        }
        return inventoryItem
    }
    catch (e: any) {
        console.error(e)
        return {success: false, errorMessage: 'Unable to create inventory item', errorDetails: e }
    }

}

async function buildProductDetails(plantCategory: PlantCategory, plant: Plant): InventoryItem['product'] {
    const photoUrls = await getImageUrls(plant.photos)
    return {
        title: `${plantCategory.name} - ${plant.size}`,
        description: createDescription(),
        imageUrls: photoUrls,
        aspects: buildAspects(plantCategory, plant) as any //ts-any: Ebay OpenApi 3 JSON currently (10/20/24) defines aspects as string, which is wrongo dongo.
                                                           // https://github.com/hendt/ebay-api/issues/181
    }

    function createDescription() {
        let text = ''
        text = `This listing is for a ${plantCategory.name}`
        if(plant.propagationDate) {
            text = text + ` which was divided on ${formattedDate(plant.propagationDate,'mm/dd/yy')}\n\n`
        }
        text = text + '\n\n'
        text = text + 'The plant in the photo is the actual plant for sale.\n\n'
        text = text + `<b>Care</b>\n\nThis would be a great plant for someone with experience growing nepenthes, orchids, or similar. Heliamphora grow in similar conditions as intermediate / highland nepenthes. They like bright light, high humidity, low-mineral water, and good airflow.\n\n`
        text = text + '\n\n'
        text = text + `Shipping\n\n
        Your plant will be shipped potted with plenty of cushion.\n\n
        Live arrival is guaranteed.  If you experience any issues, please take photos and contact me the day of receipt.  I'm happy to combine shipping.`
        return text
    }

    async function getImageUrls(photos: PhotoItem[]) {
        let photoUrls = []
        if(photos.length > 0) {
            for(let photo of photos) {
                const url = await getPhotoDownloadUrl(photo)
                if(url) { photoUrls.push(url) }
            }
        }
        return photoUrls
    }
}

function buildAspects(plantCategory: PlantCategory, plant: Plant) {
    const aspects: {[key: string]: string[]} = {
        "Climate": ["Highland"],
        "Common Name": ["Pitcher Plant"],
        "Indoor/Outdoor": ["Indoor"],
        "Growth Habit": ["Clumping"],
        "California Prop 65 Warning": ["I don't have cancer yet, if that tells you anything"],
        "Brand": ["Danger Lettuce Carnivores"],
        "Type": ["Carnivorous Plants"],
        "Growth Stage": ["Mature"],
        "Watering": ["Heavy"],
        "Genus": [plantCategory.genus],
        "Number in Pack": ["1"],
        "Sunlight": [plantCategory.genus === 'Heliamphora' ? "Medium Sun" : ''],
    }
    if(plant.size !== 'Bare Root') {
        aspects["Features"] = ['Potted']
    }
    return aspects
}
