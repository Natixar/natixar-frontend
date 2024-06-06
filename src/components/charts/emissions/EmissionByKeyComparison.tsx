import { SxProps } from "@mui/system"
import { ApexOptions } from "apexcharts"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { memo } from "react"
import ReactApexChart from "react-apexcharts"
import {
  getColorByCategory,
  getOpaqueColorByCategory,
} from "utils/CategoryColors"

const defaultOptions: ApexOptions = {
  chart: {
    type: "bar",
    stacked: true,
  },
  yaxis: {
    title: {
      text: "Emissions",
    },
    labels: {
      formatter(val) {
        return formatEmissionAmount(Math.abs(val))
      },
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "50%",
      barHeight: "70%",
      // borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 1,
  },
  stroke: {
    show: true,
    width: 1,
    colors: ["white"],
  },
  grid: {
    show: true,
    strokeDashArray: 5,
    position: "back",
  },
}

const optionOverrides = (keys: string[]): ApexOptions => ({
  xaxis: {
    categories: [...keys],
    labels: {
      rotate: -30,
      rotateAlways: true,
    },
  },
})

const produceSeries = (
  dataSet: Record<string, Record<string, number | undefined>>,
  groupName: string,
  categories: string[],
  keys: string[],
  useOpaqueColor: boolean = false,
) => {
  const byKeyData: number[][] = Array(categories.length).fill(
    Array(keys.length).fill(0),
  )

  Object.entries(dataSet).forEach((entry) => {
    const category = entry[0]
    const categoryIndex = categories.indexOf(category)

    Object.entries(entry[1]).forEach((seriesEntry) => {
      const keyIndex = keys.indexOf(seriesEntry[0])
      const data: (number | undefined)[] = byKeyData[categoryIndex]
      const amount = seriesEntry[1]
      data[keyIndex] = amount
    })
  })

  const series = Object.entries(dataSet).map((entry) => {
    const category = entry[0]
    const categoryIndex = categories.indexOf(category)
    return {
      name: `${category} (${groupName})`,
      group: groupName,
      color: useOpaqueColor
        ? getOpaqueColorByCategory(category, 0.48)
        : getColorByCategory(category),
      data: byKeyData[categoryIndex],
    }
  })
  return series
}

const EmissionByKeyComparison = ({
  dataSetA,
  dataSetB,
  keys,
  ...sxProps
}: {
  dataSetA: Record<string, Record<string, number>>
  dataSetB?: Record<string, Record<string, number | undefined>>
  keys: string[]
} & SxProps) => {
  const categories = Object.keys(dataSetA)

  const previousYearSeries = dataSetB
    ? produceSeries(dataSetB, "Previous year", categories, keys, true)
    : []

  const currentYearSeries = produceSeries(
    dataSetA,
    "Current year",
    categories,
    keys,
  )

  const options = { ...defaultOptions, ...optionOverrides(keys) }
  return (
    <ReactApexChart
      sx={{ sxProps }}
      options={options}
      series={[...currentYearSeries, ...previousYearSeries]}
      height="300px"
      type="bar"
    />
  )
}

export default memo(EmissionByKeyComparison)
