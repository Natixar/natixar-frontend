import { useEffect, useState } from "react"

// material-ui
import { useTheme } from "@mui/material/styles"

// project imports
import useConfig from "hooks/useConfig"

// third-party
import ReactApexChart, { Props as ChartProps } from "react-apexcharts"

// types
import { ThemeMode } from "types/config"
import { Box } from "@mui/material"

// ==============================|| ACQUISITION-CHANNELS CHART ||============================== //

interface Props {
  slot: string
  compare: boolean
}

const AcquisitionChart = ({ slot, compare }: Props) => {
  const theme = useTheme()
  const line = theme.palette.divider
  const { primary, secondary } = theme.palette.text

  const { mode } = useConfig()

  // TODO: refactor colors in chart

  const colorChartData = compare
    ? [
      theme.palette.primary.lighter, //11
      theme.palette.primary.lighter + '88',  // 21

      theme.palette.primary.main, //12
      theme.palette.primary.main + '88', //21

      theme.palette.success.main, // 31
      theme.palette.success.main + '88', // 

      // theme.palette.primary.light,
      // theme.palette.primary.light + '88',

      // theme.palette.secondary.main,
      // theme.palette.secondary.main + '88',

      // theme.palette.secondary.light,
      // theme.palette.secondary.light + '88',
    ]
    : [theme.palette.primary.lighter, theme.palette.primary.main, theme.palette.success.main]

  let slotData

  switch (slot) {
    case "month":
      slotData = [
        2000, 2000, 4000, 1000, 4000, 2000, 5000, 2000, 5000, 2000, 4000, 2000,
      ]
      break
    case "quarter":
      slotData = [
        5000, 3000, 4000, 2000, 4000, 5000, 2000, 3000, 1000, 1000, 3000, 4000,
      ]
      break
    case "year":
      slotData = [
        2000, 2000, 2000, 1000, 4000, 1000, 3000, 4000, 4000, 4000, 4000, 5000,
      ]
      break
    default:
      slotData = [
        2000, 2000, 4000, 1000, 4000, 2000, 5000, 2000, 5000, 2000, 4000, 2000,
      ]
      break
  }

  const chartData = compare
    ? [
      {
        name: "Scope 1 A",
        group: "A",
        data: slotData,
      },
      {
        name: "Scope 1 B",
        group: "B",
        data: slotData,
      },
      {
        name: "Scope 2 A",
        group: "A",
        data: slotData,
      },
      {
        name: "Scope 2 B",
        group: "B",
        data: slotData,
      },
      {
        name: "Scope 3 A",
        group: "A",
        data: slotData,
      },
      {
        name: "Scope 3 B",
        group: "B",
        data: slotData,
      },
    ]
    : [
      {
        name: "Scope 1",
        group: "A",
        data: slotData,
      },
      {
        name: "Scope 2",
        group: "A",
        data: slotData,
      },
      {
        name: "Scope 3",
        group: "A",
        data: slotData,
      },
    ]

  // chart options
  const barChartOptions = {
    chart: {
      type: "bar",
      height: 250,
      width: "100%",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
      },
    },
    xaxis: {
      categories:
        slot === "month"
          ? [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]
          : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        style: {
          colors: [
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
          ],
        },
      },
    },
    yaxis: {
      title: {
        text: "t CO2e",
        rotate: -90,
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#8C8C8C",
          fontSize: "10px",
          fontWeight: 700,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        style: {
          colors: [
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
            secondary,
          ],
        },
      },
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        show: true,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        vertical: 20,
        horizontal: 20,
      },
      markers: {
        radius: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      strokeDashArray: 5,
      position: "back",
    },
    stroke: {
      colors: ["transparent"],
      width: 1,
    },
  }

  const [options, setOptions] = useState<ChartProps>(barChartOptions)
  const [series, setSeries] = useState([
    {
      name: "",
      group: "",
      data: [0, 0, 0],
    },
  ])

  useEffect(() => {
    const updatedChartData = [...chartData]
    setSeries(updatedChartData)
  }, [slot, compare])

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      colors: colorChartData,
      theme: {
        mode: mode === ThemeMode.DARK ? "dark" : "light",
      },
    }))
  }, [mode, primary, secondary, line, theme])

  return (
    <Box sx={{ height: "285px" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height="300px"
      />
    </Box>
  )
}

export default AcquisitionChart
