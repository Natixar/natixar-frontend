import { useState } from "react"

// material-ui
import {
  Box,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  SxProps,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"

// project import
import MainCard from "components/MainCard"

// types
import { ThemeMode } from "types/config"
import { useSelector } from "react-redux"
import {
  selectAlignedIndexes,
  selectAllPoints,
} from "data/store/api/EmissionSelectors"
import { getColorByCategory } from "utils/CategoryColors"
import {
  detectScope,
  getCategoryDescription,
} from "data/domain/transformers/DataDetectors"
import { expandId } from "data/domain/transformers/StructuralTransformers"
import { filter, sum, summarize, tidy } from "@tidyjs/tidy"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { EmissionCategory } from "data/domain/types/emissions/EmissionTypes"
import useAsyncWork from "hooks/useAsyncWork"

interface CardState {
  scope?: EmissionCategory
  category?: EmissionCategory
  description?: string
  formattedEmissionAmount: string
}

export const CategoryCard = ({
  categoryId,
  ...sxProps
}: {
  categoryId: number
} & SxProps) => {
  const theme = useTheme()
  const [cardState, setCardState] = useState<CardState>({
    formattedEmissionAmount: "",
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const indexes = useSelector(selectAlignedIndexes)
  const allEmissions = useSelector(selectAllPoints)

  useAsyncWork(
    () => {
      const currentCategory = indexes.categories[categoryId]
      const scope = currentCategory
        ? detectScope(currentCategory, indexes)
        : undefined
      const description = getCategoryDescription(categoryId)
      const relevantCategories = categoryId
        ? expandId([categoryId], indexes.categoryHierarchy)
        : []
      const { totalCategoryEmissions } = tidy(
        allEmissions,
        filter((edp) => relevantCategories.includes(edp.categoryId)),
        summarize({ totalCategoryEmissions: sum("totalEmissionAmount") }),
      )[0]

      const formattedEmissionAmount = formatEmissionAmount(
        totalCategoryEmissions,
      )

      return {
        scope,
        category: currentCategory,
        description,
        formattedEmissionAmount,
      }
    },
    setCardState,
    [indexes, allEmissions],
  )

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index)
  }

  const { scope, category, description, formattedEmissionAmount } = cardState

  return (
    <MainCard sx={{ padding: 0, ...sxProps }}>
      <Stack spacing={6}>
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{ marginBottom: "15px", fontWeight: 400 }}
            variant="body2"
          >
            {scope && (
              <Box
                sx={{
                  bgcolor: getColorByCategory(scope.era),
                  px: "7px",
                  borderRadius: "3px",
                  width: "fit-content",
                }}
              >
                {scope.name}
              </Box>
            )}
          </Typography>
          <Box sx={{ paddingLeft: "5px" }}>
            {category && (
              <Typography
                sx={{ marginBottom: "15px", fontWeight: 400 }}
                variant="h3"
              >
                {category.name}
              </Typography>
            )}
            {description && (
              <Typography color="secondary">
                Description: {description}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            border: "1px solid",
            borderRadius: 1,
            borderColor:
              theme.palette.mode === ThemeMode.DARK
                ? theme.palette.divider
                : theme.palette.grey.A800,
            textAlign: "center",
          }}
        >
          <Typography sx={{ padding: 0.5 }} color="secondary">
            Total Emissions
          </Typography>
          <Typography sx={{ padding: 0.5, fontWeight: 800 }} variant="h5">
            {formattedEmissionAmount}
          </Typography>
        </Box>
        <Box
          sx={{
            border: "1px #dc2626 solid",
            borderRadius: "28px",
            padding: "20px",
          }}
          // remove above style when u remove fake data highlighter
        >
          <Typography
            sx={{ fontWeight: 500, marginBottom: "20px" }}
            variant="h5"
          >
            Subcategories
          </Typography>
          <List
            component="nav"
            sx={{
              p: 0,
              "& .MuiListItemIcon-root": {
                minWidth: 32,
                color: theme.palette.grey[500],
              },
            }}
          >
            <ListItemButton
              selected={selectedIndex === 0}
              onClick={() => handleListItemClick(0)}
            >
              <ListItemText primary="Road transportation" />
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 1}
              onClick={() => handleListItemClick(1)}
            >
              <ListItemText primary="Road transportation" />
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 2}
              onClick={() => handleListItemClick(2)}
            >
              <ListItemText primary="Road transportation" />
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 3}
              onClick={() => handleListItemClick(3)}
            >
              <ListItemText primary="Road transportation" />
            </ListItemButton>
          </List>
          <p
            style={{
              color: "#dc2626",
              margin: "0 auto",
              padding: "1rem 0",
              width: "fit-content",
            }}
          >
            Fake data Displayed
          </p>
        </Box>
      </Stack>
    </MainCard>
  )
}
