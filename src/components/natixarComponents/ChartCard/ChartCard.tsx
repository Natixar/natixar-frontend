import {
  Box,
  Button,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { Dispatch, ReactNode, SetStateAction } from "react"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { NatixarSectionTitle } from "./NatixarSectionTitle"
import { CompareIcon } from "assets/icons/CompareIcon"
import MainCard from "components/MainCard"

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
}: ChartCardProps) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment) setSelectedSlot(newAlignment)
  }

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
        <Grid item xs={12}>
          {showCompareButton && setCompare && (
            <Stack direction="row" flexWrap="wrap" gap={2} mb={4}>
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
                      marginRight: 2,
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
            </Stack>
          )}

          <NatixarSectionTitle>Total Emissions</NatixarSectionTitle>
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
