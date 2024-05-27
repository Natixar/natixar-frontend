import {
  TimeRange,
  TimeSection,
  TimeWindow,
} from "data/domain/types/time/TimeRelatedTypes"
import { format, isSameYear, parse, subMonths } from "date-fns"
import { DateTime } from "luxon"

const FORMAT = {
  hour: " p",
  day: "PP",
  month: "MMM",
  month_with_year: "MMM yyyy",
  quarter: "Qq",
  quarter_with_year: "Qq yyyy",
  year: "yyyy",
}

const getDate = (timestamp: number) =>
  DateTime.fromMillis(timestamp, { zone: "utc+2" })

export const timestampToHour = (timestamp: number): string =>
  getDate(timestamp).toFormat(FORMAT.hour)

export const timestampToDay = (timestamp: number): string =>
  getDate(timestamp).toFormat(FORMAT.day)

export const timestampToMonth = (
  timestamp: number,
  showYear?: boolean,
): string =>
  getDate(timestamp).toFormat(showYear ? FORMAT.month_with_year : FORMAT.month)

export const timestampToQuarter = (
  timestamp: number,
  showYear?: boolean,
): string =>
  getDate(timestamp).toFormat(
    showYear ? FORMAT.quarter_with_year : FORMAT.quarter,
  )

export const timestampToYear = (timestamp: number): string =>
  getDate(timestamp).toFormat(FORMAT.year)

export const sortHours = (timeA: string, timeB: string): number =>
  parse(timeA, FORMAT.hour, new Date()).getTime() -
  parse(timeB, FORMAT.hour, new Date()).getTime()

export const sortDays = (timeA: string, timeB: string): number =>
  parse(timeA, FORMAT.day, new Date()).getTime() -
  parse(timeB, FORMAT.day, new Date()).getTime()

export const sortMonths = (timeA: string, timeB: string): number =>
  parse(timeA, "MMM yyyy", new Date()).getTime() -
  parse(timeB, "MMM yyyy", new Date()).getTime()

export const sortQuarters = (timeA: string, timeB: string): number =>
  parse(timeA, "QQQ yyyy", new Date()).getTime() -
  parse(timeB, "QQQ yyyy", new Date()).getTime()

export const compareTimeSections = (a: TimeSection, b: TimeSection): number =>
  b.year - a.year || a.name.localeCompare(b.name)

export const fillTimeSections = (
  begin: TimeSection,
  end: TimeSection,
): TimeSection[] => {
  if (begin.scale !== end.scale || compareTimeSections(begin, end) > 0) {
    return []
  }

  const currentTimeSection: TimeSection = { ...begin }
  const result: TimeSection[] = []
  do {
    result.push(currentTimeSection)
  } while (compareTimeSections(currentTimeSection, end) <= 0)
  return result
}

/* Computes step[slot mod n] from the API Specification-Data Endpoint
   using the expanded offsets array, which is 1 position longer than
   the number of slots. */
export const getTimeDeltaForSlot = (
  slotNumber: number,
  timeWindow: TimeWindow,
): number => timeWindow.timeOffsets[slotNumber + 1] - timeWindow.timeOffsets[slotNumber]

// Computes offset[slot] from the API Specification-Data Endpoint
export const getTimeOffsetForSlot = (
  slotNumber: number,
  timeWindow: TimeWindow,
): number => timeWindow.timeOffsets[slotNumber]

export const getTimeRangeFor = (scale: number): TimeRange => {
  const now = new Date().getTime()
  return { start: subMonths(now, Math.abs(scale)).getTime(), end: now }
}

export const getShortDescriptionForTimeRange = (
  timeRange: TimeRange,
): string => {
  const sameYear = isSameYear(timeRange.start, timeRange.end)
  return `${format(timeRange.start, sameYear ? "d MMM" : "d MMM y")} - ${format(timeRange.end, "d MMM y")}`
}

export const slotsAreInSameYear = (
  slotA: number,
  slotB: number,
  timeWindow: TimeWindow,
): boolean =>
  isSameYear(
    getTimeOffsetForSlot(slotA, timeWindow),
    getTimeOffsetForSlot(slotB, timeWindow),
  )
