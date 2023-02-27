import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, breadcrumbsClasses, Stack, Typography } from '@mui/material';
import { styled } from "@mui/system";

const BreadcrumbsLabel = styled(Typography)({
  fontSize: '14px',
  color: "#36415D",
  '&:hover': {
    cursor: "pointer"
  }
})

const CustomizedBreadcrumbs = styled(Breadcrumbs)({
  "& .MuiBreadcrumbs-separator": {
    padding: 0,
    margin: 0,
  }
})

const CustomBreadcrumbs: React.FC<any> = ({ breadCrumbData, handleBreadCrumbClick }) => {
  const breadcrumbsConfig = breadCrumbData;
  return (
    <div>
      <Stack spacing={2}>
        <CustomizedBreadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbsConfig.map((breadcrumb: any, index: number) =>
            <BreadcrumbsLabel key={breadcrumb + index} color="text.primary" onClick={() => handleBreadCrumbClick(breadcrumb)}>
              {breadcrumb.name}
            </BreadcrumbsLabel>)}
        </CustomizedBreadcrumbs>
      </Stack>
    </div>
  )
}

export default CustomBreadcrumbs
