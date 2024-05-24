import Typography from "@mui/material/Typography"
import { SxProps } from "@mui/system"
import { expandId } from "data/domain/transformers/StructuralTransformers"
import {
  AlignedIndexes,
  EmissionDataPoint,
} from "data/domain/types/emissions/EmissionTypes"
import { memo, useMemo } from "react"
import {
  tidy,
  filter,
  summarize,
  sum,
  groupBy,
  arrange,
  desc,
  map,
} from "@tidyjs/tidy"
import { DataGrid, GridColDef, GridColTypeDef, GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid"
import { Box, Link } from "@mui/material"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { LinkOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router"

interface TopContributorsSectionParams {
  categoryId: number
  dataPoints: EmissionDataPoint[]
  indexes: AlignedIndexes
}

const HEADER_CSS_CLASS = "common-super-class-name"
const AWESOME_COLUMN: GridColTypeDef = {
  headerClassName: HEADER_CSS_CLASS,
}

const TableContributorLink = ({ params }: any) => {
  const {
    row: { company, country, companyId },
  } = params
  const navigate = useNavigate()

  const handleLinkClick = () => {
    navigate(`/contributors/analysis/${companyId}`)
  }

  return (
    <Link
      sx={{
        display: "flex",
        alignItems: "center",
        columnGap: "5px",
        textDecoration: "underline",
        cursor: "pointer",
      }}
      onClick={handleLinkClick}
    >
      {company} - {country}
      <LinkOutlined />
    </Link>
  )
}


const columnDefinitions: GridColDef[] = [
  {
    ...AWESOME_COLUMN,
    field: "name",
    headerName: "Contributor",
    sortable: false,
    hideable: false,
    flex: 1,
    renderCell: (params) => <TableContributorLink params={params} />,
  },
  {
    ...AWESOME_COLUMN,
    field: "contribution",
    headerName: "Contribution",
    sortable: false,
    hideable: false,
    flex: 2,
    renderCell: (params) => {
      const percentage = (100.0 * params.value[0]) / params.value[1]
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            py: 1.5,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#75D048",
              color: "primary.contrastText",
              textAlign: "center",
              height: "100%",
              minWidth: `${percentage}%`,
              width: `${percentage}%`,
            }}
          />
        </Box>
      )
    },
  },
  {
    ...AWESOME_COLUMN,
    field: "amount",
    headerName: "Emission",
    sortable: false,
    hideable: false,
    flex: 1,
    renderCell: (params) => (
      <Typography>{formatEmissionAmount(params.value)}</Typography>
    ),
  },
]

const TopContributorsSection = ({
  categoryId,
  dataPoints,
  indexes,
  ...sxProps
}: TopContributorsSectionParams & SxProps) => {
  const allRelevantCategories = useMemo(
    () => expandId([categoryId], indexes.categoryHierarchy),
    [categoryId, indexes.categoryHierarchy],
  )
  const relevantDataPoints = useMemo(
    () =>
      tidy(
        dataPoints,
        filter((edp) => allRelevantCategories.includes(edp.categoryId)),
      ),
    [dataPoints],
  )

  const totalEmission = useMemo(
    () =>
      relevantDataPoints.reduce((acc, cur) => acc + cur.totalEmissionAmount, 0),
    [relevantDataPoints],
  )

  const dataToDisplay = useMemo(
    () =>
      tidy(
        relevantDataPoints,
        groupBy(
          ["companyId", "countryId"],
          [summarize({ total: sum("totalEmissionAmount") })],
        ),
        arrange([desc("total")]),
        map((groupedByCompany) => {
          const { companyId, countryId, total: groupTotal } = groupedByCompany
          const companyName = indexes.entities[companyId]?.name ?? ""
          const countryName = indexes.areas[countryId]?.name ?? ""
          return {
            id: `${companyId}-${countryId}`,
            companyId,
            company: companyName,
            country: countryName,
            contribution: [groupTotal, totalEmission],
            amount: groupTotal,
          }
        }),
      ),
    [relevantDataPoints],
  )

  return (
    <DataGrid
      sx={{
        width: "100%",
        "& .MuiDataGrid-cell": {
          outline: "none !important",
        },
        "& .MuiDataGrid-columnHeader": {
          outline: "none !important",
        },
        "& .Mui-error": {
          backgroundColor: `blue`,
          color: "#ff4343",
        },
        [`& .${HEADER_CSS_CLASS}`]: {
          backgroundColor: "#FAFAFA",
        },
        ...sxProps,
      }}
      rows={dataToDisplay}
      columns={columnDefinitions}
      disableColumnFilter
      disableColumnMenu
      checkboxSelection={false}
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10, 20]}
    />
  )
}

export default memo(TopContributorsSection)
