import { FunctionComponent, memo, useEffect, useState } from "react"
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColTypeDef,
  GridEventListener,
  GridRenderEditCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridPreProcessEditCellProps,
  GridRowClassNameParams,
} from "@mui/x-data-grid"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit"

import { CodeMapping } from "data/store/features/codemappings/Types"
import KeywordInput from "components/inputs/KeywordInput"
import KeywordsWidget from "components/inputs/KeywordsWidget"
import { Button, Link, SxProps } from "@mui/material"
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover"
import { useDispatch } from "react-redux"

/**
It's 6 for NESH
and 8 for NC8 
*/
const GOODS_CODE_LIMITATION = 6
const CODE_DETAIL_URL_PREFIX =
  "https://ec.europa.eu/taxation_customs/dds2/taric/measures.jsp?Taric="

const HEADER_CSS_CLASS = "common-super-class-name"
const AWESOME_COLUMN: GridColTypeDef = {
  headerClassName: HEADER_CSS_CLASS,
}

const VIEWABLE_COLUMN: GridColTypeDef = {
  ...AWESOME_COLUMN,
  editable: false,
}
const EDITABLE_COLUMN: GridColTypeDef = {
  ...AWESOME_COLUMN,
  editable: true,
  filterable: false,
}

const columns: GridColDef[] = [
  { field: "tool", headerName: "Tool", minWidth: 100, ...VIEWABLE_COLUMN },
  {
    field: "codeFromTool",
    headerName: "Code",
    minWidth: 120,
    ...VIEWABLE_COLUMN,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 0.5,
    ...VIEWABLE_COLUMN,
  },
  {
    field: "goodsCode",
    headerName: "NESH Code",
    type: "number",
    minWidth: 170,
    ...EDITABLE_COLUMN,
    valueGetter: (params) => {
      if (!params.value) {
        return params.value
      }
      return params.value.toString().padStart(GOODS_CODE_LIMITATION, "0")
    },
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      const newValue = params.props.value
      if (!params.hasChanged || !newValue) {
        return { ...params.props }
      }
      const hasError =
        newValue.toString().length > GOODS_CODE_LIMITATION ||
        Number.isNaN(parseInt(newValue, 10))
      return { ...params.props, error: hasError || undefined }
    },
    renderCell: (params) =>
      params.value ? (
        <Link
          underline="always"
          target="_blank"
          rel="noopener noreferrer"
          href={`${CODE_DETAIL_URL_PREFIX}${params.value}`}
        >
          {params.formattedValue}
        </Link>
      ) : null,
  },
  {
    field: "precision",
    headerName: "Precision",
    flex: 0.5,
    ...EDITABLE_COLUMN,
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      const newValue = params.props.value
      if (!params.hasChanged || !newValue) {
        return { ...params.props }
      }
      const keywords = newValue as string[]
      const hasError = keywords.length <= 0
      return { ...params.props, error: hasError || undefined }
    },
    renderCell: (params) => <KeywordsWidget {...params} />,
    renderEditCell: (params: GridRenderEditCellParams) => {
      const keywordsAmount = params.value?.length
      const buttonText = keywordsAmount
        ? `Edit ${keywordsAmount} keywords`
        : "Insert any keyword"

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button>{buttonText}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-120" hideWhenDetached>
            <KeywordInput {...params} />
          </PopoverContent>
        </Popover>
      )
    },
  },
]

interface UnknownMappingsTableProps {
  initialMappings: CodeMapping[]
}

const PAGINATION_OPTIONS = [5, 10, 25]

const UnknownMappingsTable = (props: UnknownMappingsTableProps & SxProps) => {
  const { initialMappings, ...sxProps } = props
  const [rows, setRows] = useState<CodeMapping[]>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  useEffect(() => {
    const editableInitialMappings: CodeMapping[] = initialMappings.map(
      (mapping) => ({ ...mapping }) as CodeMapping,
    )
    // We receive initialMappings from Redux.
    // So array and it's objects are immutable
    // Here, we deconstruct them to make new, mutable array and objects
    setRows(editableInitialMappings)
  }, [initialMappings])

  // console.log("Initial mappings", initialMappings)
  // console.log("Editable mappings", editableInitialMappings)
  // console.log("Our rows", rows)

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const handleEditClick = (id: GridRowId) => () => {
    /* , row: GridRowModel */
    // dispatch(selectMappingToEdit(row as CodeMapping))
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow } as CodeMapping
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const createActionsColumn = () => ({
    field: "actions",
    type: "actions",
    headerName: "Actions",
    cellClassName: "actions",
    ...AWESOME_COLUMN,
    hideable: false,
    minWidth: 100,
    getActions: (params: GridRowParams) => {
      const currentRow = params.row
      const { id } = params
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<CheckIcon />}
            label="Save"
            className="textPrimary"
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CloseIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ]
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)} // , currentRow
          color="inherit"
        />,
      ]
    },
  })

  const columnDefinitions = [...columns, createActionsColumn()]
  const headerCssSelector = `& .${HEADER_CSS_CLASS}`

  return (
    <DataGrid
      sx={{
        width: "100%",
        height: "100%",
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
        [headerCssSelector]: {
          backgroundColor: "#F0F0F0",
        },
        ...sxProps,
      }}
      editMode="row"
      columns={columnDefinitions}
      getRowClassName={(params) => {
        const rowIsFilled =
          params.row.goodsCode &&
          params.row.precision &&
          params.row.precision!!.length > 0
        return rowIsFilled ? "bg-sky-50 hover:bg-sky-700" : ""
      }}
      rows={rows}
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      processRowUpdate={processRowUpdate}
      rowSelection={false}
      disableColumnSelector
      initialState={{
        pagination: { paginationModel: { pageSize: PAGINATION_OPTIONS[0] } },
      }}
      pageSizeOptions={PAGINATION_OPTIONS}
    />
  )
}

export default memo(UnknownMappingsTable)