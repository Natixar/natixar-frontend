import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RightOutlined } from "@ant-design/icons"
import { Button, Stack, Typography } from "@mui/material"
import MainCard from "components/MainCard"
import {
  selectAlignedIndexes,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import TopContributorsSection from "sections/contributor/emissions-by-scope/TopContributorsSection"
import { useAppDispatch } from "data/store"
import { clearFilterSelection } from "data/store/features/emissions/ranges/EmissionRangesSlice"
import useConfig from "hooks/useConfig"
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

  const { setIsShowExtraHeader } = useConfig()

  useEffect(() => {
    setIsShowExtraHeader(true)
  })

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
      title: `Category ${alignedIndexes.categories[categoryId].code ?? alignedIndexes.categories[categoryId].name}`,
      to: `/contributors/category-analysis/${scopeId}`,
    },
    {
      title: `${categoryName ?? "Total "} top contributors`,
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
          marginBlock="1rem"
        >
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
