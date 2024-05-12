export const COLOR_OPERATION = "#8ECBF5"
export const COLOR_UPSTREAM = "#1281E7"
export const COLOR_DOWNSTREAM = "#053759"
export const COLOR_CLUSTER = "#80D977"
export const COLOR_5 = "#1DB447"
export const COLOR_DEFAULT = "#126F2C"
const DEFAULT_TRANSPARENCY = 0.6

export const getColorByCategory = (category: string): string => {
  if (!category) {
    return COLOR_DEFAULT
  }
  let result: string
  switch (category.toLowerCase()) {
    case "operation":
    case "1":
      result = COLOR_OPERATION
      break
    case "upstream":
    case "2":
      result = COLOR_UPSTREAM
      break
    case "downstream":
    case "3":
      result = COLOR_DOWNSTREAM
      break
    case "cluster":
    case "4":
      result = COLOR_CLUSTER
      break
    case "5":
      result = COLOR_5
      break
    default:
      result = COLOR_DEFAULT
      break
  }
  return result
}

export const getOpaqueColorByCategory = (
  category: string,
  transparency: number = 0.6,
): string => {
  const transparencyHEX = (Math.max(0, Math.min(1, transparency)) * 255)
    .toString(16)
    .toUpperCase()
    .substring(0, 2)

  return `${getColorByCategory(category)}${transparencyHEX}`
}
