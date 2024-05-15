import { Button, Chip, Grid, Stack } from "@mui/material"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import IconButton from "components/@extended/IconButton"
import CategoriesLegend from "components/categories/CategoriesLegend"
import { getShortDescriptionForTimeRange } from "data/domain/transformers/TimeTransformers"
import {
  AlignedIndexes,
  EmissionFilterState,
  EmissionRetrievalParametersState,
} from "data/domain/types/emissions/EmissionTypes"
import { RootState } from "data/store"
import { ChartFilterItem } from "data/store/features/chartFilter/Types"
import { useGenerateReportMutation } from "data/store/features/reports/ReportGenerationClient"
import { memo, useCallback, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
// assets
import { DeleteOutlined } from "@ant-design/icons"
import { updateChartFilter } from "data/store/features/chartFilter/ChartFilterSlice"

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxWidth: "80%",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
}

const ReportParameterSection = memo(({ values }: { values: string[] }) => (
  <Stack direction="row" gap=".5rem" alignItems="center">
    {values.length === 0 ? (
      <Typography variant="h6">All</Typography>
    ) : (
      values.map((value) => (
        <Chip key={value} variant="filled" color="success" label={value} />
      ))
    )}
  </Stack>
))

const ScopesSection = memo(({ scopes }: { scopes: string[] }) =>
  scopes.length === 0 ? (
    <Typography variant="h6">All</Typography>
  ) : (
    <CategoriesLegend sx={{ spacing: ".3rem" }} categories={scopes} />
  ),
)

const ReportSendSection = ({
  parameters,
  indexes,
  requestParameters,
  onGenerateClick,
  handleClose,
}: {
  parameters: EmissionFilterState
  indexes: AlignedIndexes
  requestParameters: EmissionRetrievalParametersState
  onGenerateClick: VoidFunction
}) => {
  const dispatch = useDispatch()
  const { chartFilterState } = useSelector(
    (state: RootState) => state.chartFilterState,
  )
  const entityNames = parameters.selectedBusinessEntities.map(
    (entityId) => indexes.entities[entityId].name,
  )
  const geoAreaNames = parameters.selectedGeographicalAreas.map(
    (areaId) => indexes.areas[areaId].name,
  )
  const { protocol, timeRangeOfInterest } = requestParameters

  console.log(chartFilterState, "chartFilterState----")
  const handleRomoveChartFilter = useCallback(
    (id: string) => {
      const chartFilter = chartFilterState.filter((chart) => chart.id !== id)
      dispatch(updateChartFilter(chartFilter))
    },

    [chartFilterState],
  )
  // useMemo(() => {
  //   if (chartFilterState.length === 0) {
  //     handleClose()
  //   }
  // }, [chartFilterState.length])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      handleClose()
    }
  }

  return (
    <Paper sx={modalStyle}>
      <Stack direction="column" gap=".7rem">
        <Typography id="modal-modal-title" variant="h4" component="h2">
          Confirm generating report?
        </Typography>
        {chartFilterState.length !== 0 ? (
          <div>
            {chartFilterState.map((chart: ChartFilterItem) => (
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography
                    align="right"
                    variant="h6"
                    fontWeight="bold"
                    style={{ cursor: "pointer" }}
                    onClick={() => scrollToSection(chart.scrollId)}
                  >
                    {chart.name}:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  {chart.minDate.toDateString()} -{" "}
                  {chart.maxDate.toDateString()}
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleRomoveChartFilter(chart.id)}>
                    <DeleteOutlined />
                  </IconButton>
                </Grid>
                <img
                  src={chart.src}
                  alt={`Emmisons`}
                  style={{ width: "10rem", height: "auto", margin: "0 auto" }}
                  onClick={() => {
                    scrollToSection(chart.scrollId)
                  }}
                />
              </Grid>
            ))}

            {/* <Grid item xs={4}>
            <Typography align="right" variant="h6" fontWeight="bold">
              Business entities:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <ReportParameterSection values={entityNames} />
          </Grid>
          <Grid item xs={4}>
            <Typography align="right" variant="h6" fontWeight="bold">
              Geographical areas:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <ReportParameterSection values={geoAreaNames} />
          </Grid>
          <Grid item xs={4}>
            <Typography align="right" variant="h6" fontWeight="bold">
              Scopes:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <ScopesSection scopes={parameters.selectedCategories} />
          </Grid>

          <Grid item xs={4}>
            <Typography align="right" variant="h6" fontWeight="bold">
              Protocol:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6">{protocol}</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography align="right" variant="h6" fontWeight="bold">
              Date range:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6">
              {getShortDescriptionForTimeRange(timeRangeOfInterest)}
            </Typography>
          </Grid> */}
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Typography variant="h5" color="error">
              Please add Charts to proceed!
            </Typography>
          </div>
        )}
        <Button
          variant="contained"
          sx={{ color: "primary.contrastText" }}
          onClick={onGenerateClick}
          disabled={chartFilterState.length === 0}
        >
          Generate
        </Button>
      </Stack>
    </Paper>
  )
}

export default memo(ReportSendSection)
