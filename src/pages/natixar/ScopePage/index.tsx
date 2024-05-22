import { Button, Grid, Stack, Typography } from "@mui/material"
import MainCard from "components/MainCard"
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons"

import { NavLink, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  selectAlignedIndexes,
  selectRequestEmissionProtocol,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import {
  EmissionCategory,
  EmissionDataPoint,
} from "data/domain/types/emissions/EmissionTypes"
import { IdTreeNode } from "data/domain/types/structures/StructuralTypes"
import {
  expandId,
  findNodeBy,
} from "data/domain/transformers/StructuralTransformers"
import { getColorByCategory } from "utils/CategoryColors"
import { useMemo } from "react"
import { generalCategoryText } from "data/domain/types/emissions/CategoryDescriptions"
import { getCategoryDescription } from "data/domain/transformers/DataDetectors"
import {
  ScopeTable,
  ScopeTableItemProps,
} from "../../../components/natixarComponents/ScopeTable"
import Breadcrumb from "../../../components/@extended/Breadcrumbs"

const ScopePage = () => {
  const { id: idStr } = useParams()
  const scopeId = parseInt(idStr!, 10)

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
  const scope = categories[scopeId]

  const links = [
    {
      title: "Home",
      to: "/",
    },
    {
      title: `${scope?.name ?? "Total "} emissions`,
      to: "",
    },
  ]

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

  allPoints.forEach((emissionPoint) => {
    const matchingCategoryId = categoryIds.find((categoryId) =>
      idsToFilterWith[categoryId].includes(emissionPoint.categoryId),
    )
    if (typeof matchingCategoryId !== "undefined") {
      dataPointsByCategory[matchingCategoryId].push(emissionPoint)
    }
  })
  // Then just sum them and send to the scope table
  const totalEmission = Object.values(dataPointsByCategory)
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
        value: [emissionAmountForThisCategory, totalEmission],
      }
    })

  return (
    <MainCard>
      <Grid container rowSpacing={4.5} columnSpacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            padding="10px 0px"
          >
            <NavLink to="/">
              <Button
                sx={{ color: "primary.contrastText" }}
                variant="contained"
                startIcon={<ArrowLeftOutlined color="primary.contrastText" />}
              >
                Back
              </Button>
            </NavLink>
            <Breadcrumb
              custom
              title={false}
              links={links}
              separator={RightOutlined}
              sx={{
                mb: "0px !important",
              }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <Stack gap=".5rem">
            <Typography variant="h3">Protocol {currentProtocol}</Typography>
            <Typography variant="h4">
              {`${scope?.name} - ${getCategoryDescription(scopeId) ?? ""}`}
            </Typography>
            <Typography variant="h6">{generalCategoryText}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <ScopeTable data={rows} />
        </Grid>
      </Grid>
    </MainCard>
  )
}

export default ScopePage
