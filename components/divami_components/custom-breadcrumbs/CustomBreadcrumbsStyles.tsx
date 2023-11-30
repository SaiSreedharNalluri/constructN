import { Breadcrumbs, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Image from "next/image";

export const BreadcrumbsLabel = styled(Typography)({
  fontSize: "14px",
  color: "#36415D",
  fontFamily: "Open Sans",
  "&:hover": {
    cursor: "pointer",
    color: "#F1742E",
  },
});

export const CustomizedBreadcrumbs = styled(Breadcrumbs)({
  "& .MuiBreadcrumbs-separator": {
    padding: 0,
    margin: 0,
  },
  "& li:last-child p": {
    color: "#F1742E",
  },
  "& li:first-of-type p": {
    color: "#36415D",
  },
});

export const ArrowIcon = styled(Image)({
  margin: "0px 5px",
});
