import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { useDispatch } from "react-redux"

import EmissionRangesSlice from "./features/emissions/ranges/EmissionRangesSlice"
import UnknownCodeMappingsSlice from "./features/codemappings/UnknownCodeMappingsSlice"
import MappingToEditSlice from "./features/codemappings/MappingEditSlice"
import { emissionRangesApi } from "./features/emissions/ranges/EmissionRangesClient"
import { unknownMappingsApi } from "./features/codemappings/UnknownCodeMappingsClient"
import { networkCheckApi } from "./features/networkIndication/NetworkCheckClient"
import { fileUploadApi } from "./features/fileupload/FileUploadClient"
import { reportGenerationApi } from "./features/reports/ReportGenerationClient"
import ChartFilterSlice from "./features/chartFilter/ChartFilterSlice"

export const store = configureStore({
  reducer: {
    emissionRanges: EmissionRangesSlice,
    unknownCodeMappings: UnknownCodeMappingsSlice,
    mappingToEdit: MappingToEditSlice,
    chartFilterState: ChartFilterSlice,
    [emissionRangesApi.reducerPath]: emissionRangesApi.reducer,
    [unknownMappingsApi.reducerPath]: unknownMappingsApi.reducer,
    [networkCheckApi.reducerPath]: networkCheckApi.reducer,
    [fileUploadApi.reducerPath]: fileUploadApi.reducer,
    [reportGenerationApi.reducerPath]: reportGenerationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      emissionRangesApi.middleware,
      unknownMappingsApi.middleware,
      networkCheckApi.middleware,
      fileUploadApi.middleware,
      reportGenerationApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

setupListeners(store.dispatch)
