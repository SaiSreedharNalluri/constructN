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

});

export const FormDiv = styled("div")({
  position: "absolute",
  right: "0",
  height: "100%",
  zIndex: "10",
  background: "white",

  filter: "drop-shadow(0px -4px 4px rgba(0, 0, 0, 0.25))",
});

export const FormContainerSign = styled("div")({
  width: "460px",
  borderRadius: "4px",

  paddingLeft: "60px",
  paddingRight: "60px",
  paddingTop: "30px",
});

export const SignInHeader = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "22px",
  color: "#36415D",
});

export const FormText = styled("div")({
  marginTop: "21px",
});


export const StyledTextField = styled(TextField)({
  width: "340px",
  height: "40px",
  borderRadius: "4px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",

  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    height: "40px",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #36415d",
  },

  "&:focus-within .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #F1742E !important",
  },

  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    height: "7px",
  },
});

export const StyledPasswordField = styled(TextField)({
  marginTop: "40px",
  width: "340px",
  height: "40px",

  borderRadius: "4px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #36415d",
  },

  "& .css-2ehmn7-MuiInputBase-root-MuiOutlinedInput-root": {
    height: "40px",
    "& fieldset": { border: "1px solid #36415d" },
  },
  "&:focus-within fieldset": {
    border: "1px solid #F1742E !important",
  },
  ".css-1o9s3wi-MuiInputBase-input-MuiOutlinedInput-input": {
    // background: 'red',
    height: "7px",
  },

});

export const ShowHideDiv = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "12px",
  color: "#36415D",
  cursor: "pointer",
});

export const ExtraTickDiv = styled("div")({
  marginTop: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const ParentTickDiv = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const CheckTickDiv = styled("div")({});

export const CheckTickBox = styled(Checkbox)({
  "& .MuiIconButton-root": {
    padding: 0,
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.5rem",
  },
});

export const RememberDiv = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#36415D",
  marginLeft: "10px",
});

export const ForgotDiv = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#36415D",
  marginLeft: "3px",
});

export const CustomSignInButton = styled(Button)({
  width: "340px",
  height: "40px",
  textTransform: "none",

  //   background: "#F1742E",
  //   border: "1px",
});

export const SignInContainedButton = styled(CustomSignInButton)({
  backgroundColor: "#f1742e !important",
  color: "#ffffff",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "16px",
  "&:hover": {
    backgroundColor: "#f1742e",
    color: "#ffffff",
  },
});

interface ContainerProps {
  buttonSearch: boolean;
}



export const ButtonSection = styled("div")<ContainerProps>`
  margin-top: ${(props) => (props.buttonSearch ? "21px" : "110px")};
  flex-direction: coloumn;
  justify-content: center;
  align-items: center;
`;


export const NewUserDiv = styled("div")({
  marginTop: "17px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#36415D",
});

export const NewUserSpan = styled("span")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#F1742E",
  cursor:"pointer"
});



export const ErrorSectonDiv =  styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  paddingTop:'12px',
  fontSize: "14px",
  color: "#f67c74",
});