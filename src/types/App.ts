export interface Response<T> {
    success: boolean,
    message?: string,
    data?: T,
}

export interface ResponseWithData<T> extends Omit<Response<T>, 'data'> {
    data: T
}

export interface ResponseError<T, E> extends Response<T> {
    errorMessage: string
    errorDetails?: E,
}
