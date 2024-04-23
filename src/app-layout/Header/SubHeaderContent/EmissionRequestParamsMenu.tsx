import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  SxProps,
  Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import ReportGeneratorControl from "components/reports/ReportGeneratorControl"
import { EmissionProtocol } from "data/domain/types/emissions/EmissionTypes"
import { useAppDispatch } from "data/store"
import {
  selectEmissionFilter as filterStateSelector,
  selectEmissionRangeRequestParameters,
  selectAlignedIndexes as indexesSelector,
} from "data/store/api/EmissionSelectors"
import { selectProtocol } from "data/store/features/emissions/ranges/EmissionRangesSlice"
import { memo, useCallback, useState } from "react"
import { useSelector } from "react-redux"

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Protocol = memo(
  ({
    selectedProtocol,
    ...sxProps
  }: { selectedProtocol: EmissionProtocol } & SxProps) => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const allProtocols = Object.values(EmissionProtocol)
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
      },
      [setAnchorEl],
    )

    const handleClose = useCallback(() => {
      setAnchorEl(null)
    }, [setAnchorEl])

    const selectProtocolCallback = useCallback(
      (newProtocol: EmissionProtocol) => {
        dispatch(selectProtocol(newProtocol))
        handleClose()
      },
      [dispatch, selectProtocol],
    )

    const open = Boolean(anchorEl)
    const id = open ? "simple-popover" : undefined

    return (
      <Box sx={{ ...sxProps }}>
        <Button
          variant="outlined"
          sx={{ height: "100%", color: `${theme.palette.grey[900]}` }}
          onClick={handleClick}
        >
          <Typography noWrap>{selectedProtocol}</Typography>
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <List sx={{ width: 220 }}>
            {allProtocols.map((protocol) => (
              <ListItem key={protocol} disablePadding>
                <ListItemButton
                  onClick={() => selectProtocolCallback(protocol)}
                >
                  <ListItemText primary={protocol} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Popover>
      </Box>
    )
  },
)

const RequestParametersControl = ({ ...sxProps }: SxProps) => {
  const requestParameters = useSelector(selectEmissionRangeRequestParameters)
  const alignedIndexes = useSelector(indexesSelector)
  const globalFilter = useSelector(filterStateSelector)

  return (
    <Stack direction="row" gap=".5rem" sx={{ height: "100%", ...sxProps }}>
      <ReportGeneratorControl
        indexes={alignedIndexes}
        filter={globalFilter}
        requestParameters={requestParameters}
      />
      <Protocol
        selectedProtocol={requestParameters.protocol}
        sx={{ height: "100%" }}
      />
    </Stack>
  )
}

export default RequestParametersControl
