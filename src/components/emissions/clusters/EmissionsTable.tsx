import React, { memo } from "react"

import { TableVirtuoso, TableComponents } from "react-virtuoso"
import { Box, Link } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { CategoryLabel } from "components/categories/CategoriesLegend"
import _ from "lodash"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { EmissionDataPoint } from "data/domain/types/emissions/EmissionTypes"
import { useNavigate } from "react-router"

const tableLayout = {
  CONTRIBUTOR: "company",
  "DATA SOURCE": "company",
  EMISSIONS: (amount: number) => formatEmissionAmount(amount),
  "TYPE OF EMISSIONS": "category",
}

const VirtuosoTableComponents: TableComponents<EmissionDataPoint> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Box} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: () => <TableHead />,
  // eslint-disable-next-line react/prop-types
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
}

const fixedHeaderContent = () => (
  <TableRow>
    {Object.keys(tableLayout).map((columnName) => (
      <TableCell
        key={columnName}
        align={columnName === "EMISSIONS" ? "right" : "left"}
      >
        {columnName}
      </TableCell>
    ))}
  </TableRow>
)

function rowContent(_index: number, row: EmissionDataPoint) {
  const navigate = useNavigate()
  const handleLinkClick = () => {
    navigate(`/contributors/analysis/${row.companyId}`)
  }

  return (
    <>
      <TableCell key="company">
        <Link onClick={handleLinkClick}>{row.companyName}</Link>
      </TableCell>
      <TableCell key="data-source">ERP</TableCell>
      <TableCell key="emissionAmount" align="right">
        {formatEmissionAmount(row.totalEmissionAmount)}
      </TableCell>
      <TableCell key="category">
        <CategoryLabel category={_.capitalize(row.categoryEraName)} />
      </TableCell>
    </>
  )
}

const EmissionsByClusterTable = ({
  cluster,
}: {
  cluster: EmissionDataPoint[]
}) => {
  const data = [...cluster]
  const sortedEmissions = data.sort(
    (a, b) => b.totalEmissionAmount - a.totalEmissionAmount,
  )

  return (
    <TableVirtuoso
      data={sortedEmissions}
      components={VirtuosoTableComponents}
      fixedHeaderContent={fixedHeaderContent}
      itemContent={rowContent}
    />
  )
}

export default memo(EmissionsByClusterTable)
