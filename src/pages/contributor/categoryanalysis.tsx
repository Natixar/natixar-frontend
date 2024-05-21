// material-ui
import { Button, Grid, Typography, Stack } from "@mui/material"
import { CategoryCard } from "sections/contributor/category-analysis/CategoryCard"
import { CategoryCalcTable } from "components/natixarComponents/CategoryCalcTable"
import MainCard from "components/MainCard"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons"
import { selectAlignedIndexes } from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import Breadcrumb from "../../components/@extended/Breadcrumbs"

// table data
const createData = (year: number, methodology: string, amount: number) => ({
  year,
  methodology,
  amount,
})

// TODO add data from API
const calculationMethods: any[] = [
  // createData(2024, "Emission Factors", 63.5),
]

const CategoryAnalysis = () => {
  const { id: idStr } = useParams()
  const scopeId = parseInt(idStr!, 10)
  const navigate = useNavigate()

  const alignedIndexes = useSelector(selectAlignedIndexes)
  const categoryName = alignedIndexes.categories[scopeId]?.name

  const links = [
    {
      title: "Dashboard",
      to: "/",
    },
    {
      title: `${categoryName ?? " Total "} top contributors`,
      to: "",
    },
  ]

  return (
    <>
      <Stack>
        <Button
          onClick={() => {
            navigate(-1)
          }}
          sx={{
            color: "primary.contrastText",
            width: "fit-content",
            marginBottom: "1.9rem",
          }}
          variant="contained"
          startIcon={<ArrowLeftOutlined color="primary.contrastText" />}
        >
          Back
        </Button>
        <Breadcrumb
          custom
          title={false}
          links={links}
          separator={RightOutlined}
          sx={{
            mb: "0px !important",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </Stack>
      <Typography variant="h5" sx={{ marginBottom: "30px" }}>
        Category Analysis
      </Typography>
      <Grid container rowSpacing={4.5} columnSpacing={3}>
        <Grid item xs={12} md={4}>
          <CategoryCard categoryId={scopeId} />
        </Grid>
        <Grid item xs={12} md={8}>
          <MainCard contentSX={{ p: "0 !important" }}>
            <Grid item xs={12} md={12} xl={12}>
              <Typography sx={{ p: "1.7rem" }} variant="h5">
                Calculation Method
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} xl={12}>
              <CategoryCalcTable data={calculationMethods} />
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </>
  )
}

export default CategoryAnalysis
