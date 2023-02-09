import { styled } from "@mui/system";
import Image from "next/image";


export const SideMenuContainer = styled("div")({
display:"flex",
flexDirection:"column",
alignItems:"center",
borderRight:"1px solid black",
width:"59px",
// height:"auto",
 height: "98.5vh",
transition:"0.3s",
overflow:"hidden",
paddingTop:"35px",
});

export const  SideMenuOptionContainer = styled("div")()

export const  SideMenuOption =styled("div")({
display:"flex",

})

export const  SideMenuOptionImageContainer = styled("div")({
display:"flex",
justifyContent:"center",
alignItems:"center",
width:"59px",
height:"59px"
})

export const  StyledImage = styled(Image)`
  cursor: pointer;
`;

export const HighlightedSytledImage = styled(Image)`
  cursor: pointer;
  position:absolute;
  margin-left:18px;
  width:54px;
  height:54px;
  z-index:99999999;
`;

// const SideMenuImageActive = styled(Image)({
//   cursor: 'pointer',
// })

// const SideMenuImageInActive = styled(Image)({
//   pointerEvents: 'none',
// })
