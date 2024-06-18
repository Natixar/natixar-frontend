import { SxProps } from "@mui/system"
import { ApexOptions } from "apexcharts"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { memo, useMemo } from "react"
import ReactApexChart from "react-apexcharts"
import { getOpaqueColorByCategory } from "utils/CategoryColors"

const defaultOptions: ApexOptions = {
  chart: {
    type: "area",
    stacked: true,
  },
  yaxis: {
    title: {
      text: "Emissions",
    },
    labels: {
      formatter(val) {
        return formatEmissionAmount(val)
      },
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "25%",
      barHeight: "70%",
      // borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    type: "solid",
    opacity: 1,
  },
  stroke: {
    show: true,
    width: 8,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    strokeDashArray: 5,
    // position: "back",
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

const EmissionByKeyStacked = ({
  groupedData,
  keys,
  ...sxProps
}: {
  groupedData: Record<string, Record<string, number>>
  keys: string[]
} & SxProps) => {
  const series = useMemo(() => {
    const categories = Object.keys(groupedData)
    const byKeyData = Array(categories.length).fill(Array(keys.length).fill(0))

    Object.entries(groupedData).forEach((entry) => {
      const category = entry[0]
      const categoryIndex = categories.indexOf(category)

      Object.entries(entry[1]).forEach((seriesEntry) => {
        const keyIndex = keys.indexOf(seriesEntry[0])
        const data: number[] = byKeyData[categoryIndex]
        const amount = seriesEntry[1]
        data[keyIndex] = amount
      })
    })

    const chartData: ApexAxisChartSeries = Object.entries(groupedData).map(
      (entry) => {
        const category = entry[0]
        const categoryIndex = categories.indexOf(category)
        return {
          name: category,
          color: getOpaqueColorByCategory(category, 0.48),
          data: byKeyData[categoryIndex],
        }
      },
    )
    return chartData
  }, [groupedData, keys])

  const options = { ...defaultOptions, ...optionOverrides(keys) }
  return (
    <ReactApexChart
      sx={{ sxProps }}
      options={options}
      series={series}
      height="300px"
      type="area"
    />
  )
}

export default memo(EmissionByKeyStacked)
