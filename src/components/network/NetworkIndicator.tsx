import { Box, Popover, SxProps, Tooltip, Typography } from "@mui/material"
import SensorsIcon from "@mui/icons-material/Sensors"
import SensorsOffIcon from "@mui/icons-material/SensorsOff"
import { useGetNetworkInformationQuery } from "data/store/features/networkIndication/NetworkCheckClient"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { TimeMeasurement } from "data/domain/types/time/TimeRelatedTypes"
import { selectEmissionRangeRequestParameters } from "data/store/api/EmissionSelectors"
import formatISO from "date-fns/formatISO"
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

  const { timeRangeOfInterest, protocol, timeMeasurement } = useSelector(
    selectEmissionRangeRequestParameters,
  )
  const scale: string = `1${timeMeasurement}`
  const requestParams: EmissionRangesRequest = useMemo(
    () =>
      ({
        protocol: formatProtocolForRangesEndpoint(protocol),
        scale,
        timeRanges: [
          {
            start: formatISO(timeRangeOfInterest.start, {
              representation: "date",
            }),
            end: formatISO(timeRangeOfInterest.end, { representation: "date" }),
            scale,
          },
        ],
      }) as EmissionRangesRequest,
    [protocol, timeRangeOfInterest, timeMeasurement],
  )
  useGetEmissionRangesQuery(requestParams, {
    pollingInterval: 10000,
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
