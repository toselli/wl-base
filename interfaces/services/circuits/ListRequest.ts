export interface ListRequest {
    Search?: CatalogSearch
    Paging: Paging
    Sorting: Sorting
  }
  
  export interface CatalogSearch {
    cities?: string[]
    countries?: string[]
    DurationFrom?: string
    DurationTo?: string
    PriceFrom: string
    PriceTo: string
    Nationality: string
    Residence: string
    Currency: string
    Language: string
    /* CircuitCode */
    Search?: string
  }
  
  export interface Paging {
    Page: number
    PageSize: number
  }
  
  export interface Sorting {
    PropertyName: string
    Direction: string
  }
  