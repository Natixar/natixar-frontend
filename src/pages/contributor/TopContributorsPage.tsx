import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons"
import { Button, Stack, Typography } from "@mui/material"
import MainCard from "components/MainCard"
import {
  selectAlignedIndexes,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import TopContributorsSection from "sections/contributor/emissions-by-scope/TopContributorsSection"
import { useAppDispatch } from "data/store"
import { clearFilterSelection } from "data/store/features/emissions/ranges/EmissionRangesSlice"
import Breadcrumb from "../../components/@extended/Breadcrumbs"

const TopContributorsPage = () => {
  const { scopeId: idStr } = useParams()
  const categoryId = parseInt(idStr!, 10)

  const alignedIndexes = useSelector(selectAlignedIndexes)
  const dataPointsForThisCompany = useSelector(selectVisiblePoints)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const goToContributors = () => {
    dispatch(clearFilterSelection())
    navigate(`/contributors/dashboard`)
  }

  if (!Number.isFinite(categoryId)) {
    console.log(`Unable to parse category id ${idStr}`)
    return null
  }

  const categoryName = alignedIndexes.categories[categoryId]?.name
  const scopeId = alignedIndexes.categories[categoryId]?.parent

  const links = [
    {
      title: "Dashboard",
      to: "/",
    },
    {
      title: `Category ${scopeId}`,
      to: `/contributors/scope/${scopeId}`,
    },
    {
      title: `${categoryName ?? "Total "} top contributors`, // For shorten name we can put top contributors to cat X 
      to: "",
    },
  ]

  return (
    <MainCard>
      <Stack gap={4}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          position="relative"
        >
          <Button
            onClick={() => navigate(-1)}
            sx={{ color: "primary.contrastText" }}
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
        <Typography variant="h3" fontWeight="bold">
          Top contributors of {categoryName}
        </Typography>
        <TopContributorsSection
          categoryId={categoryId}
          indexes={alignedIndexes}
          dataPoints={dataPointsForThisCompany}
        />
        <Button
          sx={{ color: "primary.contrastText", alignSelf: "center" }}
          variant="contained"
          onClick={goToContributors}
        >
          Go to Contributors page
        </Button>
      </Stack>
    </MainCard>
  )
}

export default TopContributorsPage
