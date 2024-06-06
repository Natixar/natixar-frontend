// material-ui
import { Theme } from "@mui/material/styles"
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@mui/material"

// project import
import useConfig from "hooks/useConfig"
import { MenuOrientation } from "types/config"
import DrawerHeader from "../../Drawer/DrawerHeader"

import EmissionFilterMenu from "./EmissionFilterMenu"
import EmissionRequestParamsMenu from "./EmissionRequestParamsMenu"
import { Stack } from "@mui/system"
import { Button } from "@mui/material"
import { useState } from "react"

// ==============================|| HEADER - CONTENT ||============================== //

const SubHeaderContent = () => {
  const { menuOrientation } = useConfig()

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"))

  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && (
        <DrawerHeader open />
      )}
      {!downLG && <EmissionFilterMenu />}
      {!downLG && <EmissionRequestParamsMenu />}

      {downLG && (
        <Stack display={"flex"} width={"100%"} flexDirection={"row"}>
          <Button onClick={() => setIsOpen(true)}>Filter</Button>
          <div style={{ flexGrow: 1 }}></div>
          <EmissionRequestParamsMenu />
        </Stack>
      )}

      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Filters"}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ marginTop: 2 }}
          >
            <EmissionFilterMenu closeDialog={handleClose} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SubHeaderContent
