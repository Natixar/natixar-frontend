export interface ChartFilterItem {
    id: string
    name: string
    minDate: Date
    maxDate: Date
    src: string
    scrollId: string
  }
  
  export interface ChartFilterState extends Array<ChartFilterItem> {}