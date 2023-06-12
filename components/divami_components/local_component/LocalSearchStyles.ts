import { styled } from "@mui/system";
import Image from "next/image";

 

export const ShowErrorContainer = styled("div")({
    display: "flex",
    flexDirection:"column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
   height:"100%"
    
});


export const CenteredErrorImage = styled(Image)({
    marginTop:"70px"
    // marginLeft:"50%"
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
});

export const NoResultText = styled("div")({
 fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
//   textAlign: "center",
    color: "#101F4C",
  marginTop:"20px"
//    position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
});