import { Box, Button, Grid, Stack, Typography } from "@mui/material"
import { Dispatch, ReactNode, SetStateAction, useCallback } from "react"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { NatixarSectionTitle } from "./NatixarSectionTitle"
import { CompareIcon } from "assets/icons/CompareIcon"
import MainCard from "components/MainCard"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from "uuid"
import IconButton from "components/@extended/IconButton"
import { PlusCircleOutlined } from "@ant-design/icons"
import { RootState } from "data/store"
import { ChartFilterState } from "data/store/features/chartFilter/Types"
import { updateChartFilter } from "data/store/features/chartFilter/ChartFilterSlice"

type ChartCardProps = {
  children: ReactNode
  title?: string
  value?: string | number
  selectedSlot?: string
  setSelectedSlot: (newSlot: string) => void
  slots?: string[]
  startDate: Date
  endDate: Date
  percentage?: number
  showCompareButton?: boolean
  compare?: boolean
  setCompare?: Dispatch<SetStateAction<boolean>>
}

const AmountLabel = ({
  value,
  percentage,
}: {
  value?: string | number
  percentage?: number
}) => {
  let color: string
  let arrowNode: JSX.Element | null

  if (typeof percentage === "undefined") {
    color = "primary"
    arrowNode = null
  } else {
    color = percentage > 0 ? "red" : "green"
    arrowNode = percentage > 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
  }

  return (
    <Stack
      width="fit-content"
      direction="row"
      justifyContent="center"
      alignItems="center"
      color={color}
      gap=".1rem"
      sx={{
        color,
      }}
    >
      {arrowNode}
      <Typography variant="h5">{value}</Typography>
      {arrowNode && (
        <Typography sx={{ ml: ".3rem", fontWeight: "bold" }}>
          ({percentage?.toFixed(2)}%)
        </Typography>
      )}
      <Typography variant="subtitle2" />
    </Stack>
  )
}

export const ChartCard = ({
  children,
  title,
  value,
  startDate,
  endDate,
  slots,
  selectedSlot,
  setSelectedSlot,
  percentage,
  showCompareButton,
  compare,
  setCompare,
  thumbnail,
  sectionId,
}: ChartCardProps) => {
  const { chartFilterState } = useSelector(
    (state: RootState) => state.chartFilterState,
  )
  const dispatch = useDispatch()

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment) setSelectedSlot(newAlignment)
  }
  const handleAddChartToReport = useCallback(
    (name: string, min: Date, max: Date, src: string, scrollId : string) => {
      const chartFilter: ChartFilterState = [
        ...chartFilterState,
        { id: uuidv4(), name, minDate: min, maxDate: max, src, scrollId },
      ]
      dispatch(updateChartFilter(chartFilter))
    },
    [chartFilterState],
  )
  
  return (
    <Stack
      sx={{
        width: "100%",
        padding: "24px",
        backgroundColor: "white",
        borderRadius: "4px",
      }}
    >
      <Grid
        container
        rowSpacing={2}
        justifyContent="space-between"
        justifyItems="stretch"
        alignItems="center"
      >
        <Grid item xs={12} id={`${sectionId}`}>
          <Stack direction="row" flexWrap="wrap" gap={1} mb={4}>
            {slots &&
              slots.map((timeDetailSlot: string) => (
                <Button
                  key={timeDetailSlot}
                  variant={
                    selectedSlot === timeDetailSlot ? "contained" : "outlined"
                  }
                  color={
                    selectedSlot === timeDetailSlot ? "success" : "primary"
                  }
                  sx={{
                    marginRight: 0,
                    fontSize: "18px",
                    minWidth: 110,
                    color: selectedSlot === timeDetailSlot ? "#fff" : "",
                  }}
                  onClick={(event) => handleChange(event, timeDetailSlot)}
                >
                  {timeDetailSlot}
                </Button>
              ))}
            <Box flexGrow={1}></Box>
            {showCompareButton && setCompare && (
              <Button
                variant="contained"
                color="primary"
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: compare ? "#1890FF" : "#fff",
                  borderColor: compare ? "#1890FF" : "#D9D9D9",
                }}
                onClick={() => setCompare(!compare)}
              >
                <CompareIcon
                  customColor={compare ? "#1890FF" : "#fff"}
                  sx={{ marginRight: 1 }}
                />
                Compare to previous year
              </Button>
            )}
          </Stack>
          <Box display="flex" >
            <NatixarSectionTitle>Total Emissions</NatixarSectionTitle>
            <IconButton
              sx={{ ml: 1 }}
              disabled={chartFilterState.some(
                (chart: any) => chart.name === title,
              )}
              onClick={() =>
                handleAddChartToReport(title, startDate, endDate, thumbnail, sectionId)
              }
            >
              <PlusCircleOutlined />
            </IconButton>
          </Box>
        </Grid>
        <MainCard
          sx={{ width: "100%", boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.25)" }}
        >
          <Stack flexDirection="row" justifyContent="space-between">
            <Box>
              <AmountLabel value={value} percentage={percentage} />
              {startDate && endDate && (
                <Typography variant="subtitle2" color="primary.main">
                  {`${compare ? "Compare: " : ""} ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
                </Typography>
              )}
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Urbanist",
                fontStyle: "normal",
                fontHeight: 700,
                fontSize: "24px",
                lineHeight: "29px",
                color: "#053759",
                fontWeight: "bold",
              }}
            >
              {title}
            </Typography>
          </Stack>
          {children}
        </MainCard>
      </Grid>
    </Stack>
  )
}
