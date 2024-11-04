import { CallableRequest } from 'firebase-functions/v2/https'
import type { FunctionResponse } from './Functions'
export interface EbayAccessTokenRequest extends CallableRequest {
    data: {
        environment: EbayEnvironment,
        authCode?: string,
    }
}

export interface EbayDataRequest extends CallableRequest {
    data: {
        environment: EbayEnvironment,
    }
}
export type EbaySkuRequest = EbayDataRequest & {
    data: {
        sku: string
    }
}
export type EbayInventoryRequest = EbayDataRequest & {
    data: {
        sku?: string
    }
}
export type EbayInventoryPostRequest = EbayDataRequest & {
    data: {
        sku: string,
        item: any
    }
}
export type EbayOfferPostRequest = EbayDataRequest & {
    data: {
        environment: EbayEnvironment,
        data: {sku: string}
    }
}

export type EbayListingRequest = EbayDataRequest & {
    data: {
        granularityLevel?: GranularityLevel,
        daysAgo?: number
    }
}
export interface EbayAccessTokenResponse {
    access_token: string,
    expires_in: number,
    token_type: string
}

export interface UserAccessTokenResponse extends EbayAccessTokenFunctionResponse {
    refresh_token: string,
    refresh_token_expires_in: number,
}

export interface EbayAccessTokenFunctionResponse extends FunctionResponse {
    data: EbayAccessTokenResponse
}

export type EbayEnvironment = 'SANDBOX' | 'PRODUCTION'

export type GranularityLevel = 'Coarse' | 'Medium' | 'Fine'
