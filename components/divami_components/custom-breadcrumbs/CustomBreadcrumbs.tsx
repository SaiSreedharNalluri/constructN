import { Stack } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import breadcrumbsArrow from "../../../public/divami_icons/breadcrumbsArrow.svg";
import {
  CustomizedBreadcrumbs,
  ArrowIcon,
  BreadcrumbsLabel,
} from "./CustomBreadcrumbsStyles";
import { truncateString } from "../../../pages/projects";
import { ToolTipText } from "../ProgressBarMode/ProgressBarStyles";

const CustomBreadcrumbs: React.FC<any> = ({
  breadCrumbData,
  handleBreadCrumbClick,
  showFirstElement = false,
}) => {
  const [breadcrumbsConfig, setBreadcrumbsConfig] = useState<any>([
    breadCrumbData,
  ]);

  useEffect(() => {
    setBreadcrumbsConfig(breadCrumbData);
  }, [breadCrumbData]);

  return (
    <div>
      <Stack spacing={2}>
        <CustomizedBreadcrumbs
          separator={<ArrowIcon alt="arrow" src={breadcrumbsArrow} />}
          aria-label="breadcrumb"
        >
          {/* <Link href="/projects">
            <BreadcrumbsLabel color="text.primary">
              {breadcrumbsConfig[0]?.name}
            </BreadcrumbsLabel>
          </Link> */}
          {showFirstElement && breadcrumbsConfig.length ? (
            breadcrumbsConfig.map((breadcrumb: any, index: number) => (
              <ToolTipText title={breadcrumb?.name?.length > 50 ? breadcrumb?.name : ""}>
              <BreadcrumbsLabel
                key={breadcrumb + index}
                color="text.primary"
                onClick={() => handleBreadCrumbClick(breadcrumb, index)}
              >
                {truncateString(breadcrumb?.name,50)}
              </BreadcrumbsLabel>
              </ToolTipText>
            ))
          ) : !showFirstElement && breadcrumbsConfig.length ? (
            breadcrumbsConfig.slice(1).map((breadcrumb: any, index: number) => (
              <ToolTipText title={breadcrumb?.name?.length > 50 ? breadcrumb?.name : ""}>
              <BreadcrumbsLabel
                key={breadcrumb + index}
                color="text.primary"
                onClick={() => handleBreadCrumbClick(breadcrumb, index)}
              >
                {truncateString(breadcrumb?.name,50)}
              </BreadcrumbsLabel>
              </ToolTipText>
            ))
          ) : (
            <></>
          )}
        </CustomizedBreadcrumbs>
      </Stack>
    </div>
  );
};

export default CustomBreadcrumbs;
