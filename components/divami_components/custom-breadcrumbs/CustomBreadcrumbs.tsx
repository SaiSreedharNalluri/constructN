import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, breadcrumbsClasses, Stack, Typography } from '@mui/material';
import { styled } from "@mui/system";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import breadcrumbsArrow from "../../../public/divami_icons/breadcrumbsArrow.svg";

const BreadcrumbsLabel = styled(Typography)({
  fontSize: '14px',
  color: "#36415D",
  '&:hover': {
    cursor: "pointer",
    color: "#F37229"
  },
})

const CustomizedBreadcrumbs = styled(Breadcrumbs)({
  "& .MuiBreadcrumbs-separator": {
    padding: 0,
    margin: 0,
  },
  "& li:last-child p": {
    color: "#F37229"
  },
  "& li:first-child p": {
    color: "#36415D"
  }
})

const ArrowIcon = styled(Image)({
  margin: "0px 5px",
});

const CustomBreadcrumbs: React.FC<any> = ({ breadCrumbData, handleBreadCrumbClick }) => {
  const [breadcrumbsConfig, setBreadcrumbsConfig] = useState<any>([breadCrumbData])

  useEffect(() => {
    console.log("breadCrumbData", breadCrumbData);
    setBreadcrumbsConfig(breadCrumbData)
  }, [breadCrumbData])

  return (
    <div>
      <Stack spacing={2}>
        <CustomizedBreadcrumbs
          separator={<ArrowIcon alt="arrow" src={breadcrumbsArrow} />}
          aria-label="breadcrumb"
        >
          <Link href="/projects">
            <BreadcrumbsLabel color="text.primary">
              {breadcrumbsConfig[0]?.name}
            </BreadcrumbsLabel>
          </Link>
          {breadcrumbsConfig.length > 0 && breadcrumbsConfig.slice(1).map((breadcrumb: any, index: number) =>
            <BreadcrumbsLabel key={breadcrumb + index} color="text.primary" onClick={() => handleBreadCrumbClick(breadcrumb, index)}>
              {breadcrumb?.name}
            </BreadcrumbsLabel>)}
        </CustomizedBreadcrumbs>
      </Stack>
    </div>
  )
}

export default CustomBreadcrumbs
