export interface Response<T> {
    data: T,
    error: any,
    status: number
}