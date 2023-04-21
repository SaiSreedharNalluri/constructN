import React from "react";
import {
  AssigneeList,
  ChildBar,
  ImageBar,
  ImageIcon,
  ParentBar,
  ParentToolDiv,
  PercentageBar,
  ToolImageIcon,
  ToolImg,
  ToolImgDiv,
  UpperParent,
} from "./ProgressBarStyles";
import completedIcon from "../../../public/divami_icons/completedIcon.svg";
import { styled } from "@mui/system";
import { Tooltip, TooltipProps, tooltipClasses } from "@mui/material";

const ProgressBar = (props: any) => {
  return (
    <UpperParent>
      <LightTooltip
        arrow
        title={
          <AssigneeList>
            <ParentToolDiv>
              <ToolImg>
                <ToolImageIcon src={completedIcon} alt="" />
              </ToolImg>
              <ToolImgDiv>Completed</ToolImgDiv>
            </ParentToolDiv>
          </AssigneeList>
        }
      >
        <ImageBar>
          <ImageIcon src={completedIcon} alt="completed" />
        </ImageBar>
      </LightTooltip>
      <ParentBar>
        <ChildBar style={{ width: "90%" }}></ChildBar>
      </ParentBar>
      <PercentageBar>90%</PercentageBar>
    </UpperParent>
  );
};

export default ProgressBar;

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    // color: "rgba(0, 0, 0, 0.87)",
    fontSize: 11,
    // position: "absolute",
    right: 5,
    borderRadius: "4px",
    top: 2,
    // width: "308px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    height: "10px !important",
    // left: "38px !important",
    marginBottom: "0px",
    "&:before": {
      background: "#FFFFFF",
      border: "1px solid #D9D9D9",
    },
    //  color: 'red',
  },
}));
