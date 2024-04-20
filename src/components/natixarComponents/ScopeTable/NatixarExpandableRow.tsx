import { CSSObject } from "@mui/material/styles"
import { Stack, Box, Collapse } from "@mui/material"
import { StackProps, SxProps } from "@mui/system"
import React from "react"

import {
  scopeColor,
  scopeTextColor,
} from "../CO2DonutSection/EmissionByScopeDonutSection"
import { UpArrowIcon } from "assets/icons/UpArrowIcon"
import { DownArrowIcon } from "assets/icons/DownArrowIcon"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { ScopeTable, ScopeTableItemProps } from "./index"

export interface NewScopeTableProps extends StackProps {
  active?: boolean
  onRowClicked: Function
  index: number
  data: ScopeTableItemProps[]
  bgcolor: string
  textColor: string
  title: string
}

export const NatixarExpandableRow = ({
  data,
  bgcolor = scopeColor[0],
  textColor = scopeTextColor[0],
  active = false,
  onRowClicked,
  index,
  title,
  ...props
}: NewScopeTableProps) => {
  const rows = data

  const total = formatEmissionAmount(data[0].value[1])

  const styleHeaderRow = (): CSSObject => ({
    padding: "12px 24px",
    borderRadius: "24px",
    backgroundColor: bgcolor,
    color: textColor,
    font: 'bold 20px/1 "Urbanist"',
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "all .3s",
    "&:hover": {
      filter: "brightness(1.05)",
    },
  })

  const handleClick = () => {
    onRowClicked(index)
  }

  props.sx = {
    ...props.sx,
    ...styleHeaderRow(),
  } as SxProps

  const stackProps: any = { ...props } as any

  return (
    <React.Fragment>
      <Stack {...stackProps} direction="row" onClick={handleClick}>
        <Box component="span" mr={1}>
          Scope {index + 1}
        </Box>
        <Collapse sx={{ flexGrow: 1, marginRight: 2 }} in={active}>
          <Stack
            direction="row"
            mx={3}
            gap={1}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box>{title}</Box>
            <Box>Total : {total}</Box>
          </Stack>
        </Collapse>
        {active && <UpArrowIcon customColor={textColor} />}
        {!active && <DownArrowIcon customColor={textColor} />}
      </Stack>

      <Collapse in={active}>
        <ScopeTable data={rows} />
      </Collapse>
    </React.Fragment>
  )
}
