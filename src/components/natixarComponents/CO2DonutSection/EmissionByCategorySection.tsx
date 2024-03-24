import { Box, Drawer } from "@mui/material"

import { filter, sum, summarize, tidy } from "@tidyjs/tidy"
import { ApexOptions } from "apexcharts"
import {
  extractNameOfEra,
  formatEmissionAmount,
  getScopesOfProtocol,
} from "data/domain/transformers/EmissionTransformers"
import { expandId } from "data/domain/transformers/StructuralTransformers"
import {
  AlignedIndexes,
  EmissionDataPoint,
} from "data/domain/types/emissions/EmissionTypes"
import { selectRequestEmissionProtocol } from "data/store/api/EmissionSelectors"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { useSelector } from "react-redux"
import { defaultOptions } from "sections/charts/apexchart/ApexDonutChart/constants"
import { ApexPieChartProps } from "sections/charts/apexchart/ApexDonutChart/interface"
import TopContributorsSection from "sections/contributor/top-contributors/TopContributorsSection"
import { getColorByCategory } from "utils/CategoryColors"
import LabelBox from "./LabelBox"
import {
  ChartContainerStyles,
  ContainerStyles,
  LegendsContainerStyles,
} from "./styled"

interface ByCategoryItem {
  categoryId: number
  count: number
  categoryName: string
  categoryColor: string
}

export interface EmissionByCategorySectionProps {
  allDataPoints: EmissionDataPoint[]
  alignedIndexes: AlignedIndexes
}

const optionsOverrides: ApexOptions = {
  yaxis: {
    labels: {
      formatter(val) {
        return formatEmissionAmount(val)
      },
    },
  },
  tooltip: {
    followCursor: true,
    y: {
      formatter(val) {
        return formatEmissionAmount(val)
      },
    },
  },
}

const totalTextOptions = {
  show: true,
  fontSize: "16px",
  color: "#0B0B0B",
  fontWeight: "bold",
}

const configurableOptions = (
  totalEmission: number,
  onScopeClick: (scope: number) => void,
): ApexOptions => {
  const formattedEmission = formatEmissionAmount(totalEmission).split(" ")

  return {
    chart: {
      events: {
        click(event, chartContext, config) {
          console.log("We clicked on: ", event)
          console.log("Context is: ", chartContext)
          console.log("Config is: ", config)
          onScopeClick(1234)
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              ...totalTextOptions,
            },
            value: {
              ...totalTextOptions,
            },
            total: {
              showAlways: true,
              label: formattedEmission[0],
              ...totalTextOptions,
              // eslint-disable-next-line no-unused-vars
              formatter(w) {
                return formattedEmission[1]
              },
            },
          },
        },
      },
    },
  }
}

const EmissionByCategorySection = ({
  allDataPoints,
  alignedIndexes,
}: EmissionByCategorySectionProps) => {
  const protocol = useSelector(selectRequestEmissionProtocol)
  const [pieChartData, setPieChartData] = useState<ApexPieChartProps>({
    data: [],
    totalLabel: "",
  })
  const [openTopContributors, setOpenTopContributors] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(0)

  const scopes = useMemo(
    () => getScopesOfProtocol(protocol, alignedIndexes.categories),
    [protocol, alignedIndexes.categories],
  )

  useEffect(() => {
    let acceptResult = true
    const aggregateData = async () => {
      const categoryAggregators: Record<string, ByCategoryItem> = {}

      scopes.forEach((scope) => {
        const allIdsOfInterest = expandId(
          [scope.id],
          alignedIndexes.categoryHierarchy,
        )
        const total = tidy(
          allDataPoints,
          filter((edp) => allIdsOfInterest.includes(edp.categoryId)),
          summarize({ totalEmission: sum("totalEmissionAmount") }),
        )[0].totalEmission

        const era = extractNameOfEra(scope.era)
        categoryAggregators[era] = {
          categoryId: scope.id,
          count: total,
          categoryName: scope.name,
          categoryColor: getColorByCategory(era),
        }
      })

      if (acceptResult) {
        const byCategoryItems = Object.values(categoryAggregators)

        const newData: ApexPieChartProps = {
          data: byCategoryItems.map((item) => ({
            value: item.count,
            color: item.categoryColor,
            title: item.categoryName,
          })),
          totalLabel: "",
        }
        setPieChartData(newData)
      }
    }

    aggregateData()
    return () => {
      acceptResult = false
    }
  }, [allDataPoints, alignedIndexes, setPieChartData])

  const series = pieChartData.data.map((a) => a.value)
  const labels = pieChartData.data.map((a) => a.title)
  const colors = pieChartData.data.map((a) => a.color)

  const totalEmission = series.reduce((a, b) => a + b, 0)

  const onScopeClick = useCallback(
    (category: number) => {
      setSelectedCategory(category)
      setOpenTopContributors(true)
    },
    [setSelectedCategory, setOpenTopContributors],
  )

  return (
    <Box sx={ContainerStyles}>
      <Box sx={ChartContainerStyles}>
        <ReactApexChart
          options={{
            ...defaultOptions,
            ...optionsOverrides,
            ...configurableOptions(totalEmission, onScopeClick),
            labels,
            colors,
          }}
          series={series}
          type="donut"
          width={400}
        />
      </Box>

      <Box sx={LegendsContainerStyles}>
        {pieChartData.data.map((dataItem) => (
          <LabelBox
            legend={{
              title: dataItem.title,
              color: dataItem.color,
              value: formatEmissionAmount(dataItem.value),
              navLink: dataItem.title.toLowerCase(),
            }}
            key={dataItem.title}
          />
        ))}
      </Box>
      <Drawer
        anchor="right"
        open={openTopContributors}
        onClose={() => setOpenTopContributors(false)}
        sx={{
          width: "40dvw",
          maxWidth: "80dvw",
        }}
      >
        <TopContributorsSection
          sx={{
            width: "40dvw",
            maxWidth: "80dvw",
          }}
          categoryId={selectedCategory}
          indexes={alignedIndexes}
          dataPoints={allDataPoints}
        />
      </Drawer>
    </Box>
  )
}

export default memo(EmissionByCategorySection)
