import { Box, Typography } from "@mui/material"
import CloudIcon from "assets/images/icons/cloud.svg"
import { ReactNode } from "react"
import { Theme } from "@mui/material/styles"

interface NatixarSectionTitleProps {
  children?: ReactNode
}

export const NatixarSectionTitle = ({ children }: NatixarSectionTitleProps) => {
  const styleh5 = () => ({
    marginBottom: 8,
    color: 'primary.main',
    fontWeight: 'bold',
    fontSize: 24,
    position: 'relative',
  })

  const styleGreenUnderline = (theme: Theme) => ({
    width: 'fit-content',
    position: 'relative',
    "&::after": {
      content: '""',
      backgroundColor: theme.palette.success.main,
      position: 'absolute',
      bottom: -4,
      left: 0,
      width: "100%",
      height: '2px',
      borderRadius: 4,
    }
  })

  return (
    <Typography variant="h5" sx={styleh5}>
      <img src={CloudIcon} alt="Cloud icon" style={{
        marginRight: 8,
        position: 'relative',
        bottom: -4
      }} />
      <Box
        sx={styleGreenUnderline}
        component="span"
      >{children}</Box>
    </Typography>
  )
}
