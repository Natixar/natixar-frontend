import {
  BusinessEntity,
  GeographicalArea,
} from "data/domain/types/participants/ContributorsTypes"
import {
  AlignedIndexes,
  EmissionCategory,
  EmissionProtocol,
} from "../types/emissions/EmissionTypes"
import { frCategoryMessages } from "../types/emissions/CategoryDescriptions"

/* If entityId corresponds to a manufacturing step or a business division,
 * look upwards in the hierarchy until a "company" is found.
 * Return the corresponding Entity object from alignedIndexes.
 */
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

/* Searches upwards from a referenced area until it finds a "top order area"
 * If the geoAreaId corresponds to a "top order area" the corresponding object
 * indexes.areas[geoAreaId] is returned immediately. */
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

const PROTOCOLS: string[] = Object.entries(EmissionProtocol)
  .map((entry) => entry[1])
  .map((protocol) => protocol.toLowerCase())
export const detectScope = (
  category: EmissionCategory,
  indexes: AlignedIndexes,
): EmissionCategory => {
  if (
    category.parent === undefined ||
    PROTOCOLS.includes(category.name.toLowerCase())
  ) {
    return category
  }

  const parent = indexes.categories[category.parent]
  if (PROTOCOLS.includes(parent.name.toLowerCase())) {
    return category
  }

  return detectScope(parent, indexes)
}

// Can be replaced with i18n later
export const getCategoryDescription = (categoryId: number) =>
  frCategoryMessages[categoryId]
