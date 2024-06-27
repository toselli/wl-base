export interface ListResponse {
    Token: string
    ActualPage: number
    Id: number
    PageSize: number
    TotalServices: number
    Features: Feature[]
    Services: SightseeingService[]
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
  
  export interface SightseeingService {
    ProductCode: String
    Title: string
    Description: string
    Rating: number
    Duration: number
    ThumbUrl: string
    CancelationPoliciesDescription: Policy[]
    ProviderRef: string
    Amount: number
    TicketType: number
    Taxes: number
    Currency: string
    NonRefundable: boolean
    Recommended: boolean
  }
  
  export interface Policy {
    Key: string
    Value: string
  }
  