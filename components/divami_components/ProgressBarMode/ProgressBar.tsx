import React from "react";
import {
  AssigneeListContainer,
  ScrollProgressChild,
  ImageSection,
  ImageIcon,
  ScrollProgressCont,
  ToolTipParentContainer,
  PercentageBar,
  ToolImageIcon,
  ToolImgContainer,
  ToolImgDiv,
  ProgressBarContainer,
} from "./ProgressBarStyles";
import completedIcon from "../../../public/divami_icons/completedIcon.svg";
import { styled } from "@mui/system";
import { Tooltip, TooltipProps, tooltipClasses } from "@mui/material";

const ProgressBar = (props: any) => {
  return (
    <ProgressBarContainer>
      <LightTooltip
        arrow
        title={
          <AssigneeListContainer>
            <ToolTipParentContainer>
              <ToolImgContainer>
                <ToolImageIcon src={completedIcon} alt="" />
              </ToolImgContainer>
              <ToolImgDiv>Completed</ToolImgDiv>
            </ToolTipParentContainer>
          </AssigneeListContainer>
        }
      >
        <ImageSection>
          <ImageIcon src={completedIcon} alt="completed" />
        </ImageSection>
      </LightTooltip>
      <ScrollProgressCont>
        <ScrollProgressChild style={{ width: "90%" }}></ScrollProgressChild>
      </ScrollProgressCont>
      <PercentageBar>90%</PercentageBar>
    </ProgressBarContainer>
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
