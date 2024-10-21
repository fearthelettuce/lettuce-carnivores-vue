import { formattedDate } from '@/utils/utils'
import {getShippingSize } from '@/composables/useShippingUtils'
import type { Plant, PlantCategory } from '@/types/Plant'
import type { InventoryItem } from '@/types/ebayApi/types'
import type { AppError } from '@/types/App'

export function createEbayInventoryItem (plantCategory: PlantCategory, plant: Plant): InventoryItem | AppError<any> {
    try {
        const inventoryItem: InventoryItem = {
            product: buildProductDetails(plantCategory, plant),
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

function buildProductDetails(plantCategory: PlantCategory, plant: Plant): InventoryItem['product'] {
    return {
        title: `${plantCategory.name} - ${plant.size}`,
        description: createDescription(),
        imageUrls: getImageUrls(),
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

    function getImageUrls() {
        const mockImages = [
            'https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/gMQAAOSwirhm5eza/$_57.JPG?set_id=880000500F',
            'https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/~H4AAOSwNqBm5eza/$_57.JPG?set_id=880000500F',
            'https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/xrMAAOSwhbFm5eza/$_57.JPG?set_id=880000500F',
            'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/plants%2F1432%20(3)_1600x1600?alt=media&token=ece9928d-d9c1-4f30-9312-9330b6561760'

        ]
        console.error('using mock images')
        const images: string[] = mockImages
        plant.photos.forEach((photo) => {
            console.log(photo.path)
        })


        return images
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
