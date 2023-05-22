import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, Button, Checkbox, MenuItem, TextField } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";

export const SectionShowcase = styled("section")({
  position: "absolute",
  right: "0",
  width: "100%",
  minHeight: "100vh",
  padding: "100px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: "2",

  // border: "2px solid blue",
});

export const HeaderContainer = styled("header")({
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  zIndex: "1000",
  paddingTop: "23px",
  paddingLeft: "30px",
});

export const HeaderImageLogo = styled(Image)({});

export const IllustrationBackground = styled(Image)({
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  //   opacity: "0.8",
});

export const Overlay = styled("div")({
  //   position: "absolute",
  //   top: "0",
  //   left: "0",
  //   width: "100%",
  //     height: "100%",
  //   mixBlendMode: "overlay",
});

export const FormDiv = styled("div")({
  position: "absolute",
  right: "0",
  height: "100%",
  zIndex: "10",
  background: "white",
  //   border: "2px solid blue",

  // border: "2px solid blue",
  //   boxShadow:"rgba(0, 0, 0, 0.25)"
  filter: "drop-shadow(0px -4px 4px rgba(0, 0, 0, 0.25))",
});

export const FormContainerSign = styled("div")({
  width: "460px",
  borderRadius: "4px",

  paddingLeft: "60px",
  paddingRight: "60px",
  paddingTop: "68px",
});

export const FormHeader = styled("div")({
  display: "flex",
  // justifyContent:"center"
});

export const SignInHeader = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "22px",
  color: "#36415D",
  marginLeft: "10px",
});

export const MessageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "87px",
  // justifyContent:"center"
});

export const DrawerImageLogo = styled(Image)({});

export const CheckInboxText = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#36415D",
  marginTop: "20px",
  lineHeight: "20px",
});

export const LinkEmailText = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#36415D",
  marginTop: "10px",
  lineHeight: "20px",
});

export const ChangeMailText = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#FD5B0E",
  marginTop: "10px",
  lineHeight: "24px",
  cursor:"pointer"
});

export const RecieveMailText = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#36415D",
  marginTop: "10px",
  lineHeight: "19px",
  position: "absolute",
  bottom: "7%",
});



export const SpanResend  = styled("span")({
  color: "#FD5B0E",
  height: "19px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
    textAlign: "center",
  marginLeft: "2px",
    cursor:"pointer"
  
});