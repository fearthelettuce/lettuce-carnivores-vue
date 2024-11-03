import type { GranularityLevel } from '../types/Ebay'
import axios, { AxiosResponse } from 'axios'
import qs from 'qs'
import { apiUrl, sandboxApiUrl  } from './ebayConstants'
import type { EbayEnvironment} from '../types/Ebay'
import xml2js from 'xml2js'


export async function getInventoryItems(environment: EbayEnvironment, token: string, sku?: string) {
    const baseUrl = environment === 'SANDBOX' ? sandboxApiUrl: apiUrl
    let url = `${baseUrl}/sell/inventory/v1/inventory_item`
    if(sku && sku.length > 0 && sku !== undefined) {
        url = `${url}/${sku}`
    }

    const config = {
        headers: {
            'Authorization':`Bearer ${token}`,
            'Accept': 'application/json',
        }
    }
    const res = await axios.get(url, config)
    return res.data
}

export async function createOrReplaceInventoryItem(token: string, sku: string, item: any, environment?: EbayEnvironment) {
    const baseUrl = environment === 'SANDBOX' ? sandboxApiUrl : apiUrl
    const config = {
        method: 'put',
        url: `${baseUrl}/sell/inventory/v1/inventory_item/${sku}`,
        headers: {
            'Authorization':`Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Language': 'en-US'
        },
        data: item
    }

    const res = await axios(config).catch((e: any) => {console.error(e); return e})
    if( res && 'status' in res && res.status === 204) {
        return {success: true}
    }
    if(res && 'response' in res && 'data' in res.response) {
        return res.response.data
    }
    if(res && 'response' in res) {
        return res.response
    }
    return res
}

export async function postEbayData(token: string, data: any, environment?: EbayEnvironment) {
    const baseUrl = environment === 'SANDBOX' ? sandboxApiUrl : apiUrl
    //todo: update to take a URL
    const config = {
        method: 'post',
        url: `${baseUrl}/sell/inventory/v1/offer`,
        headers: {
            'Authorization':`Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Language': 'en-US'
        },
        data: data
    }

    const res = await axios(config).catch((e: any) => {console.error(e); return e})
    if( res && 'status' in res && res.status === 201) {
        return {success: true}
    }
    if(res && 'response' in res && 'data' in res.response) {
        return res.response.data
    }
    if(res && 'response' in res) {
        return res.response
    }
    return res
}

export async function deleteInventoryItem(token: string, sku: string, environment?: EbayEnvironment) {
    const baseUrl = environment === 'SANDBOX' ? sandboxApiUrl: apiUrl
    const url = `${baseUrl}/sell/inventory/v1/inventory_item/${sku}`
    const config = {
        headers: {
            'Authorization':`Bearer ${token}`,

        }
    }
    const res = await axios.delete(url, config)
    return res
}


export async function getListingsData(environment: EbayEnvironment, token: string, granularityLevel: GranularityLevel = 'Medium', daysAgo: number = 120) {
    if(daysAgo > 121) { return {error: true, success: false, message: 'Cannot query more than 121 days'}}
    const baseUrl = environment === 'PRODUCTION' ? apiUrl : sandboxApiUrl
    const now = new Date()
    const startDate = new Date(new Date().setDate(now.getDate() - daysAgo));

    const granularity = granularityLevel
    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
        <GetSellerListRequest xmlns="urn:ebay:apis:eBLBaseComponents">
            <ErrorLanguage>en_US</ErrorLanguage>
            <WarningLevel>High</WarningLevel>
            <!--You can use DetailLevel or GranularityLevel in a request, but not both-->
        <GranularityLevel>${granularity}</GranularityLevel>
            <!-- Enter a valid Time range to get the Items listed using this format
                2013-03-21T06:38:48.420Z -->
        <StartTimeFrom>${startDate.toISOString()}</StartTimeFrom>
        <StartTimeTo>${now.toISOString()}</StartTimeTo>
        <IncludeWatchCount>true</IncludeWatchCount>
        <Pagination>
            <EntriesPerPage>200</EntriesPerPage>
        </Pagination>
        </GetSellerListRequest>`
    const config = {
        headers: {
            'Content-Type': 'text/xml',
            'X-EBAY-API-SITEID' :'0',
            'X-EBAY-API-COMPATIBILITY-LEVEL' :'967',
            'X-EBAY-API-CALL-NAME' :'GetSellerList',
            'X-EBAY-API-IAF-TOKEN' : token
        },
    }
    const res = await axios.post(`${baseUrl}/ws/api.dll`, xmlBody, config).catch(e => {return e})
    if(res.status === 200) {
        const parsedResponse = await parseXmlResponse(res)
        return JSON.stringify(parsedResponse)
    }
    return res
}

async function parseXmlResponse(response: AxiosResponse) {
    let parsedData
    const parser = new xml2js.Parser()
    await parser.parseStringPromise(response.data).then((result) => {
        parsedData = result
    }).catch((err) => {
        console.error('Error parsing XML:', err)
        parsedData = undefined
    })
    return parsedData
}

function getBody() {
    return {
        product: {
        title: 'Heliamphora exappendiculata - 3" deep',
        description: 'This listing is for a Heliamphora exappendiculata which was divided on 09/09/24\n' +
            '\n' +
            '\n' +
            '\n' +
            'The plant in the photo is the actual plant for sale.\n' +
            '\n' +
            '<b>Care</b>\n' +
            '\n' +
            'This would be a great plant for someone with experience growing nepenthes, orchids, or similar. Heliamphora grow in similar conditions as intermediate / highland nepenthes. They like bright light, high humidity, low-mineral water, and good airflow.\n' +
            '\n' +
            '\n' +
            '\n' +
            'Shipping\n' +
            '\n' +
            '\n' +
            '        Your plant will be shipped potted with plenty of cushion.\n' +
            '\n' +
            '\n' +
            "        Live arrival is guaranteed.  If you experience any issues, please take photos and contact me the day of receipt.  I'm happy to combine shipping.",
        imageUrls: [
            'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/plants%2F1437%201.1%20(2)_1600x1600?alt=media&token=5d430678-cbde-4735-bfc9-a55b229f5a3c',
            'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/plants%2F1437%201.1%20(1)_1600x1600?alt=media&token=dbedae5e-59b7-472b-9ebb-f852dd3c1965',
            'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/plants%2F1437%201.1%20(3)_1600x1600?alt=media&token=66b2ec78-8524-49ad-bcf0-51bda631054f',
            'https://firebasestorage.googleapis.com/v0/b/lettuce-carnivores.appspot.com/o/plants%2F1437%201.1%20(4)_1600x1600?alt=media&token=59c9a66d-2a92-4513-9642-ba057c3cde38'
        ],
        aspects: {
            Climate: [Array],
            'Common Name': [Array],
            'Indoor/Outdoor': [Array],
            'Growth Habit': [Array],
            'California Prop 65 Warning': [Array],
            Brand: [Array],
            Type: [Array],
            'Growth Stage': [Array],
            Watering: [Array],
            Genus: [Array],
            'Number in Pack': [Array],
            Sunlight: [Array],
            Features: [Array]
        }
        },
        condition: 'NEW',
        packageWeightAndSize: {
        dimensions: { height: "7", length: "5", width: "5", unit: 'INCH' },
        packageType: 'MAILING_BOX',
        weight: { value: "1", unit: 'POUND' }
        },
        availability: { shipToLocationAvailability: { quantity: 1 } }
    }
}
