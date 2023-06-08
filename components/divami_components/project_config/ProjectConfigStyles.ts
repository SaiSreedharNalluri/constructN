import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, Button, Checkbox, MenuItem, TextField } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { fontStyle } from "html2canvas/dist/types/css/property-descriptors/font-style";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";

export const ConfigurationBox = styled("div")({
  display: "flex",
  width:"585px",
  height: "360px",
});

export const SideMenuConfig = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // borderRight: "1px solid black",
  width: "140px",
  marginTop: "17px",
  //   height:"auto",
  // height: "98.5vh",
  //   transition: "0.3s",
  //   overflow: "hidden",
  // paddingTop: "35px",
  //   boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)",
});

export const MenuOuterOptionContainer = styled("div")({
  paddingLeft: "13px",
  marginBottom: "21px",
});

interface ContainerProps {
  issActive: boolean;
}
export const MenuOptionContainer = styled("div")((props: any) => ({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  //   color: "#101F4C",
  cursor: "pointer",
  borderRadius: props.isActive ? "30px" : "",
  border: props.isActive ? "3px solid #ECECEC" : "",
  padding: props.isActive ? "1px" : "",
})) as any;

export const MenuOptionSelected = styled("div")((props: any) => ({
  width: "128px",
  height: "27px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: props.isActive ? "500" : "400",
  fontSize: "14px",
  background: props.isActive ? "#F1742E" : "",

  borderRadius: props.isActive ? "30px" : "",

  color: props.isActive ? "white" : "#101F4C",
  paddingLeft: props.isActive ? "14px" : "",
  paddingRight: props.isActive ? "14px" : "",
  paddingTop: props.isActive ? "4px" : "",

  paddingBottom: props.isActive ? "3px" : "",

  //   background: props.isActive ? "red" : "blue",
})) as any;

export const ProjectConfigContent = styled("div")({
  background: "#E7E7E7",
  width: "100%",
  height: "auto",
  // overflowY:"scroll"
});

export const AvailableStateHeader = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "16px",
  color: " #101F4C",
  marginTop: "20px",
  marginLeft: "20px",
});

export const StyledTextField = styled(TextField)((props: any) => ({
  width: "380px",
  height: "44px !important",
  borderRadius: "4px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",
  marginLeft: "20px",
  marginTop: "20px",

  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    height: "40px",
    backgroundColor: "white",
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
})) as any;

export const TextFieldContainer = styled("div")({
  // border: "2px solid blue",
  display: "flex",
  alignItems: "center",
});

export const RemoveButton = styled("div")({
  cursor: "pointer",
  position: "relative",
  left: "-30px",
  top: "10px",
});

export const RemoveLogo = styled(Image)({});

export const AddButton = styled("div")({
  cursor: "pointer",
  position: "relative",
  left: "-10px",
  top: "10px",
});

export const AddButtonContainer = styled("div")({
  // cursor: "pointer",
  // position: "relative",
  // left:"-30px",
  // top:"10px"
});

export const AddLogo = styled(Image)({});
