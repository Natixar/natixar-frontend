import ReactApexChart from "react-apexcharts"

import { ApexPieChartProps } from "./interface"
import { defaultOptions } from "./constants"

const ApexDonatChart = ({ data, totalLabel }: ApexPieChartProps) => {
  defaultOptions.colors = data.map((a) => a.color)
  defaultOptions.labels = data.map((a) => a.title)
  defaultOptions.plotOptions.pie.donut.labels.total.label = totalLabel

  return (
    <ReactApexChart
      options={defaultOptions}
      series={data.map((a: any) => a.value)}
      type="donut"
      width={500}
    />
  )
}

export default ApexDonatChart
