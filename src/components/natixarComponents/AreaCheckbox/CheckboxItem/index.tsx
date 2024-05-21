import { Box, Checkbox, FormControlLabel } from "@mui/material"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { ChangeEvent, ReactElement, useState } from "react"
import IconButton from "../../../@extended/IconButton"

type CheckboxItemProps = {
  label: string
  indeterminate?: boolean
  onCheckedListener?: (event: ChangeEvent<HTMLInputElement>) => void
  isSelected?: boolean
  children?: ReactElement
}

export const CheckboxItem = ({
  label,
  onCheckedListener,
  isSelected,
  children,
  indeterminate = false,
}: CheckboxItemProps) => {
  const [expanded, setExpanded] = useState(isSelected)

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: "7px",
          padding: "0 12px",
        }}
      >
        <IconButton
          size="small"
          variant="outlined"
          disabled={isSelected}
          onClick={() => setExpanded(!expanded)}
          sx={{
            width: "24px",
            height: "24px",
            color: "#000",
            borderRadius: "2px",
            borderColor: "#D9D9D9",
            visibility: () =>
              children?.props.children.length ? "visible" : "hidden",
          }}
        >
          {expanded ? <MinusOutlined /> : <PlusOutlined />}
        </IconButton>
        <FormControlLabel
          label={label}
          control={
            <Checkbox
              checked={isSelected}
              onChange={onCheckedListener}
              indeterminate={indeterminate}
            />
          }
        />
      </Box>
      {expanded && children}
    </>
  )
}
