import { createApi } from "@reduxjs/toolkit/query/react"
import { backendBaseQuery } from "data/store/config/BackendConfigs"
import { EmissionRangesRequest, EmissionRangesPayload, EmissionResponse } from "./EndpointTypes"

const encodeRangeParameters = (r: EmissionRangesRequest): string => {
  const parameterString =
    `scale=${r.scale}` +
    `&protocol=${r.protocol}` +
    `&time_ranges=${JSON.stringify(r.timeRanges)}`
  return encodeURI(parameterString)
}

export const emissionRangesApi = createApi({
  reducerPath: "emissionRangesApi",
  baseQuery: backendBaseQuery(),
  endpoints: (builder) => ({
    getEmissionRanges: builder.query<
      //EmissionRangesPayload,
      EmissionResponse,
      EmissionRangesRequest
    >({
      query: (request) => ({
        url: `/api/v0/data/ranges?${encodeRangeParameters(request)}`,
        method: "GET",
      }),
      transformResponse: (response: EmissionRangesPayload[], meta): EmissionResponse => ({ data: response, status: meta?.response?.status }),
      //transformResponse: (payload: EmissionRangesPayload[]): EmissionRangesPayload => payload[0],  // Uses only the first response object
    }),
  }),
})

export const { useGetEmissionRangesQuery, useLazyGetEmissionRangesQuery } =
  emissionRangesApi
