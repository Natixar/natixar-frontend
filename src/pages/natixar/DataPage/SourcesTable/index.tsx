import {
  Chip,
  ChipProps,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

// project imports
import MainCard from "components/MainCard"

const fakeData = {
  public: [
    {
      id: 1,
      source: "Base empreinte",
      status: "up to date",
      lastUpdate: "recently accessed",
    },
    {
      id: 2,
      source: "Base agrobalyse",
      status: "up to date",
      lastUpdate: "recently accessed",
    },
  ],
  private: [
    {
      id: 3,
      source: "GrDF",
      status: "up to date",
      lastUpdate: "recently accessed",
    },
    {
      id: 4,
      source: "Klio",
      status: "partially up to date",
      lastUpdate: "not recently accessed",
    },
    {
      id: 5,
      source: "Accounting File",
      status: "missing mapping",
      lastUpdate: "not recently accessed",
    },
    {
      id: 6,
      source: "Accounting File",
      status: "missing mapping",
      lastUpdate: "not recently accessed",
    },
    {
      id: 7,
      source: "Accounting File",
      status: "up to date",
      lastUpdate: "recently accessed",
    },
  ],
}

const StatusDot = ({ type }: { type: string }) => {
  let color = "#22c55e"
  if (type === "partially up to date") {
    color = "#eab308"
  }
  if (type === "missing mapping") {
    color = "#ef4444"
  }
  return (
    <Tooltip title={type}>
      <div
        style={{
          borderRadius: "100%",
          width: 10,
          height: 10,
          marginLeft: "1rem",
          backgroundColor: color,
        }}
      />
    </Tooltip>
  )
}

const Row = ({
  data,
}: {
  data: {
    status: string
    id: number
    source: string
    lastUpdate: string
  }
}) => (
  <TableRow>
    <TableCell sx={{ pr: 3 }}>
      <StatusDot type={data.status} />
    </TableCell>
    <TableCell>{data.id}</TableCell>
    <TableCell>{data.source}</TableCell>
    <TableCell align="right">{data.lastUpdate}</TableCell>
  </TableRow>
)

const SourcesTable = ({ title }: { title: string }) => (
  <MainCard title={title} content={false}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ pl: 3, textTransform: "none" }}>Status</TableCell>
            <TableCell>#</TableCell>
            <TableCell sx={{ textTransform: "none" }}>Source</TableCell>
            <TableCell align="right" sx={{ pr: 3, textTransform: "none" }}>
              Last Update
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fakeData[
            title.split(" ")[0].toLowerCase() as "public" | "private"
          ].map((row, index) => (
            <Row data={row} key={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </MainCard>
)

export default SourcesTable
