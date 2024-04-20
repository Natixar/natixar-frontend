import { Box, Stack, useMediaQuery, useTheme } from "@mui/material"

import { filter, sum, summarize, tidy } from "@tidyjs/tidy"
import { ApexOptions } from "apexcharts"
import {
  extractNameOfEra,
  formatEmissionAmount,
  getScopesOfProtocol,
} from "data/domain/transformers/EmissionTransformers"
import {
  expandId,
  findNodeBy,
} from "data/domain/transformers/StructuralTransformers"
import {
  AlignedIndexes,
  EmissionCategory,
  EmissionDataPoint,
} from "data/domain/types/emissions/EmissionTypes"
import {
  selectRequestEmissionProtocol,
  selectAlignedIndexes,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import { memo, useMemo, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { useSelector } from "react-redux"
import { getColorByCategory } from "utils/CategoryColors"
import useAsyncWork from "hooks/useAsyncWork"
import {
  ChartContainerStyles,
  ContainerStyles,
} from "./styled"
import { IdTreeNode } from "data/domain/types/structures/StructuralTypes"
import { getCategoryDescription } from "data/domain/transformers/DataDetectors"
import {
  ScopeTableItemProps,
} from "../../../components/natixarComponents/ScopeTable"
import { NatixarExpandableRow } from "../ScopeTable/NatixarExpandableRow"

export const scopeColor = [
  "#8ECBF5", // 1 bleu clair
  "#053759", // 2 bleu très foncé
  "#1DB447", // 3 vert
  "#0e96f1", // 4  bleu
  "#126e2c", // 5 vert foncé
  "#7bea9b", // 6 vrt clair
]
export const scopeTextColor = [
  "#053759", // 1
  "#fff", // 2
  "#fff", // 3
  "#fff", // 4
  "#fff", // 5
  "#053759", // 6
]

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
    fillSeriesColor: false,
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
  color: "#053759",
  fontWeight: "bold",
}

const configurableOptions = (totalEmission: number): ApexOptions => {
  const formattedEmission = formatEmissionAmount(totalEmission).split(" ")

  return {
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
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
              formatter() {
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
  const [pieChartData, setPieChartData] = useState<ByCategoryItem[]>([])

  const scopes = useMemo(
    () =>
      getScopesOfProtocol(protocol, alignedIndexes.categories).map((item) => ({
        ...item,
        active: false,
      })),
    [protocol, alignedIndexes.categories],
  )

  // Make scope data with extra data for display
  const [customScopes, setCustomScopes] = useState(
    scopes.map((item, index) => ({
      ...item,
      active: false,
      textColor: scopeTextColor[index],
      bgcolor: scopeColor[index],
    })),
  )

  // Set the row clicked active or not (open or not)
  const handleRowClicked = (scopeId: number) => {
    setCustomScopes(
      customScopes.map((item) => ({
        ...item,
        active: item.id === scopeId && !item.active ? true : false,
      })),
    )
  }

  useAsyncWork(
    () => {
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
      return Object.values(categoryAggregators)
    },
    setPieChartData,
    [allDataPoints, alignedIndexes, setPieChartData],
  )

  const series = pieChartData.map((a) => a.count)
  const labels = pieChartData.map((a) => a.categoryName)
  const colors = pieChartData.map((a) => a.categoryColor)

  const totalEmission = series.reduce((a, b) => a + b, 0)

  const theme = useTheme()
  const downMD = useMediaQuery(theme.breakpoints.down("md"))

  /** scopes */

  const getRows = (idStr: number | string) => {
    const scopeId = parseInt(String(idStr)!, 10)

    const { categories, categoryHierarchy } = useSelector(selectAlignedIndexes)
    const allPoints = useSelector(selectVisiblePoints)

    const currentProtocol = useSelector(selectRequestEmissionProtocol)
    const scopeNode = useMemo(() => {
      // We first select subtree of hierarchy for the protocol we use.
      // Just so we don't have to look over whole category tree
      const protocolNode = findNodeBy(
        (category: EmissionCategory) =>
          category.name.toLowerCase() === currentProtocol.toLowerCase(),
        categories,
        categoryHierarchy,
      )

      return findNodeBy(
        (category) => scopeId === category.id,
        categories,
        protocolNode?.children ?? [],
      )
    }, [scopeId, currentProtocol, categories, categoryHierarchy])

    // Walk over subcategories.
    const subcategories: IdTreeNode[] = scopeNode?.children ?? []
    const categoryIds = subcategories.map((subcategory) => subcategory.value)
    const idsToFilterWith: Record<number, number[]> = Object.fromEntries(
      // Collect all their included ids
      categoryIds.map((categoryId) => [
        categoryId,
        expandId([categoryId], subcategories),
      ]),
    )

    // Then just aggregate data points to different subcategories
    const dataPointsByCategory: Record<number, EmissionDataPoint[]> = {}
    categoryIds.forEach((categoryId) => {
      dataPointsByCategory[categoryId] = []
    })

    allPoints.forEach((emissionPoint: any) => {
      const matchingCategoryId = categoryIds.find((categoryId) =>
        idsToFilterWith[categoryId].includes(emissionPoint.categoryId),
      )
      if (typeof matchingCategoryId !== "undefined") {
        dataPointsByCategory[matchingCategoryId].push(emissionPoint)
      }
    })
    // Then just sum them and send to the scope table
    const totalEmissionCategory = Object.values(dataPointsByCategory)
      .flatMap((points) => points)
      .reduce((acc, cur) => acc + cur.totalEmissionAmount, 0)

    const rows: ScopeTableItemProps[] = Object.entries(dataPointsByCategory)
      .map((entry) => [
        parseInt(entry[0], 10),
        entry[1].reduce((acc, cur) => acc + cur.totalEmissionAmount, 0),
      ])
      .map((idToEmissionPair) => {
        const [categoryId, emissionAmountForThisCategory] = idToEmissionPair
        const categoryData = categories[categoryId]
        return {
          id: categoryData.id,
          category: categoryData,
          description: getCategoryDescription(categoryId),
          categoryColor: getColorByCategory(categoryData.era),
          value: [emissionAmountForThisCategory, totalEmissionCategory],
        }
      })
    return rows
  }

  return (
    <Stack
      sx={{ ...ContainerStyles, gap: "50px" }}
      direction={downMD ? "column" : "row"}
    >
      <Box sx={ChartContainerStyles}>
        <ReactApexChart
          options={{
            ...optionsOverrides,
            ...configurableOptions(totalEmission),
            labels,
            colors,
          }}
          series={series}
          type="donut"
          width={400}
        />
      </Box>

      <Stack minWidth={430} width="100%" flexDirection="column" gap={2}>
        {customScopes.map((scope, index) => (
          <NatixarExpandableRow
            data={getRows(scope.id)}
            index={index}
            title={scope.name}
            key={scope.id + "-" + index}
            onRowClicked={() => handleRowClicked(scope.id)}
            active={scope.active}
            textColor={scope.textColor}
            bgcolor={scope.bgcolor}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default memo(EmissionByCategorySection)
