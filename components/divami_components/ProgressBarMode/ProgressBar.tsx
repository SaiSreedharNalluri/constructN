import React from "react";
import {
  ChildBar,
  ParentBar,
  PercentageBar,
  UpperParent,
} from "./ProgressBarStyles";

const ProgressBar = () => {
  return (
    <UpperParent>
      <ParentBar>
        <ChildBar style={{ width: "90%" }}></ChildBar>
        <PercentageBar>90%</PercentageBar>
      </ParentBar>
    </UpperParent>
  );
};

export default ProgressBar;
