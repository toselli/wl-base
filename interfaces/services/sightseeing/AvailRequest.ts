export interface SightseeingAvailRequest {
    catalogId: string
    occupancies: Occupancy[]
    currency: string
    duration: string
    mealplan: string
    categoryId: any
    Departure: string
    nationality: string
    residence: string
  }
  
  export interface Occupancy {
    Children: number
    Infants: number
    AdultsAges: number[]
    SeniorAges: number[]
    ChildrenAges: any[]
    Visible: boolean
    Adults: number
  }
  