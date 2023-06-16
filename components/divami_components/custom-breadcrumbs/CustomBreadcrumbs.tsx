import { Stack } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import breadcrumbsArrow from "../../../public/divami_icons/breadcrumbsArrow.svg";
import {
  CustomizedBreadcrumbs,
  ArrowIcon,
  BreadcrumbsLabel,
} from "./CustomBreadcrumbsStyles";

const CustomBreadcrumbs: React.FC<any> = ({
  breadCrumbData,
  handleBreadCrumbClick,
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
          {breadcrumbsConfig.length > 0 &&
            breadcrumbsConfig.slice(1).map((breadcrumb: any, index: number) => (
              <BreadcrumbsLabel
                key={breadcrumb + index}
                color="text.primary"
                onClick={() => handleBreadCrumbClick(breadcrumb, index)}
              >
                {breadcrumb?.name}
              </BreadcrumbsLabel>
            ))}
        </CustomizedBreadcrumbs>
      </Stack>
    </div>
  );
};

export default CustomBreadcrumbs;
