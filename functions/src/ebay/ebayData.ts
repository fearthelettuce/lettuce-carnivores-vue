import type { GranularityLevel } from '../types/Ebay'
import axios from 'axios'
import admin from 'firebase-admin'
export async function getListingsLast120Days(token: string, granularityLevel: GranularityLevel = 'Medium', daysAgo: number = 120) {
    //ISO-8601
    if(daysAgo > 121) { return {error: true, success: false, message: 'Cannot query more than 121 days'}}
    const now = new Date()
    const startDate = new Date(new Date().setDate(now.getDate() - daysAgo));

    const granularity = granularityLevel
    const query = `
        <?xml version="1.0" encoding="utf-8"?>
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
        </GetSellerListRequest>
    `
    const headers = {
        'X-EBAY-API-SITEID' :'0',
        'X-EBAY-API-COMPATIBILITY-LEVEL' :'967',
        'X-EBAY-API-CALL-NAME' :'GetSellerList',
        'X-EBAY-API-IAF-TOKEN' : token
    }

}
