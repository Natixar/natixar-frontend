import {
  BusinessEntity,
  GeographicalArea,
} from "data/domain/types/participants/ContributorsTypes"
import {
  AlignedIndexes,
  EmissionCategory,
  EmissionProtocol,
} from "../types/emissions/EmissionTypes"

export const detectCompany = (
  entityId: number,
  indexes: AlignedIndexes,
): BusinessEntity => {
  let entity = indexes.entities[entityId]
  while (
    entity &&
    entity.type !== "Company" &&
    entity.parent &&
    indexes.entities[entity.parent]
  ) {
    entity = indexes.entities[entity.parent]
  }
  return entity
}

export const TOP_ORDER_AREAS = ["World region", "Continent", "Country"]
export const detectCountry = (
  geoAreaId: number,
  indexes: AlignedIndexes,
): GeographicalArea => {
  let area = indexes.areas[geoAreaId]
  while (
    area.parent &&
    indexes.areas[area.parent] &&
    !TOP_ORDER_AREAS.includes(area.type)
  ) {
    area = indexes.areas[area.parent]
  }
  return area
}

const PROTOCOLS: string[] = Object.entries(EmissionProtocol).map(
  (entry) => entry[1],
)
export const detectScope = (
  category: EmissionCategory,
  indexes: AlignedIndexes,
): EmissionCategory => {
  if (category.parent === undefined || PROTOCOLS.includes(category.name)) {
    return category
  }

  const parent = indexes.categories[category.parent]
  if (PROTOCOLS.includes(parent.name)) {
    return category
  }

  return detectScope(parent, indexes)
}