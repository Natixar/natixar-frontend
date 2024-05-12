import { Box, Popover, SxProps, Tooltip, Typography } from "@mui/material"
import SensorsIcon from "@mui/icons-material/Sensors"
import SensorsOffIcon from "@mui/icons-material/SensorsOff"
import { useGetNetworkInformationQuery } from "data/store/features/networkIndication/NetworkCheckClient"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { TimeMeasurement } from "data/domain/types/time/TimeRelatedTypes"
import { selectEmissionRangeRequestParameters } from "data/store/api/EmissionSelectors"
import { formatISO, startOfMinute, startOfHour, startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear }  from "date-fns"
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

  const { timeRangeOfInterest, protocol } = useSelector(
    selectEmissionRangeRequestParameters,
  )
  const scale: string = `1${TimeMeasurement.MINUTES}`
  const requestParams: EmissionRangesRequest = useMemo(
    () =>
      ({
        protocol: formatProtocolForRangesEndpoint(protocol),
        scale,
        timeRanges: [
          {
            start: formatISOByScale(timeRangeOfInterest.start, scale),
            end: formatISOByScale(timeRangeOfInterest.end, scale),
            scale,
          },
        ],
      }) as EmissionRangesRequest,
    [protocol, timeRangeOfInterest],
  )
  function formatISOByScale(timestamp: number, fullscale: string): string {
    let scale = fullscale[fullscale.length - 1];
    let date = new Date(timestamp);  
    switch (scale) {
      case 'm':
        date = startOfMinute(date);
        break;
      case 'h':
        date = startOfHour(date);
        break;
      case 'd':
        date = startOfDay(date);
        break;
      case 'w':
        date = startOfWeek(date);
        break;
      case 'M':
        date = startOfMonth(date);
        break;
      case 'Q':
        date = startOfQuarter(date);
        break;
      case 'y':
        date = startOfYear(date);
        break;
      default:
        break;
    }
    return formatISO(date, { representation: 'complete' });
  }
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
