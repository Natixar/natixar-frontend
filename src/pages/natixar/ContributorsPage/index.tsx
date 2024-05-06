import { Box, Button, Grid, Typography } from "@mui/material"
import MainCard from "components/MainCard"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons"
import Breadcrumb from "../../../components/@extended/Breadcrumbs"
import { FactoryTable } from "../../../components/natixarComponents/FactoryTable"

// table data
const createData = (title: string, value: number) => ({
  title,
  value,
})

const rows = [
  createData("Major Factory -  Italy", 90000),
  createData("Second Factory -  France", 40000),
  createData("Major Factory -  Italy", 20000),
  createData("Second Factory -  France", 16000),
  createData("Major Factory -  Italy", 11000),
]

const ContributorsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const scopeID = params.get("scopeID")

  const links = [
    {
      title: "Scopes",
      to: "/contributor/dashboard",
    },
    {
      title: `Scope ${scopeID} emissions`,
      to: `/contributor/scope/${scopeID}?scopeID=${scopeID}`,
    },
    {
      title: "Top contributors of transportation and distribution",
      to: "",
    },
  ]

  return (
    <MainCard>
      <Grid container rowSpacing={4.5} columnSpacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            padding="10px 0px"
          >
            <Button
              variant="contained"
              sx={{ color: "#FFF", position: "absolute", left: 0, top: 0 }}
              startIcon={<ArrowLeftOutlined color="#FFF" />}
              onClick={() => navigate(-1)}
            >
              Back to scope {scopeID}
            </Button>
            <Breadcrumb
              custom
              title={false}
              links={links}
              separator={RightOutlined}
              sx={{
                mb: "0px !important",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <Typography variant="h5">
            Top contributors of transportation and distribution
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <FactoryTable data={rows} />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          xl={12}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            variant="contained"
            sx={{ color: "#FFF", marginBottom: "15px" }}
            onClick={() => navigate("/contributor/dashboard")}
          >
            Go to top contributors page
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  )
}

export default ContributorsPage
