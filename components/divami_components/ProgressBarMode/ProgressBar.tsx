import React from "react";
import {
  ToolTipContainer,
  ProgressBarStyling,
  StatusSymbolSection,
  ImageIcon,
  ToolTipChild,
  PercentageText,
  ToolImageIcon,
  ToolTipText,
  ProgressBarContainer,
  ScrollBarSection,
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
          <ToolTipContainer>
            <ToolTipChild>
              <ToolImageIcon src={completedIcon} alt="" />
              <ToolTipText>Completed</ToolTipText>
            </ToolTipChild>
          </ToolTipContainer>
        }
      >
        <StatusSymbolSection>
          <ImageIcon src={completedIcon} alt="completed" />
        </StatusSymbolSection>
      </LightTooltip>
      <ScrollBarSection>
        <ProgressBarStyling style={{ width: "90%" }}></ProgressBarStyling>
      </ScrollBarSection>
      <PercentageText>90%</PercentageText>
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
