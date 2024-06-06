export interface Catalog {
    Id: string
    ExpectedHotels: string[]
    Excluded: any[]
    Included: string[]
    Images: string[]
    ImportantNotes: string[]
    Itinerary: Itinerary[]
    Name: string
    Cities: City2[]
    Categories: Category[]
    MealPlans: any[]
    Durations: Duration[]
    Departures: Departure[]
}

export interface Itinerary {
    Tittle: string
    Description: string
    Cities: City[]
    Index: number
}

export interface City {
    Key: string
    Value: string
    Index: number
    Date: string
    IsStartAvailable: boolean
    IsEndAvailable: boolean
    IsNightlyCity: boolean
}

export interface City2 {
    Key: string
    Value: string
}

export interface Category {
    Key: string
    Value: string
}

export interface Duration {
    Key: string
    Value: string
}

export interface Departure {
    Date: string
    Amount: number
    Availability: number
    Currency: string
    Id: string
}
