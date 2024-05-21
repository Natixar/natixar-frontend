// material-ui
import { Button, Grid, Typography } from "@mui/material"
import { CategoryCard } from "sections/contributor/category-analysis/CategoryCard"
import { CategoryCalcTable } from "components/natixarComponents/CategoryCalcTable"
import MainCard from "components/MainCard"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeftOutlined } from "@ant-design/icons"

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

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: "30px" }}>
        Category Analysis
      </Typography>
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
