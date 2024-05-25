import { memo, useCallback, useEffect, useState } from "react"
import {
  Box,
  Button,
  Collapse,
  Fade,
  Link,
  Skeleton,
  Stack,
  SxProps,
  Typography,
} from "@mui/material"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import RefreshIcon from "@mui/icons-material/Refresh"
import MainCard from "components/MainCard"
import UnknownMappingsTable from "components/data-health/UnknownMappingsTable"

import _ from "lodash"
import { useSelector } from "react-redux"
import {
  useGetCurrentUnknownMappingIdsQuery,
  useLazyGetCurrentUnknownMappingsQuery,
  useSaveFilledMappingsMutation,
} from "data/store/features/codemappings/UnknownCodeMappingsClient"
import {
  CodeMapping,
  IncompleteCodeMappingStorage,
  mappingIsFilled,
} from "data/store/features/codemappings/Types"
import {
  allMappingsSelector,
  mappingToEditSelector,
} from "data/store/api/DataHealthSelectors"

const CODES_REGISTRY_URL = import.meta.env.VITE_GOODS_CODE_REPOSITORY

const idsRefreshInterval = 5 * 1000

interface UnknownMappingsHeaderProps {
  onSaveAll: () => void
  itemsToSaveCount?: number
}

const UnknownMappingsHeader = memo(
  (props: UnknownMappingsHeaderProps & SxProps) => {
    const { onSaveAll, itemsToSaveCount, ...sxProps } = props
    const onSaveClick = useCallback(() => onSaveAll(), [onSaveAll])
    let saveAllText = "Save all"
    if (itemsToSaveCount !== undefined && itemsToSaveCount > 0) {
      saveAllText += `(${itemsToSaveCount})`
    }
    return (
      <Stack
        sx={{ height: "100%", p: 0, m: 0, ...sxProps }}
        direction="row"
        gap={2}
        alignItems="center"
      >
        <Typography variant="h5">Unknown codes</Typography>
        <Link
          underline="always"
          target="_blank"
          rel="noopener noreferrer"
          href={CODES_REGISTRY_URL} // external link
        >
          Public code base
        </Link>
        <Fade in={itemsToSaveCount !== undefined && itemsToSaveCount > 0}>
          <Button
            sx={{ marginLeft: "auto", color: "white" }}
            variant="contained"
            startIcon={<DoneAllIcon />}
            onClick={onSaveClick}
          >
            {saveAllText}
          </Button>
        </Fade>
      </Stack>
    )
  },
)

interface NewIdsNotificationProps {
  allMappings: IncompleteCodeMappingStorage
  onClick: () => void
}

const NewIdsNotification = memo(
  ({ allMappings, onClick, ...sxProps }: NewIdsNotificationProps & SxProps) => {
    useGetCurrentUnknownMappingIdsQuery(undefined, {
      pollingInterval: idsRefreshInterval,
    })
    const newMappingsCount =
      allMappings.recentKnownIds.length - allMappings.currentIds.length
    const mappingsMessageText =
      newMappingsCount > 0
        ? `New ${newMappingsCount} mappings`
        : "Mappings are up-to-date!"
    const messageColor = newMappingsCount > 0 ? "info" : "success"

    return (
      <Collapse in={newMappingsCount > 0}>
        <Button
          color={messageColor}
          onClick={onClick}
          sx={{
            width: "100%",
            border: 0,
            p: 0,
            m: 0,
            ...sxProps,
          }}
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={2}
            sx={{
              width: "100%",
              color: "white",
              backgroundColor: (theme) => theme.palette.info.main,
              p: 2,
            }}
          >
            <Typography variant="h5">{mappingsMessageText}</Typography>
            <RefreshIcon color="action" sx={{ color: "secondary" }} />
          </Stack>
        </Button>
      </Collapse>
    )
  },
)

const OVERLAY_FRAME_PROPS: SxProps = {
  top: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
  position: "absolute",
}

const mappingIsDirty = (mapping: CodeMapping): boolean =>
  (mapping.goodsCode !== undefined && _.trim(mapping.goodsCode).length > 0) ||
  (mapping.precision !== undefined && mapping.precision?.length > 0)

const UnknownMappingsSection = (props: SxProps) => {
  const { ...sxProps } = props

  const [pullMappings, { isLoading }] = useLazyGetCurrentUnknownMappingsQuery()
  const [filledMappingsCount, setFilledMappingsCount] = useState(0)

  const onPullClick = useCallback(() => {
    pullMappings()
  }, [pullMappings])
  useEffect(onPullClick, [pullMappings])
  const [saveAllMappings, { isLoading: isUpdating }] =
    useSaveFilledMappingsMutation()

  const allMappings = useSelector(allMappingsSelector)
  const [rows, setRows] = useState<CodeMapping[]>([])
  useEffect(() => {
    const rowsLayout = rows.reduce(
      (acc, nextMapping) => {
        acc[nextMapping.id] = nextMapping
        return acc
      },
      {} as Record<string, CodeMapping | undefined>,
    )
    // Merge data, received from the server with what we edited already
    const editableInitialMappings: CodeMapping[] = allMappings.mappings.map(
      (mappingFromServer) => {
        const prevValue = rowsLayout[mappingFromServer.id]
        if (prevValue !== undefined && mappingIsDirty(prevValue)) {
          return { ...prevValue, ...mappingFromServer }
        }
        return { ...mappingFromServer }
      },
    )
    setRows(editableInitialMappings)
  }, [allMappings.mappings])

  const onSaveAllClick = useCallback(() => {
    const mappingsToSave = rows
      .filter(mappingIsFilled)
      .map((mapping) => ({ ...mapping })) // De-reduxing
    saveAllMappings(mappingsToSave)
    setFilledMappingsCount(0)
  }, [allMappings, saveAllMappings])

  const mappingToEdit = useSelector(mappingToEditSelector)
  const onValueSubmit = (updatedMapping: CodeMapping) => {
    if (mappingIsFilled(updatedMapping)) {
      setFilledMappingsCount(filledMappingsCount + 1)
    } else {
      setFilledMappingsCount(Math.max(0, filledMappingsCount - 1))
    }
  }

  return (
    <MainCard
      title={
        <UnknownMappingsHeader
          onSaveAll={onSaveAllClick}
          itemsToSaveCount={filledMappingsCount}
        />
      }
      sx={{ ...sxProps }}
      contentSX={{
        p: 0,
        m: 0,
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minHeight: "1200px",
          height: "fit-content",
          position: "relative",
        }}
      >
        <Stack
          sx={{
            ...OVERLAY_FRAME_PROPS,
            zIndex: 1,
          }}
        >
          <NewIdsNotification allMappings={allMappings} onClick={onPullClick} />
          <UnknownMappingsTable
            rows={rows}
            setRows={setRows}
            mostRecentTimestamp={allMappings.mostRecentTimestamp}
            onRowUpdated={onValueSubmit}
          />
        </Stack>
        {isLoading || isUpdating ? (
          <Skeleton
            sx={{
              ...OVERLAY_FRAME_PROPS,
              zIndex: 2,
            }}
            variant="rectangular"
          />
        ) : null}
        <Fade in={mappingToEdit != null} timeout={300}>
          <Box
            sx={{
              ...OVERLAY_FRAME_PROPS,
              zIndex: 3,
            }}
          >
            {/* <UnknownMappingForm
              mappingToEdit={mappingToEdit}
              valueObserver={onValueSubmit}
            /> */}
          </Box>
        </Fade>
      </Box>
    </MainCard>
  )
}

export default memo(UnknownMappingsSection)
