import { Box, Button, Modal, SxProps } from "@mui/material"
import { extractIdsOfIndex } from "data/domain/transformers/StructuralTransformers"
import {
  AlignedIndexes,
  EmissionFilterState,
  EmissionRetrievalParametersState,
} from "data/domain/types/emissions/EmissionTypes"
import { useGenerateReportMutation } from "data/store/features/reports/ReportGenerationClient"
import { memo, useCallback, useState } from "react"
import ReportSendSection from "sections/reports/ReportSendSection"
import DownloadIcon from "@mui/icons-material/Download"

export interface ReportGeneratorControlProps {
  filter: EmissionFilterState
  indexes: AlignedIndexes
  requestParameters: EmissionRetrievalParametersState
}

const ReportGeneratorControl = ({
  filter,
  indexes,
  requestParameters,
  ...sxProps
}: ReportGeneratorControlProps & SxProps) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [generateReport] = useGenerateReportMutation()
  const onGenerateClick = useCallback(() => {
    const reportParams: EmissionFilterState = {
      selectedBusinessEntities:
        filter.selectedBusinessEntities.length > 0
          ? filter.selectedBusinessEntities
          : extractIdsOfIndex(indexes.entities),
      selectedGeographicalAreas:
        filter.selectedGeographicalAreas.length > 0
          ? filter.selectedGeographicalAreas
          : extractIdsOfIndex(indexes.areas),
      selectedCategories:
        filter.selectedCategories.length > 0
          ? filter.selectedCategories
          : extractIdsOfIndex(indexes.categories).map(
              (categoryId) => indexes.categories[categoryId].name,
            ),
    }

    generateReport(reportParams)
    setOpen(false)
  }, [filter, generateReport, setOpen])

  return (
    // @ts-nocheck
    <Box sx={{ ...(sxProps as SxProps) }}>
      <Button
        variant="outlined"
        endIcon={<DownloadIcon />}
        onClick={handleOpen}
      >
        Report
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ReportSendSection
          parameters={filter}
          indexes={indexes}
          onGenerateClick={onGenerateClick}
          requestParameters={requestParameters}
          handleClose={handleClose}
        />
      </Modal>
    </Box>
  )
}

export default memo(ReportGeneratorControl)
