import type { Plant, PlantCategory, Sizes } from '@/types/Plant'
import type { InventoryItem } from '@/types/ebayApi/restfulTypes'
import { formattedDate } from '@/utils/utils'
type EbayInventoryItem = {
    product: {},
    condition: string,
    packageWeightAndSize: PackageWeightAndSize,
    availability: EbayAvailability
}

type EbayAvailability = {
    shipToLocationAvailability: {
        quantity: number
    }
}
type PackageWeightAndSize = {
    dimensions: BoxDimensions,
    packageType: 'MAILING_BOX',
    weight: {
        value: number,
        unit: 'POUND' | 'OUNCE',
    }
}
type StandardBoxSizes = '7x5x5' | '10x5x5' | '10x8x6' | '14x6x6'
type BoxDimensions = {
    height: number,
    length: number,
    width: number,
    unit: 'INCH' | 'FEET'
}
export function createEbayInventoryItem (plantCategory: PlantCategory, plant: Plant) {

    const InventoryItem: InventoryItem = {
        product: getProductDetails(plantCategory, plant),
        condition: 'NEW',
        packageWeightAndSize: getShippingSize(plant.size),
        availability: {
            shipToLocationAvailability: {
                quantity: 1
            }
        }
    }

}

function getProductDetails(plantCategory: PlantCategory, plant: Plant) {
    return {
        title: `${plantCategory.name} - ${plant.size}`,
        description: createDescription(),
        imageUrls: getImageUrls()
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
        const images: string[] = []
        plant.photos.forEach((photo) => {
            console.log(photo.path)
        })
    }

    aspects?: string;
    mpn?: string;
    upc?: (string)[];
}
function getShippingSize(size: Sizes): PackageWeightAndSize {
    let box: StandardBoxSizes | undefined = undefined
    let weight: number | undefined = undefined

    switch (size) {
        case '2.5"':
            box = '7x5x5'
            weight = 1
            break
        case '3" deep':
            box = '7x5x5'
            weight = 1
            break
        case '3.5"':
            box = '7x5x5'
            weight = 1
            break
        case '3.5" deep':
            box = '10x5x5'
            weight = 1.5
            break
        case '4" deep':
            box = '10x8x6'
            weight = 1.75
            break
        case '4.5" deep':
            box = '10x8x6'
            weight = 2
            break
        case '5" deep':
            box = '14x6x6'
            weight = 2
            break
        case 'Bare Root':
            box = '10x8x6'
            weight = 1
            break
        default:
            box = '10x8x6'
            weight = 1.5
    }
    if(box === undefined || weight === undefined) {
        box = '10x8x6'
        weight = 1.5
    }
    const boxSizeMap = buildBoxSizeMap()
    return {
        dimensions: boxSizeMap.get(box) || boxSizeMap.get('10x8x6')!,
        packageType: 'MAILING_BOX',
        weight: {
            value: weight,
            unit: 'POUND',
        }
    }
}

function buildBoxSizeMap () {
    const boxSizeMap: Map<StandardBoxSizes, BoxDimensions> = new Map()
    boxSizeMap.set('7x5x5', {
        height: 7,
        length: 5,
        width: 5,
        unit: 'INCH'
    })
    boxSizeMap.set('10x5x5', {
        height: 10,
        length: 5,
        width: 5,
        unit: 'INCH'
    })
    boxSizeMap.set('10x8x6', {
        height: 10,
        length: 8,
        width: 6,
        unit: 'INCH'
    })
    boxSizeMap.set('14x6x6', {
        height: 14,
        length: 6,
        width: 6,
        unit: 'INCH'
    })
    return boxSizeMap
}
