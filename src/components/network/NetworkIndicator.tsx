import { Box, SxProps, Tooltip } from "@mui/material"
import SensorsIcon from "@mui/icons-material/Sensors"
import SensorsOffIcon from "@mui/icons-material/SensorsOff"
import { useGetNetworkInformationQuery } from "data/store/features/networkIndication/NetworkCheckClient"
import { memo, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { TimeMeasurement } from "data/domain/types/time/TimeRelatedTypes"
import { selectEmissionRangeRequestParameters } from "data/store/api/EmissionSelectors"
import { DateTime } from "luxon"
import {
  EmissionRangesRequest,
  formatProtocolForRangesEndpoint,
} from "data/store/features/emissions/ranges/EndpointTypes"
import {
  useGetEmissionRangesQuery,
  useLazyGetEmissionRangesQuery,
} from "data/store/features/emissions/ranges/EmissionRangesClient"

const NetworkIndicator = (props: SxProps) => {
  const { ...sxProps } = props
  const [getEmissionData] = useLazyGetEmissionRangesQuery()
  const { data, error } = useGetNetworkInformationQuery(undefined, {
    pollingInterval: 2000,
  })

  function alignedDates(
    startDate: DateTime,
    endDate: DateTime,
    resetUnits: any,
    incrementUnit: any,
  ) {
    let start = startDate.set(resetUnits)
    let end = endDate.set(resetUnits)

    if (incrementUnit === "quarter") {
      // custom for quarters
      start = start.set({ month: Math.floor((start.month - 1) / 3) * 3 + 1 })
      end = end.set({ month: Math.floor((end.month - 1) / 3) * 3 + 1 })
      if (startDate >= start) {
        end = end.plus({ month: 3 })
      }
    } else if (startDate >= start) {
      end = end.plus({ [incrementUnit]: 1 })
    }
    return { start, end }
  }

  function getAlignedDates(
    fullscale: string,
    startTimestamp: number,
    endTimestamp: number,
  ) {
    const startDate = DateTime.fromMillis(startTimestamp)
    const endDate = DateTime.fromMillis(endTimestamp)
    let result
    switch (fullscale[fullscale.length - 1]) {
      case "m":
        result = alignedDates(startDate, endDate, { second: 0 }, "minute")
        break
      case "h":
        result = alignedDates(
          startDate,
          endDate,
          { minute: 0, second: 0 },
          "hour",
        )
        break
      case "d":
        result = alignedDates(
          startDate,
          endDate,
          { hour: 0, minute: 0, second: 0 },
          "day",
        )
        break
      case "w":
        result = alignedDates(
          startDate,
          endDate,
          { hour: 0, minute: 0, second: 0, localWeekDay: 1 },
          "week",
        )
        break
      case "M":
        result = alignedDates(
          startDate,
          endDate,
          { hour: 0, minute: 0, second: 0, day: 1 },
          "month",
        )
        break
      case "Q":
        result = alignedDates(
          startDate,
          endDate,
          { hour: 0, minute: 0, second: 0, day: 1 },
          "quarter",
        )
        break
      case "y":
        result = alignedDates(
          startDate,
          endDate,
          { hour: 0, minute: 0, second: 0, day: 1, month: 1 },
          "year",
        )
        break
      default:
        result = { start: startDate, end: endDate }
        break
    }
    return { alignedStart: result.start, alignedEnd: result.end }
  }

  const { timeRangeOfInterest, protocol } = useSelector(
    selectEmissionRangeRequestParameters,
  )
  const scale: string = `1${TimeMeasurement.HOURS}`
  const requestParams: EmissionRangesRequest = useMemo(() => {
    const { alignedStart, alignedEnd } = getAlignedDates(
      scale,
      timeRangeOfInterest.start,
      timeRangeOfInterest.end,
    )
    return {
      protocol: formatProtocolForRangesEndpoint(protocol),
      scale,
      timeRanges: [
        {
          start: alignedStart.toFormat("yyyy-MM-dd'T'HH:mm:ssZZ"),
          end: alignedEnd.toFormat("yyyy-MM-dd'T'HH:mm:ssZZ"),
          scale,
        },
      ],
    } as EmissionRangesRequest
  }, [protocol, timeRangeOfInterest])

  useGetEmissionRangesQuery(requestParams, {
    pollingInterval: 3600000,
  })
  useEffect(() => {
    getEmissionData(requestParams)
  }, [requestParams])

  const networkIsOk = data && !error
  const popoverText = networkIsOk
    ? "Connected to server"
    : "Lost connection to the server. Contact admins for help."

  return (
    <Box sx={{ ...sxProps }}>
      <Tooltip title={popoverText}>
        {networkIsOk ? (
          <SensorsIcon color="success" />
        ) : (
          <SensorsOffIcon color="warning" />
        )}
      </Tooltip>
    </Box>
  )
}

export default memo(NetworkIndicator)
