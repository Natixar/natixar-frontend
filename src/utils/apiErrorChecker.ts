const checkHTTPError = (state: any, action: any, callback: () => void) => {
  if (action.payload?.status >= 200 && action.payload?.status < 300) {
    callback()
    return
  }
  const url = new URL(
    (
      action.meta.baseQueryMeta as { request: Request; response: Response }
    ).request.url,
  )
  console.log(
    `The /${url.pathname.split("/").findLast((x) => x)} endpoint ${!action.payload.status ? "closed the connection without returning data." : `returned the code HTTP ${action.payload.status}`}`,
  )
}

export default checkHTTPError
