import Drawer from "@mui/material/Drawer";
import { useState } from "react";
import { styled } from "@mui/system";

const StyledDrawer = styled(Drawer)`
  & .MuiPaper-root {
    width: 438px;
  }
`;

const CustomDrawer = (props: any) => {
  return (
    <div data-testid="const-custom-drawer">
      <StyledDrawer
        anchor={"right"}
        open={true}
        variant={props.variant?props.variant:"temporary"}
        data-testid="const-styled-drawer"
        // container={document.getElementById("test_full_screen")}

        // onClose={() => setOpenDrawer((prev) => !prev)}
      >
        {props.children}
        {/* listing of */}
      </StyledDrawer>
    </div>
  );
};

export default CustomDrawer;
