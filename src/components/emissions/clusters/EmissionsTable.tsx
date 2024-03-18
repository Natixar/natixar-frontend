import React, { memo } from "react"

import { TableVirtuoso, TableComponents } from "react-virtuoso"
import {
  Box,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { formatEmissionAmount } from "utils/formatAmounts"
import { CategoryLabel } from "components/categories/CategoriesLegend"
import _ from "lodash"
import { EmissionDataPoint } from "data/store/features/emissions/ranges/EmissionTypes"
import { EmissionsByClusterProps } from "./types"

const tableLayout = {
  CONTRIBUTOR: "company",
  "DATA SOURCE": "company",
  EMISSIONS: (amount: number) => formatEmissionAmount(amount),
  "TYPE OF EMISSIONS": "category",
}

const getCompanyUrl = (companyName: string): string =>
  import.meta.env.VITE_COMPANY_LINK_TEMPLATE + companyName

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
  TableHead,
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
  return (
    <>
      <TableCell key="company">
        <Link href={getCompanyUrl(row.companyName)}>{row.companyName}</Link>
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

const EmissionsByClusterTable = ({ cluster }: EmissionsByClusterProps) => {
  const data = [...cluster.dataPoints]
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
