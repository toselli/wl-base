export interface SightseeingAvailResponse {
    BasketId: string
    OccupancyId: string
    OccupancyName: string
    Rooms: Room[]
  }
  
  export interface Room {
    Price: Price
    Room: string
    ServiceId: string
  }
  
  export interface Price {
    Currency: string
    MarkUp: number
    ExtraMarkUp: number
    DiscountPercent: number
    Discount: number
    Util: number
    ExchangeDate: string
    Cost: Cost
    PVP: Pvp
    Net: Net
    Invoice: Invoice
    RG3819: number
    RG4659: number
    RG4815: number
    RG5272: number
  }
  
  export interface Cost {
    Amount: number
    Taxes: any[]
    Total: number
    Supplements: any[]
    BaseAmount: number
    TaxSummary: number
    SupplementSummary: number
    MandatoryIncludedSupplements: any[]
    IncludedSupplements: any[]
    OptionalSupplements: any[]
    Boards: any[]
    MandatoryAtDestinationSupplements: any[]
  }
  
  export interface Pvp {
    Amount: number
    Taxes: Tax[]
    Total: number
    Supplements: any[]
    BaseAmount: number
    TaxSummary: number
    SupplementSummary: number
    MandatoryIncludedSupplements: any[]
    IncludedSupplements: any[]
    OptionalSupplements: any[]
    Boards: any[]
    MandatoryAtDestinationSupplements: any[]
  }
  
  export interface Tax {
    TaxTypeEnum: number
    TaxTypeName: string
    Amount: number
    IsIncluded: boolean
  }
  
  export interface Net {
    Amount: number
    Taxes: Tax2[]
    Total: number
    Supplements: any[]
    BaseAmount: number
    TaxSummary: number
    SupplementSummary: number
    MandatoryIncludedSupplements: any[]
    IncludedSupplements: any[]
    OptionalSupplements: any[]
    Boards: any[]
    MandatoryAtDestinationSupplements: any[]
  }
  
  export interface Tax2 {
    TaxTypeEnum: number
    TaxTypeName: string
    Amount: number
    IsIncluded: boolean
  }
  
  export interface Invoice {
    Gravado: number
    NoImponible: number
    Exento: number
    IVA: number
  }
  