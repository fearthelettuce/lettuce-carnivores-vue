import type { GranularityLevel } from '../types/Ebay'
import axios, { AxiosResponse } from 'axios'
import { apiUrl, sandboxApiUrl  } from './ebayConstants'
import type { EbayEnvironment} from '../types/Ebay'
import xml2js from 'xml2js'

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
    console.log(`${baseUrl}/ws/api.dll`)
    const res = await axios.post(`${baseUrl}/ws/api.dll`, xmlBody, config).catch(e => {return e})
    console.log(res.status)
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
        console.log('parsing')
        parsedData = result
    }).catch((err) => {
        console.error('Error parsing XML:', err)
        parsedData = undefined
    })
    return parsedData
}
