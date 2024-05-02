export interface AssistanceSearchResponse  {
    ProductName: string
    ProductSingleName: string
    Attributes: Attribute[]
    IsAgreementRate: boolean
    Total: number
    Amount: number
    Taxes: number
    Currency: string
    ProviderRef: ProviderRef
    Id: string
    ShowVoucher: boolean
    Rating: number
    ShowCuil: boolean
    ShowFrequentTraveler: boolean
    ShowEmail: boolean
    ShowPassport: boolean
  }
  
  export interface Attribute {
    Name: string
    VisibleName: string
    Unit: string
    Value: string
  }
  
  export interface ProviderRef {
    Key: string
    Value: string
  }
  