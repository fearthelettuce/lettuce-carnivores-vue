export type FunctionResponse = {
    success: boolean, 
    error: boolean, 
    message: string | null, 
    errorDetails: any | null, 
    data: Object | null,
}