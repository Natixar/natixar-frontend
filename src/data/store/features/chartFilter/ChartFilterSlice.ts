import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ChartFilterState, ChartFilterItem } from "./Types"

const initialState = {
  chartFilterState: [] as ChartFilterState,
}

const chartFilterSlice = createSlice({
  name: "chartFilter",
  initialState,
  reducers: {
    updateChartFilter: (state, action: PayloadAction<ChartFilterItem[]>) => {
      state.chartFilterState = action.payload
    },
  },
})

export const { updateChartFilter } = chartFilterSlice.actions
export default chartFilterSlice.reducer