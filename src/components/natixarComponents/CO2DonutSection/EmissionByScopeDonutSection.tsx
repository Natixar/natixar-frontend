import { Stack, useMediaQuery, useTheme } from "@mui/material"
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
import { memo, useEffect, useMemo, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { useSelector } from "react-redux"
import { getColorByCategory } from "utils/CategoryColors"
import { ContainerStyles } from "./styled"
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
  active: boolean
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

  // Set the row clicked active or not (open or not)
  const [selectedScopeId, setSelectedScopeId]: [number | null, Function] =
    useState(null)
  const handleRowClicked = (scopeId: number) => {
    setSelectedScopeId(selectedScopeId !== scopeId ? scopeId : null)
  }

  useEffect(() => {
    const categoryAggregators: Record<string, ByCategoryItem> = {}
    scopes.forEach((scope) => {
      const allIdsOfInterest = expandId(
        [scope.id],
        alignedIndexes.categoryHierarchy,
      )
      const total = allDataPoints
        .filter((dataPoint) => allIdsOfInterest.includes(dataPoint.categoryId))
        ?.map((dataPoint) => dataPoint.totalEmissionAmount)
        ?.reduce((a, b) => a + b, 0)

      const era = extractNameOfEra(scope.era)

      // Make scope data with extra data for display
      const eraOrCodeKey = scope.code ? String(scope.code) : era
      categoryAggregators[eraOrCodeKey] = {
        categoryId: scope.id,
        count: total,
        categoryName: scope.name,
        categoryColor: getColorByCategory(eraOrCodeKey),
        active: scope.id === selectedScopeId && !scope.active,
      }
    })
    setPieChartData(Object.values(categoryAggregators))
  }, [allDataPoints, alignedIndexes, selectedScopeId, setPieChartData])

  const totalEmission = pieChartData
    .map((a) => a.count)
    .reduce((a, b) => a + b, 0)

  const theme = useTheme()
  const downMD = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Stack
      sx={{ ...ContainerStyles, gap: "30px", flexWrap: "wrap" }}
      flexDirection={downMD ? "column" : "row"}
    >
      {!totalEmission && (
        <Stack alignItems="center" justifyContent="center" minWidth={100}>
          No data found
        </Stack>
      )}
      <Stack justifyContent="center" alignItems="center">
        <ReactApexChart
          options={{
            ...optionsOverrides,
            ...configurableOptions(totalEmission),
            labels: pieChartData.map((a) => a.categoryName),
            colors: pieChartData.map((a) => a.categoryColor),
          }}
          series={pieChartData.map((a) => a.count)}
          type="donut"
          width={400}
        />
      </Stack>

      <Stack minWidth={500} flex="2 1 0" flexDirection="column" gap={2}>
        {pieChartData.map((scope, index) => (
          <NatixarExpandableRow
            scopeId={scope.categoryId}
            index={index}
            title={scope.categoryName}
            key={`${scope.categoryId}-${index + 1}`}
            onRowClicked={() => handleRowClicked(scope.categoryId)}
            active={scope.active}
            textColor="#fff"
            bgcolor={scope.categoryColor}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default memo(EmissionByCategorySection)
