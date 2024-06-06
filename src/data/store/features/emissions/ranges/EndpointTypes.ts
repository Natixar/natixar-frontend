import {
  BusinessEntity,
  GeographicalArea,
} from "data/domain/types/participants/ContributorsTypes"
import {
  CompressedDataPoint,
  EmissionCategory,
  EmissionProtocol as DomainEmissionProtocol,
} from "../../../../domain/types/emissions/EmissionTypes"

export interface IndexesContainer {
  entity: BusinessEntity[]
  area: GeographicalArea[]
  category: EmissionCategory[]
}

export interface EndpointTimeWindow {
  start: string
  end: string
  step: number | number[]
}

export interface EmissionRangesPayload {
  time_range: EndpointTimeWindow
  indexes: IndexesContainer
  data: CompressedDataPoint[]
}

export type TimeRangeScale = "m" | "h" | "d" | "w" | "M" | "Q" | "y"
export type EndpointEmissionProtocol = "ghgprotocol" | "beges" | "begesv5"

export interface TimeRangeRequest {
  start: string
  end: string
  scale?: string
}

export interface EmissionRangesRequest {
  timeRanges: TimeRangeRequest[]
  protocol: EndpointEmissionProtocol
  scale: TimeRangeScale
}

export type EmissionResponse = {
  data: EmissionRangesPayload[];
  status: number | undefined;
}

export const formatProtocolForRangesEndpoint = (
  protocol: DomainEmissionProtocol,
): EndpointEmissionProtocol => {
  let result: EndpointEmissionProtocol
  switch (protocol) {
    case DomainEmissionProtocol.GHG:
      result = "ghgprotocol"
      break
    case DomainEmissionProtocol.BEGES:
      result = "beges"
      break
    case DomainEmissionProtocol.BEGESV5:
      result = "begesv5"
      break
    default:
      result = "ghgprotocol"
      break
  }
  return result
}
