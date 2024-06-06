import { memo, useCallback, useEffect, useState } from "react"
import { Box, Card, Fade, SxProps } from "@mui/material"
import ClusteredMap from "components/leaflet-maps/cluster-map"
import CategoriesLegend from "components/categories/CategoriesLegend"
import EmissionsByCluster from "components/emissions/clusters/EmissionsByCluster"
import {
  selectVisiblePoints as pointsSelector,
  selectAllVisibleCategoryEras,
} from "data/store/api/EmissionSelectors"

import { useSelector } from "react-redux"
import { useAppDispatch } from "data/store"
import { EmissionDataPoint } from "data/domain/types/emissions/EmissionTypes"
import type { RootState } from "data/store"

const ClusteredMapSection = ({ ...sxProps }: SxProps) => {
  const dispatch = useAppDispatch()
  const [tableCloseVeto, setTableCloseVeto] = useState(false)
  const [selectedClusterPoints, setSelectedClusterPoints] = useState<
    EmissionDataPoint[]
  >([])
  const onAnimationEndListener = useCallback(() => {
    setSelectedClusterPoints([])
    setTableCloseVeto(false)
  }, [dispatch, setTableCloseVeto])

  const onTableClose = useCallback(
    () => setTableCloseVeto(true),
    [setTableCloseVeto],
  )

  let categories = useSelector<RootState, string[]>(
    selectAllVisibleCategoryEras,
  )
  const dataPoints = useSelector(pointsSelector)

  useEffect(() => {
    if (categories?.length) {
      // We deconstruct here, because redux has immutable values
      categories = [...categories, "cluster"]
    }
  }, [categories])

  return (
    <Box
      sx={{
        width: "100%",
        height: "576px",
        position: "relative",
        ...sxProps,
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ClusteredMap
          dataPoints={dataPoints}
          onClusterPointsSelect={setSelectedClusterPoints}
        />
        <Fade in={categories.length > 0} timeout={300}>
          <Card
            sx={{
              zIndex: 1100,
              maxWidth: "80%",
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              px: "1rem",
              py: "10px",
              borderRadius: "10px",
            }}
            elevation={5}
          >
            <CategoriesLegend sx={{ px: "1rem" }} categories={categories} />
          </Card>
        </Fade>
      </Box>
      <Fade
        in={selectedClusterPoints?.length > 0 && !tableCloseVeto}
        timeout={300}
        onExited={onAnimationEndListener}
      >
        <Box
          style={{
            top: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          zIndex={1101}
        >
          <EmissionsByCluster
            cluster={selectedClusterPoints}
            onClose={onTableClose}
          />
        </Box>
      </Fade>
    </Box>
  )
}

export default memo(ClusteredMapSection)
