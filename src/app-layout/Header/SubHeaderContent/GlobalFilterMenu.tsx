// material-ui
import { ChangeEvent, memo, useCallback, useMemo, useState } from "react"
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  SxProps,
  Typography,
} from "@mui/material"
import { CategoryLabel } from "components/categories/CategoriesLegend"
import { useSelector } from "react-redux"
import _ from "lodash"
import {
  selectAlignedIndexes as indexesSelector,
  selectAllVisibleCategoryEras as categoriesSelector,
  selectEmissionFilter as filterStateSelector,
} from "data/store/api/EmissionSelectors"
import { useAppDispatch } from "data/store"
import { CheckboxItem } from "components/natixarComponents/AreaCheckbox/CheckboxItem"
import {
  clearFilterSelection as clearFilterAction,
  updateFilterSelection as updateFilterAction,
} from "data/store/features/emissions/ranges/EmissionRangesSlice"
import {
  BusinessEntity,
  GeographicalArea,
} from "data/domain/types/participants/ContributorsTypes"
import {
  IdTreeNode,
  IndexOf,
} from "data/domain/types/structures/StructuralTypes"
import {
  EmissionFilterState,
  EmissionProtocol,
} from "data/domain/types/emissions/EmissionTypes"
import { useGetEmissionRangesQuery } from "data/store/features/emissions/ranges/EmissionRangesClient"

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

const ProtocolControlForm = memo(() => {
  const protocols = Object.values(EmissionProtocol)
  const protocolItems = protocols.map((protocol) => (
    <MenuItem value={protocol}>{protocol}</MenuItem>
  ))
  const selectedProtocols = [protocols[0]]

  return (
    <FormControl sx={{ width: 220 }}>
      <InputLabel>Protocol</InputLabel>
      <Select value={selectedProtocols} renderValue={multiSelectJoiner}>
        {protocolItems}
      </Select>
    </FormControl>
  )
})

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

      <ProtocolControlForm />

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
    </Stack>
  )
}

export default GlobalFilterMenu
