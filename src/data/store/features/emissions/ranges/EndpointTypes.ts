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
// TODO: remove commented out code. The specification does not define a limitative
//       list of category taxonomies. The type is simply "string".
//       Ensure formatProtocolForRangesEndpoint() is called to generate properly
//       formatted query parameters.
//export type EndpointEmissionProtocol = "ghgprotocol" | "beges" | "begesv5"

export interface TimeRangeRequest {
  start: string
  end: string
  scale?: string
}

export interface EmissionRangesRequest {
  timeRanges: TimeRangeRequest[]
  protocol: string  // TODO: Remove wrong type: EndpointEmissionProtocol
  scale: TimeRangeScale
}

export type EmissionResponse = {
  data: EmissionRangesPayload[];
  status: number | undefined;
}

export const formatProtocolForRangesEndpoint = (
  protocol: DomainEmissionProtocol,
): string => {
  let result: string
  // The specified algorithm from the human-readable taxonomy name to
  // the 'protocol' query parameter is :
  // - Remove all white space
  // - Convert to lower case
  // - Convert accented letters to their ASCII equivalent (no URL encoding)
  // NFD is a form of normalization that converts all characters to their
  // canonical decomposition into their base character and the combining
  // diacritical mark.
  result = protocol.replace(/\s/g, "").toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
  return result
}
