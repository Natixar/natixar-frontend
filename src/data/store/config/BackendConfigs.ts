import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/query"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
/*
So, because not all endpoints are ready from Natixar's side,
in order to demonstrate some functionality we created our own custom backend
and deployed it on render.

That's why we have two basequeries here.
*/

export const backendBaseQuery = () =>
  fetchBaseQuery({
    baseUrl: import.meta.env.VITE_NATIXAR_BACKEND_URL, 
    prepareHeaders: (headers: Headers) => {
      headers.set("x-client-api-key", import.meta.env.VITE_NATIXAR_API_KEY)
      return headers
    },
  })

export const backupBackendBaseQuery = () =>
  fetchBaseQuery({ baseUrl: import.meta.env.VITE_COLLABRIUM_BACKEND_URL })

/*
This is axios base query. It's not used for now, but maybe we will decide to move there.
For now it's left as-is.
*/
export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = {
      baseUrl: import.meta.env.VITE_NATIXAR_BACKEND_URL,
    },
  ): BaseQueryFn<
    {
      url: string
      method?: AxiosRequestConfig["method"]
      data?: AxiosRequestConfig["data"]
      params?: AxiosRequestConfig["params"]
      headers?: AxiosRequestConfig["headers"]
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }
