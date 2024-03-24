// material-ui
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Popover,
  Select,
  SelectChangeEvent,
  Stack,
  SxProps,
  Typography,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { CategoryLabel } from "components/categories/CategoriesLegend"
import { CheckboxItem } from "components/natixarComponents/AreaCheckbox/CheckboxItem"
import { extractIdsOfIndex } from "data/domain/transformers/StructuralTransformers"
import { getTimeRangeFor } from "data/domain/transformers/TimeTransformers"
import {
  AlignedIndexes,
  EmissionFilterState,
  EmissionProtocol,
} from "data/domain/types/emissions/EmissionTypes"
import {
  BusinessEntity,
  GeographicalArea,
} from "data/domain/types/participants/ContributorsTypes"
import {
  IdTreeNode,
  IndexOf,
} from "data/domain/types/structures/StructuralTypes"
import { useAppDispatch } from "data/store"
import {
  selectAllVisibleCategoryEras as categoriesSelector,
  selectEmissionFilter as filterStateSelector,
  selectAlignedIndexes as indexesSelector,
  selectRequestTimeRange,
} from "data/store/api/EmissionSelectors"
import { useGetEmissionRangesQuery } from "data/store/features/emissions/ranges/EmissionRangesClient"
import {
  clearFilterSelection as clearFilterAction,
  selectTimeRange,
  updateFilterSelection as updateFilterAction,
} from "data/store/features/emissions/ranges/EmissionRangesSlice"
import { useGenerateReportMutation } from "data/store/features/reports/ReportGenerationClient"
import _ from "lodash"
import { ChangeEvent, memo, useCallback, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import ReportSendSection from "sections/reports/ReportSendSection"

// import { DateRangePicker, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const multiSelectJoiner = (selected: string[]) => selected.sort().join(", ")
const parseSelectedValues = (receivedValues: string | string[]): string[] =>
  receivedValues === "string"
    ? receivedValues.split(",").sort()
    : (receivedValues as string[])

function indexToCheckboxes<T>(
  indexedValues: IndexOf<T>,
  selectedItems: number[],
  nameFunc: (t: T) => string,
  checkCallback: (id: number, selected: boolean) => void,
  indexHierarchy: IdTreeNode[] | undefined,
): JSX.Element[] | null {
  if (!indexHierarchy) {
    return null
  }
  const checkboxes = indexHierarchy.map((treeItem) => {
    const indexId = treeItem.value
    const indexLabel = nameFunc(indexedValues[indexId])
    const onSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
      checkCallback(indexId, event.target.checked)
    }
    const itemIsSelected = selectedItems.includes(indexId)
    const childBoxItems = itemIsSelected
      ? []
      : indexToCheckboxes(
          indexedValues,
          selectedItems,
          nameFunc,
          checkCallback,
          treeItem.children,
        )

    return (
      <CheckboxItem
        key={indexLabel}
        onCheckedListener={onSelectionChange}
        label={indexLabel}
        isSelected={selectedItems.includes(indexId)}
      >
        <Stack direction="column" sx={{ pl: "1rem" }}>
          {childBoxItems}
        </Stack>
      </CheckboxItem>
    )
  })
  return checkboxes
}

const areasToCheckboxes = (
  areas: IndexOf<GeographicalArea>,
  selectedAreas: number[],
  treeItems: IdTreeNode[] | undefined,
  checkCallback: (id: number, selected: boolean) => void,
): JSX.Element[] | null =>
  indexToCheckboxes(
    areas,
    selectedAreas,
    (area) => area.name,
    checkCallback,
    treeItems,
  )

const entitiesToCheckboxes = (
  entities: IndexOf<BusinessEntity>,
  selectedEntities: number[],
  treeItems: IdTreeNode[] | undefined,
  checkCallback: (id: number, selected: boolean) => void,
): JSX.Element[] | null =>
  indexToCheckboxes(
    entities,
    selectedEntities,
    (entity) => entity.name,
    checkCallback,
    treeItems,
  )

const EntityControlForm = memo(
  ({
    allEntities,
    selectedEntities,
    selectedLabels,
    entityHierarchy,
    checkCallback,
  }: {
    allEntities: IndexOf<BusinessEntity>
    selectedEntities: number[]
    selectedLabels: string[]
    entityHierarchy: IdTreeNode[]
    checkCallback: (id: number, selected: boolean) => void
  }) => {
    const entityCheckboxes = entitiesToCheckboxes(
      allEntities,
      selectedEntities,
      entityHierarchy,
      checkCallback,
    )

    return (
      <FormControl sx={{ width: 220 }}>
        <InputLabel>Business Entity / Facility</InputLabel>
        <Select value={selectedLabels} renderValue={multiSelectJoiner} multiple>
          {entityCheckboxes}
        </Select>
      </FormControl>
    )
  },
)

const AreaControlForm = memo(
  ({
    selectedAreaLabels,
    allAreas,
    selectedAreas,
    areaHierarchy,
    checkCallback,
  }: {
    selectedAreaLabels: string[]
    allAreas: IndexOf<GeographicalArea>
    selectedAreas: number[]
    areaHierarchy: IdTreeNode[] | undefined
    checkCallback: (id: number, selected: boolean) => void
  }) => {
    const areaCheckboxes = areasToCheckboxes(
      allAreas,
      selectedAreas,
      areaHierarchy,
      checkCallback,
    )

    return (
      <FormControl sx={{ width: 160 }}>
        <InputLabel>Geographic Area</InputLabel>
        <Select
          value={selectedAreaLabels}
          renderValue={multiSelectJoiner}
          multiple
          sx={{
            "& .MuiList-root": {
              padding: "12px",
            },
          }}
        >
          {areaCheckboxes}
        </Select>
      </FormControl>
    )
  },
)

const CategoriesControlForm = memo(
  ({
    allCategories,
    selectedCategories,
    onSelectionChange,
  }: {
    allCategories: string[]
    selectedCategories: string[]
    onSelectionChange: (
      event: SelectChangeEvent<typeof selectedCategories>,
    ) => void
  }) => {
    const categoryNodes = allCategories
      .map((category) => _.capitalize(category))
      .map((category) => (
        <MenuItem key={category} value={category}>
          <CategoryLabel category={category} />
        </MenuItem>
      ))

    return (
      <FormControl sx={{ width: 100 }}>
        <InputLabel>Scope</InputLabel>
        <Select
          value={selectedCategories}
          renderValue={multiSelectJoiner}
          onChange={onSelectionChange}
          multiple
        >
          {categoryNodes}
        </Select>
      </FormControl>
    )
  },
)

const DateRangeControlForm = memo(() => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const timeRange = useSelector(selectRequestTimeRange)
  const dispatch = useAppDispatch()

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    },
    [setAnchorEl],
  )

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])

  const changeTimeRange = useCallback(
    (scale: number) => {
      const newTimeRange = getTimeRangeFor(scale)
      dispatch(selectTimeRange(newTimeRange))
    },
    [dispatch, selectTimeRange],
  )

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined
  const monthRanges = [6, 12, 24]

  return (
    <>
      <Button
        sx={{
          color: "primary.contrastText",
        }}
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        Date filter
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: ".5rem" }}>
          <Stack gap=".5rem">
            <Stack
              direction="row"
              gap=".5rem"
              alignItems="center"
              justifyContent="center"
            >
              <ButtonGroup>
                {monthRanges.map((monthsAmount) => (
                  <Button
                    key={monthsAmount}
                    variant="outlined"
                    onClick={() => changeTimeRange(monthsAmount)}
                  >
                    {monthsAmount} months
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
            <Stack gap="1rem" direction="row">
              <DatePicker label="From" value={timeRange.start} />
              <DatePicker label="To" value={timeRange.end} />
            </Stack>
          </Stack>
        </Paper>
      </Popover>
    </>
  )
})

const ReportGeneratorControl = memo(
  ({
    filter,
    indexes,
    ...sxProps
  }: {
    filter: EmissionFilterState
    indexes: AlignedIndexes
  } & SxProps) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [generateReport, { isLoading: isUpdating }] =
      useGenerateReportMutation()
    const onGenerateClick = useCallback(() => {
      const reportParams: EmissionFilterState = {
        selectedBusinessEntities:
          filter.selectedBusinessEntities.length > 0
            ? filter.selectedBusinessEntities
            : extractIdsOfIndex(indexes.entities),
        selectedGeographicalAreas:
          filter.selectedGeographicalAreas.length > 0
            ? filter.selectedGeographicalAreas
            : extractIdsOfIndex(indexes.areas),
        selectedCategories:
          filter.selectedCategories.length > 0
            ? filter.selectedCategories
            : extractIdsOfIndex(indexes.categories),
      }

      generateReport(reportParams)
      setOpen(false)
    }, [filter, generateReport, setOpen])

    return (
      <Box>
        <Button variant="outlined" onClick={handleOpen} sx={{ ...sxProps }}>
          Report
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ReportSendSection
            parameters={filter}
            indexes={indexes}
            onGenerateClick={onGenerateClick}
          />
        </Modal>
      </Box>
    )
  },
)

const GlobalFilterMenu = ({ ...sxProps }: SxProps) => {
  const dispatch = useAppDispatch()
  useGetEmissionRangesQuery({
    protocol: "ghgprotocol",
    scale: "m",
    timeRanges: [
      {
        start: "2023-01-01T00:00:00Z",
        end: "2023-01-02T00:00:00Z",
        scale: "m",
      },
    ],
  })

  const alignedIndexes = useSelector(indexesSelector)
  const allCategories = useSelector(categoriesSelector)
  const globalFilter = useSelector(filterStateSelector)

  const [selectedBusinessEntities, setSelectedBusinessEntities] = useState<
    number[]
  >(globalFilter.selectedBusinessEntities)
  const [selectedAreas, setSelectedAreas] = useState<number[]>(
    globalFilter.selectedGeographicalAreas,
  )
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    globalFilter.selectedCategories,
  )

  const entityLabel = useMemo(
    () =>
      selectedBusinessEntities
        .map((id) => alignedIndexes.entities[id].name)
        .toSorted(),
    [selectedBusinessEntities],
  )

  const areaLabel = useMemo(
    () => selectedAreas.map((id) => alignedIndexes.areas[id].name).toSorted(),
    [selectedAreas],
  )

  const onClearClick = useCallback(() => {
    dispatch(clearFilterAction())
    setSelectedBusinessEntities([])
    setSelectedAreas([])
    setSelectedCategories([])
  }, [dispatch, clearFilterAction])

  const onApplyClick = useCallback(() => {
    const newFilter: EmissionFilterState = {
      selectedBusinessEntities: [...selectedBusinessEntities],
      selectedGeographicalAreas: [...selectedAreas],
      selectedCategories: [...selectedCategories],
    }
    dispatch(updateFilterAction(newFilter))
  }, [
    dispatch,
    updateFilterAction,
    selectedBusinessEntities,
    selectedAreas,
    selectedCategories,
  ])

  const onAreaSelectionChange = useCallback(
    (id: number, selected: boolean) => {
      let newSelections: number[]
      if (selected) {
        newSelections = [...selectedAreas, id]
      } else {
        newSelections = selectedAreas.filter((areaId) => areaId !== id)
      }
      setSelectedAreas(newSelections)
    },
    [selectedAreas, setSelectedAreas],
  )

  const onEntitySelectionChange = useCallback(
    (id: number, selected: boolean) => {
      let newSelections: number[]
      if (selected) {
        newSelections = [...selectedBusinessEntities, id]
      } else {
        newSelections = selectedBusinessEntities.filter(
          (entityId) => entityId !== id,
        )
      }
      setSelectedBusinessEntities(newSelections)
    },
    [selectedBusinessEntities],
  )

  const onCategoriesSelectionChange = useCallback(
    (event: SelectChangeEvent<typeof selectedCategories>) => {
      const {
        target: { value },
      } = event
      const parsedValues = parseSelectedValues(value)
      setSelectedCategories(parsedValues)
    },
    [setSelectedCategories],
  )

  const { entities: availableEntities, areas: availableAreas } = alignedIndexes

  const weHaveAnyData =
    Object.keys(availableEntities).length &&
    Object.keys(availableAreas).length &&
    Object.keys(allCategories).length
  if (!weHaveAnyData) {
    return null
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2.5}
      sx={{
        width: "100%",
        ml: { xs: 0, md: 1, lg: -1 },
        p: 1,
        ...sxProps,
      }}
    >
      <Typography>Filter</Typography>
      <EntityControlForm
        allEntities={availableEntities}
        selectedEntities={selectedBusinessEntities}
        selectedLabels={entityLabel}
        entityHierarchy={alignedIndexes.entityHierarchy}
        checkCallback={onEntitySelectionChange}
      />

      <AreaControlForm
        selectedAreaLabels={areaLabel}
        allAreas={availableAreas}
        areaHierarchy={alignedIndexes.areaHierarchy}
        selectedAreas={selectedAreas}
        checkCallback={onAreaSelectionChange}
      />

      <CategoriesControlForm
        allCategories={allCategories}
        selectedCategories={selectedCategories}
        onSelectionChange={onCategoriesSelectionChange}
      />
      <DateRangeControlForm />

      <ButtonGroup disableElevation variant="contained">
        <Button
          sx={{
            color: "primary.contrastText",
          }}
          onClick={onApplyClick}
        >
          Apply
        </Button>
        <Button onClick={onClearClick} variant="outlined">
          Clear
        </Button>
      </ButtonGroup>

      <ReportGeneratorControl filter={globalFilter} indexes={alignedIndexes} />
    </Stack>
  )
}

export default GlobalFilterMenu
