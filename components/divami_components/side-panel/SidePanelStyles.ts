import { styled } from "@mui/system";
import { borderTopWidth } from "html2canvas/dist/types/css/property-descriptors/border-width";
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
  paddingTop: "35px",
  boxShadow:"0px 2px 3px rgba(0, 0, 0, 0.3)"
});

export const SideMenuOptionContainer = styled("div")();

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
  left:"10px",
  zIndex:"1500",
  backgroundColor: "white",
  // borderRight: "1px solid #D9D9D9",
  borderTopWidth:"0",
  // border:"2px solid green"
  boxShadow: "10px 0px 8px -11px rgb(0 0 0 / 36%)",

});

export const SideMenuOptionImageContainer = styled("div")({
  display: "flex",
  
  justifyContent: "center",
  alignItems: "center",
  width: "59px",
  height: "59px",
});

export const StyledImage = styled(Image)`
  cursor: pointer;
`;

export const HighlightedSytledImage = styled(Image)`
  cursor: pointer;
  position:absolute;
  margin-left:6px;
   margin-top:6px;
  width:54px;
  height:54px;
  z-index:1500;
  // box-shadow:3px 0px 4px rgba(0, 0, 0, 0.25);

`;

// const SideMenuImageActive = styled(Image)({
//   cursor: 'pointer',
// })

// const SideMenuImageInActive = styled(Image)({
//   pointerEvents: 'none',
// })
