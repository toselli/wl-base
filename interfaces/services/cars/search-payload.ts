import { CarFeature } from "./search-response"

export interface CarsSearchPayload {
    Search: CarsSearch
    Paging: Paging
    Sorting: Sorting,
    Features: CarFeature[]
}

export interface CarsSearch {
    PickUpDate: string
    PickUpOffice: CarOffice
    ReturnDate: string
    ReturnOffice?: CarOffice
    Nationality: string
    Residence: string
    Currency: string
    Language: string
    IsOnAirport: boolean
    Token?: string
}

export interface CarOffice {
    SmartSearchEnum: number
    Count?: number
    Longitude?: number
    Latitude?: number
    Id: string
    Name: string
}


export interface Paging {
    Page: number
    PageSize: number
}

export interface Sorting {
    PropertyName: string
    Direction: string
}
