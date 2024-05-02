export interface ListResponse {
    Token: string
    ActualPage: number
    Id: number
    PageSize: number
    TotalServices: number
    Features: Feature[]
    Services: CircuitService[]
  }
  
  export interface Feature {
    GroupName: string
    FeatureInput: number
    Features: Feature2[]
    MinValue: number
    MaxValue: number
  }
  
  export interface Feature2 {
    Key: string
    Value: string
    Count: number
    Checked: boolean
  }
  
  export interface CircuitService {
    Cities: City[]
    CatalogId: string
    Thumbnail: string
    FromPrice: number
    Duration: number
    ProviderName: string
    Departures: string
    NightlyCities: string
    Total: number
    Amount: number
    Taxes: number
    Currency: string
    ShowVoucher: boolean
    Name: string
    Rating: number
    ShowCuil: boolean
    ShowFrequentTraveler: boolean
    ShowEmail: boolean
    ShowPassport: boolean
  }
  
  export interface City {
    Key: string
    Value: string
  }
  