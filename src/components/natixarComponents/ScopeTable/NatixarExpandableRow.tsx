import { CSSObject } from "@mui/material/styles"
import { Stack, Box, Collapse } from "@mui/material"
import { StackProps, SxProps } from "@mui/system"
import React, { useMemo } from "react"

import {
  scopeColor,
  scopeTextColor,
} from "../CO2DonutSection/EmissionByScopeDonutSection"
import { UpArrowIcon } from "assets/icons/UpArrowIcon"
import { DownArrowIcon } from "assets/icons/DownArrowIcon"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { ScopeTable, ScopeTableItemProps } from "./index"
import { useSelector } from "react-redux"
import {
  selectAlignedIndexes,
  selectRequestEmissionProtocol,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import {
  expandId,
  findNodeBy,
} from "data/domain/transformers/StructuralTransformers"
import {
  EmissionCategory,
  EmissionDataPoint,
} from "data/domain/types/emissions/EmissionTypes"
import { IdTreeNode } from "data/domain/types/structures/StructuralTypes"
import { getCategoryDescription } from "data/domain/transformers/DataDetectors"
import { getColorByCategory } from "utils/CategoryColors"

export interface NewScopeTableProps extends StackProps {
  scopeId: number
  active: boolean
  onRowClicked: Function
  index: number
  bgcolor: string
  textColor: string
  title: string
}

export const NatixarExpandableRow = ({
  scopeId,
  bgcolor = scopeColor[0],
  textColor = scopeTextColor[0],
  active = false,
  onRowClicked = () => {},
  index = 0,
  title = "test",
  ...props
}: NewScopeTableProps) => {
  /** scopes */
  const { categories, categoryHierarchy } = useSelector(selectAlignedIndexes)
  const allPoints = useSelector(selectVisiblePoints)
  const currentProtocol = useSelector(selectRequestEmissionProtocol)
  const getRows = (idStr: number | string) => {
    const scopeId = parseInt(String(idStr)!, 10)

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
        let toreturn = {
          id: categoryData.id,
          category: categoryData,
          description: getCategoryDescription(categoryId),
          categoryColor: getColorByCategory(categoryData.era),
          value: [emissionAmountForThisCategory, totalEmissionCategory] as [
            number,
            number,
          ],
        }
        return toreturn
      })
    return rows
  }

  const data = getRows(scopeId)
  const rows = data

  let total = "0"
  if (data && data[0]) {
    total = formatEmissionAmount(data[0].value[1])
  }

  const styleHeaderRow = (): CSSObject => ({
    padding: "12px 24px",
    borderRadius: "24px",
    backgroundColor: bgcolor,
    color: textColor,
    font: 'bold 20px/1 "Urbanist"',
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "all .3s",
    "&:hover": {
      filter: "brightness(1.05)",
    },
  })

  props.sx = {
    ...props.sx,
    ...styleHeaderRow(),
  } as SxProps

  const stackProps: any = { ...props } as any

  return (
    <Stack flexDirection="column" gap={2}>
      <Stack
        {...stackProps}
        flexDirection="row"
        width="100%"
        onClick={() => {
          onRowClicked(index)
        }}
      >
        <Stack
          flexDirection="row"
          mx={3}
          flexGrow={1}
          gap={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box>{title}</Box>
          <Box>Total : {total}</Box>
          {active && <UpArrowIcon customColor={textColor} />}
          {!active && <DownArrowIcon customColor={textColor} />}
        </Stack>
      </Stack>

      <Collapse in={active}>
        <ScopeTable data={rows} />
      </Collapse>
    </Stack>
  )
}
