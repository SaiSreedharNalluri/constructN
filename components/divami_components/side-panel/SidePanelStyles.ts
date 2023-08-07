import { Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import Image from "next/image";

export const SideMenuContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // borderRight: "1px solid black",
  width: "59px",
  // height:"auto",
  height: "98.5vh",
  transition: "0.3s",
  overflow: "hidden",
  // paddingTop: "35px",
  boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)",
});

export const SideMenuOptionContainer = styled("div")({});

export const SideMenuOption = styled("div")({
  display: "flex",
});

export const OvershowImg = styled("div")({
  width: "62px",
  height: "62px",
  // width: "100%",
  // height:"100%",
  borderRadius: "100%",
  position: "absolute",
  left: "10px",
  zIndex: "1200",
  backgroundColor: "white",
  // borderRight: "1px solid #D9D9D9",
  borderTopWidth: "0",
  // border:"2px solid green"
  boxShadow: "10px 0px 8px -11px rgb(0 0 0 / 36%)",
});

export const SideMenuOptionImageContainer = styled("div")({
  display: "flex",

  justifyContent: "center",
  alignItems: "center",
  width: "59px",
  height: "59px",
  // borderBottomRightRadius:'50%',
  // borderTopRightRadius:'50%',
  borderRadius:'50%',
  
  '&:hover': {
    background: '#E7E7E7',
    border: "7px solid  #ffffff"
  },
});

export const SideMenuChatImageContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "59px",
  height: "59px",
  borderRadius:'50%',
  fill:"#515151",
  '&:hover': {
    background: '#FF843F',
    border: "7px solid  #ffffff",
    fill:"white"
  },
});
export const TooltipText = styled(Tooltip)({});

export const StyledImage = styled(Image)`
  cursor: pointer;
`;

export const HighlightedSytledImage = styled(Image)`
  cursor: pointer;
  position: absolute;
  margin-left: 6px;
  margin-top: 6px;
  width: 54px;
  height: 54px;
  z-index: 1200;
  // box-shadow:3px 0px 4px rgba(0, 0, 0, 0.25);
`;

// const SideMenuImageActive = styled(Image)({
//   cursor: 'pointer',
// })

// const SideMenuImageInActive = styled(Image)({
//   pointerEvents: 'none',
// })
