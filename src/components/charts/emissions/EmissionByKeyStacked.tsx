import { SxProps } from "@mui/system"
import { ApexOptions } from "apexcharts"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { ChartState } from "data/domain/types/emissions/EmissionTypes"
import { areaChartSelector } from "data/store/api/EmissionSelectors"
import { setAreaChartState } from "data/store/features/emissions/ranges/EmissionRangesSlice"
import { memo, useEffect, useMemo, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { useDispatch, useSelector } from "react-redux"
import { getOpaqueColorByCategory } from "utils/CategoryColors"

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
  const dispatch = useDispatch()

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

  const formatter = (val: number) => {
    return formatEmissionAmount(val)
  }

  const areaChartState = useSelector(areaChartSelector)

  /* It's necessary to have one state per chart saved in the store */
  const defaultOptions: ApexOptions = useMemo((): ApexOptions => {
    return {
      chart: {
        type: "area",
        stacked: true,
        events: {
          zoomed: function (chartContext, { xaxis, yaxis }) {
            /** prepare payload to save */
            const payload: ChartState = JSON.parse(
              JSON.stringify({
                ...areaChartState,
              }),
            )
            payload.options!.xaxis = JSON.parse(JSON.stringify({ ...xaxis }))
            payload.options!.yaxis = JSON.parse(JSON.stringify({ ...yaxis }))
            delete (payload.options!.yaxis! as ApexYAxis[])![0].labels.formatter // unable to save function in redux state

            /** save payload to store */
            dispatch(setAreaChartState(payload))
          },
        },
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
  }, [])

  /** Local options to use as a proxy because we can't save functions in redux store */
  const [options, setOptions] = useState({
    ...defaultOptions,
    ...optionOverrides(keys),
  })

  /** Format the local option to use the saved options in store in the chart */
  useEffect(() => {
    const tmpOptions = {
      ...areaChartState.options,
      ...optionOverrides(keys),
    }
    tmpOptions.xaxis = { ...optionOverrides(keys) }.xaxis
    if (tmpOptions != undefined && tmpOptions.yaxis != undefined) {
      ;(tmpOptions.yaxis as ApexYAxis[])[0].labels.formatter = formatter
    }
    setOptions(tmpOptions)
  }, [areaChartState])

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
