import Drawer from "@mui/material/Drawer";
import { useState } from "react";
import { styled } from "@mui/system";

const StyledDrawer = styled(Drawer)`
  & .MuiPaper-root {
    width: 438px;
    border-bottom : 2px solid #e7e7e7;
    border-top : 1px solid #e7e7e7;
    overflow:hidden;
  }
`;

const NotificationDrawer = (props: any) => {
  return (
    <div data-testid="const-custom-drawer">
      <StyledDrawer
        anchor={"right"}
        open={true}
        variant={props.variant?props.variant:"temporary"}
        data-testid="const-styled-drawer"
        // container={document.getElementById("test_full_screen")}
        // onClose={() => setOpenDrawer((prev) => !prev)}
        sx = {{
          '& .MuiDrawer-paper': {
            height : "calc(100vh - 90px) !important",
            top : "60px !important", 
          },
          borderBottom: "2px solid #d3d3d3"

        }}
            >
        {props.children}
        {/* listing of */}
      </StyledDrawer>
    </div>
  );
};

export default NotificationDrawer;
