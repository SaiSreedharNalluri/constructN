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

});

export const NoResultText = styled("div")({
 fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
    color: "#101F4C",
  marginTop:"20px"

});