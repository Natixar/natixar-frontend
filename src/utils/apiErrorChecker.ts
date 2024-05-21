/**
 * Check http code status in response and execute callback function when the status code are 200 or 206
 * @param state
 * @param action
 * @param callback
 * @returns
 */
const checkHTTPError = (state: any, action: any, callback: () => void) => {
  if (action.payload?.status === 200 || action.payload?.status === 206) {
    callback()
    return
  }
  const url = new URL(
    (
      action.meta.baseQueryMeta as { request: Request; response: Response }
    ).request.url,
  )
  console.log(
    `The /${url.pathname.split("/").find((x: string, i: number, arr: string[]) => i === arr.length - 1)} endpoint ${!action.payload.status ? "closed the connection without returning data." : `returned the code HTTP ${action.payload.status}`}`,
  )
}

export default checkHTTPError
