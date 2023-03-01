import { Breadcrumbs, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Image from 'next/image'

export const BreadcrumbsLabel = styled(Typography)({
  fontSize: '14px',
  color: "#36415D",
  '&:hover': {
    cursor: "pointer",
    color: "#F37229"
  },
})

export const CustomizedBreadcrumbs = styled(Breadcrumbs)({
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

export const ArrowIcon = styled(Image)({
  margin: "0px 5px",
});