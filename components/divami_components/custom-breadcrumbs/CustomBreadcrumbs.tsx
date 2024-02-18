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
import {useRouter } from "next/router";
import { isMultiverseEnabled } from "../../../utils/constants";

const CustomBreadcrumbs: React.FC<any> = ({
  breadCrumbData,
  handleBreadCrumbClick,
  showFirstElement = false,
}) => {
  const [breadcrumbsConfig, setBreadcrumbsConfig] = useState<any>([
    breadCrumbData,
  ]);
const router = useRouter();

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
              <ToolTipText key={index} title={breadcrumb?.name?.length > 50 ? breadcrumb?.name : ""}>
              <BreadcrumbsLabel href={`/projects/${router.query.projectId}/sections`}
               key={index}        
                onClick={() => handleBreadCrumbClick(breadcrumb, index)}
                style={{color:"#36415D"}}
              >
                {truncateString(breadcrumb?.name,50)}
              </BreadcrumbsLabel>
              </ToolTipText>
            ))
          ) : !showFirstElement && breadcrumbsConfig.length ? (
            breadcrumbsConfig.slice(1).map((breadcrumb: any, index: number) => (
              <ToolTipText key={index} title={breadcrumb?.name?.length > 50 ? breadcrumb?.name : ""}>
              <BreadcrumbsLabel href={{pathname:!isMultiverseEnabled?`/projects/${router.query.projectId}/structure?structId=${router.query.projectId !== breadcrumb._id ? breadcrumb._id : ''}`:`/projects/[projectId]/structure/[structureId]/multiverseviewer`,query:{...router.query,structureId:breadcrumb._id}}}
               key={index}
                onClick={() => handleBreadCrumbClick(breadcrumb, index)}
                id={breadcrumb.parent===null?"black-text":router.query.structId===breadcrumb._id  ?"orange-text": "default"}
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
