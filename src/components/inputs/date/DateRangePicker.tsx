import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Popover,
  Stack,
  SxProps,
  Typography,
} from "@mui/material"
import { DatePicker, DateRangeIcon } from "@mui/x-date-pickers"
import {
  getShortDescriptionForTimeRange,
  getTimeRangeFor,
} from "data/domain/transformers/TimeTransformers"
import { TimeRange } from "data/domain/types/time/TimeRelatedTypes"
import { useAppDispatch } from "data/store"
import { selectTimeRange } from "data/store/features/emissions/ranges/EmissionRangesSlice"
import { memo, useCallback, useMemo, useState } from "react"

const DateRangeControlForm = ({
  timeRange,
  ...sxProps
}: { timeRange: TimeRange } & SxProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
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
    [dispatch, selectTimeRange, timeRange],
  )

  const startChangeCallback = useCallback(
    (startTime: Date | null) => {
      if (startTime === null) {
        return
      }
      const newTimeRange: TimeRange = {
        start: Math.min(startTime.getTime(), timeRange.end),
        end: timeRange.end,
      }
      dispatch(selectTimeRange(newTimeRange))
    },
    [dispatch, selectTimeRange],
  )

  const endChangeCallback = useCallback(
    (endTime: Date | null) => {
      if (endTime === null) {
        return
      }
      const newTimeRange: TimeRange = {
        start: timeRange.start,
        end: Math.max(endTime.getTime(), timeRange.start),
      }
      dispatch(selectTimeRange(newTimeRange))
    },
    [dispatch, selectTimeRange],
  )

  const timeRangeStr = useMemo(
    () => getShortDescriptionForTimeRange(timeRange),
    [timeRange],
  )

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined
  const monthRanges = [6, 12, 24]

  return (
    <Box
      sx={{
        ...sxProps,
      }}
    >
      <Button
        aria-describedby={id}
        variant="outlined"
        color="primary"
        onClick={handleClick}
        endIcon={<DateRangeIcon />}
      >
        <Typography noWrap>{timeRangeStr}</Typography>
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
        <Paper elevation={3} sx={{ p: "1rem" }}>
          <Stack gap="1rem">
            <Stack
              direction="row"
              gap="1.5rem"
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
            <Stack gap="1.5rem" direction="row">
              <DatePicker
                sx={{ width: "10rem" }}
                label="From"
                value={new Date(timeRange.start)}
                onChange={startChangeCallback}
              />
              <DatePicker
                sx={{ width: "10rem" }}
                label="To"
                value={new Date(timeRange.end)}
                onChange={endChangeCallback}
              />
            </Stack>
          </Stack>
        </Paper>
      </Popover>
    </Box>
  )
}

export default memo(DateRangeControlForm)
