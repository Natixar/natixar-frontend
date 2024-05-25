// material-ui
import {
  LinearProgress,
  linearProgressClasses,
  Link,
  Stack,
  SxProps,
  useTheme,
  Typography,
} from "@mui/material"
import { LinkOutlined } from "@ant-design/icons"
import { NavLink, useNavigate } from "react-router-dom"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { EmissionCategory } from "data/domain/types/emissions/EmissionTypes"
import { DataGrid, GridColDef, GridColTypeDef } from "@mui/x-data-grid"
import { RightArrowIcon } from "assets/icons/RightArrowIcon"

// ===========================|| DATA WIDGET - PROJECT TABLE CARD ||=========================== //
export type ScopeTableItemProps = {
  id: number
  category: EmissionCategory
  description: string
  categoryColor: string
  value: [number, number]
}

export type ScopeTableProps = {
  data: ScopeTableItemProps[]
}

const HEADER_CSS_CLASS = "common-super-class-name"
const AWESOME_COLUMN: GridColTypeDef = {
  headerClassName: HEADER_CSS_CLASS,
  hideable: false,
}

export const ScopeTable = ({ data, ...sxProps }: ScopeTableProps & SxProps) => {
  const theme = useTheme()
  const navigate = useNavigate()

  const handleLinkClick = (params: any) => {
    navigate(`/contributors/category-analysis/${params.row.category.id}`)
  }

  const columnDefinitions: GridColDef[] = [
    {
      ...AWESOME_COLUMN,
      field: "category",
      headerName: "Category name",
      flex: 2,

      sortComparator: (categoryA, categoryB) =>
        categoryA.name.localeCompare(categoryB.name),
      renderCell: (params) => (
        <Link
          sx={{
            width: "100%",
            display: "flex",
            flexGrow: 1,
            alignItems: "center",
            columnGap: "5px",
            textDecoration: "underline",
            cursor: "pointer",
            textOverflow: "ellipsis",
          }}
          onClick={() => handleLinkClick(params)}
        >
          <span
            style={{
              textOverflow: "ellipsis",
              minWidth: "100px",
              display: "inline-block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              fontSize: 16,
            }}
            title={params.row.category.name}
          >
            {params.row.category.name}
          </span>
          <LinkOutlined />
        </Link>
      ),
    },
    {
      ...AWESOME_COLUMN,
      field: "value",
      headerName: "Value",
      flex: 1,
      sortComparator: (emissionDataA, emissionDataB) =>
        emissionDataA[0] - emissionDataB[0],
      renderCell: (params) => (
        <Stack alignItems="start" sx={{ width: "100px", mt: -2 }}>
          <Typography mr={2}>
            {formatEmissionAmount(params.row.value[0])}
          </Typography>
          <LinearProgress
            sx={{
              minWidth: "150px",
              flexShrink: "1",
              height: 8,
              borderRadius: 5,
              marginRight: 32,
              [`&.${linearProgressClasses.colorPrimary}`]: {
                backgroundColor: theme.palette.grey[200],
              },
              [`& .${linearProgressClasses.bar}`]: {
                borderRadius: 5,
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.primary.lighter
                    : theme.palette.primary.lighter,
              },
            }}
            variant="determinate"
            value={
              params.value[1] === 0
                ? 0
                : (100.0 * params.value[0]) / params.value[1]
            }
          />
        </Stack>
      ),
    },
    {
      ...AWESOME_COLUMN,
      field: "id",
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <NavLink to={`/contributors/top/scope/${params.row.category.id}`}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            minWidth={50}
          >
            <Typography mr={2}>Details</Typography>
            {/* <Box mr={2}>{formatEmissionAmount(params.row.value[0])}</Box> */}
            <RightArrowIcon
              customColor={theme.palette.primary.main}
              sx={{ fontSize: 15 }}
            />
          </Stack>
        </NavLink>
      ),
    },
  ]

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
      rows={data}
      columns={columnDefinitions}
      checkboxSelection={false}
      disableColumnMenu={false}
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10, 20]}
    />
  )
}
