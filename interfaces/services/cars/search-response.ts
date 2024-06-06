export interface CarsSearchResponse {
    Token: string
    ActualPage: number
    Id: number
    PageSize: number
    TotalServices: number
    Features: CarFeature[]
    Services: CarService[]
  }
  
  export interface CarFeature {
    GroupName: string
    FeatureInput: number
    Features: Feature[]
    MinValue: number
    MaxValue: number
  }
  
  export interface Feature {
    Key: string
    Value: string
    Count: number
    Checked: boolean
  }
  
  export interface CarService {
    PickUpOfficeName: string
    ReturnOfficeName: string
    Car: Car
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
  }
  
  export interface Car {
    VehicleDetail: VehicleDetail
    Coverage: any[]
    RateDefaultName: string
    RatePriority: number
    RateRecommended: boolean
    ProviderRef: ProviderRef
  }
  
  export interface VehicleDetail {
    VehicleCode: string
    VehicleName: string
    HasAirCondition: boolean
    TransmissionType: string
    DoorCount: number
    PictureVehicleUrl: string
    GroupValue: string
    GroupType?: string
    GroupCode: string
    Type?: string
    BagBigCount: number
    BagSmallCount: number
    HasAirBag: boolean
    HasPowerSteering: boolean
    PeopleBigExtended: number
    KmPerLitro: number
    HasPowerWindow: boolean
    HasPowerLock: boolean
    HasCruisControl: boolean
    AdultsCount: number
    ChildCount: number
    Fuel: string
    Category?: string
    PictureUrl: string
    AudioDescription?: string
  }
  
  
  
  
  export interface ProviderRef {
    Key: string
    Value: string
  }
  