import React from "react";
import {
  ChildBar,
  ParentBar,
  PercentageBar,
  UpperParent,
} from "./ProgressBarStyles";

const ProgressBar = (props: any) => {
  return (
    <UpperParent>
      <ParentBar>
        <ChildBar style={{ width: "90%" }}></ChildBar>
      </ParentBar>
      <PercentageBar>90%</PercentageBar>
    </UpperParent>
  );
};

export default ProgressBar;
