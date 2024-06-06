import { useCallback, useEffect, useRef } from "react"

import L from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import { useMap } from "react-leaflet/hooks"
import MapMarker from "components/third-party/map/MapMarker"

import "leaflet/dist/leaflet.css"
import "./map-style.css"

import { formatAmount } from "data/domain/transformers/EmissionTransformers"
import { getColorByCategory } from "utils/CategoryColors"

const customIcon = new L.Icon({
  iconUrl: MapMarker,
  iconSize: new L.Point(40, 47),
})

const MIN_EMISSION = 2
const MAX_EMISSION = 200
const MIN_ICON_SIZE = 40
const MAX_ICON_SIZE = 130
const CLUSTER_RADIUS = MAX_ICON_SIZE * 1.75

const sizeByValue = (value) => {
  const clampedValue = Math.min(Math.max(value, MIN_EMISSION), MAX_EMISSION)

  const ratio = (clampedValue - MIN_EMISSION) / (MAX_EMISSION - MIN_EMISSION)
  const newSize = MIN_ICON_SIZE + ratio * (MAX_ICON_SIZE - MIN_ICON_SIZE)
  return Math.min(Math.max(newSize, MIN_ICON_SIZE), MAX_ICON_SIZE)
}

const createClusterCustomIcon = (cluster) => {
  // https://github.com/Leaflet/Leaflet.markercluster/blob/master/src/MarkerClusterGroup.js#L821
  const childCount = cluster.getChildCount()

  let category = "cluster"
  if (childCount > 0) {
    const childMarkers = cluster.getAllChildMarkers()
    category = childMarkers[0].options.dataPoint.categoryEraName
    const thereIsOtherCategory = childMarkers.some(
      (marker) => category !== marker.options.dataPoint.categoryEraName,
    )
    if (thereIsOtherCategory) {
      category = "cluster"
    }
  }
  category = category.toLowerCase()

  const amountLabel = formatAmount(childCount)

  const size = sizeByValue(childCount)
  const iconClass = `marker-cluster-category-${category}`
  // const opaqueCategoryColor = getOpaqueColorByCategory(category)
  const fillCategoryColor = getColorByCategory(category)

  return L.divIcon({
    html: `<div class="marker-cluster-icon" style="background:${fillCategoryColor}"><span>${amountLabel}</span></div>`,
    className: `cluster-icon-container ${iconClass}`,
    iconSize: L.point(size, size, true),
  })
}

// eslint-disable-next-line react/prop-types
const ClusterByCategoryLayer = ({ dataPoints, onClusterPointsSelect }) => {
  const clusterGroupRef = useRef()

  const map = useMap()

  const onClusterClick = useCallback(
    (e) => {
      if (!onClusterPointsSelect) {
        return
      }
      const childMarkers = e.layer.getAllChildMarkers()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const dataPoints = childMarkers.map(
        (cluster) => cluster.options.dataPoint,
      )
      onClusterPointsSelect(dataPoints)
    },
    [onClusterPointsSelect, dataPoints],
  )

  useEffect(() => {
    const markers = dataPoints
      // eslint-disable-next-line react/prop-types
      .filter((dataPoint) => dataPoint.location)
      .filter(
        (dataPoint) => dataPoint.location.lat > 0 && dataPoint.location.lon > 0,
      )
      .map((dataPoint) => {
        const address = dataPoint.location
        const marker = L.marker(new L.LatLng(address.lat, address.lon), {
          key: dataPoint.id,
          title: address.country,
          icon: customIcon,
          dataPoint,
        })
        return marker
      })

    const clusterGr = clusterGroupRef.current
    clusterGr.clearLayers()
    clusterGr.addLayers(markers)
    map.fitBounds(clusterGr.getBounds().pad(0.5), {
      animate: true,
    })
  }, [dataPoints])

  return (
    <MarkerClusterGroup
      chunkedLoading
      singleMarkerMode
      iconCreateFunction={createClusterCustomIcon}
      maxClusterRadius={CLUSTER_RADIUS}
      zoomToBoundsOnClick={false}
      spiderfyOnMaxZoom={false}
      onClick={onClusterClick}
      ref={clusterGroupRef}
    />
  )
}

export default ClusterByCategoryLayer
