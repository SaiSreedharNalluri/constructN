import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, Button, Checkbox, MenuItem, TextField } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { fontStyle } from "html2canvas/dist/types/css/property-descriptors/font-style";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";
import { Height } from "@mui/icons-material";

export const ConfigurationBox = styled("div")({
  display: "flex",
  
});

export const SideMenuConfig = styled("div")({
  position: "sticky",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  width: "140px",
  marginTop: "17px",
});

export const MenuOuterOptionContainer = styled("div")((props: any) => ({
  paddingLeft: props.isActive ? "23px" : "20px",
  marginBottom: props.isActive ? "25px" : "25px",
  borderRadius: props.isActive ? "30px" : "",
  borderRight: props.isActive ? "5px solid white" : "", // Add this line
})) as any;

export const MenuOptionContainer = styled("div")((props: any) => ({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
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
})) as any;

export const ProjectConfigContent = styled("div")({
  background: "#E7E7E7",
  width: "100%",
  height: "330px",
  overflowY: "scroll",
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
    border: props?.isHovered
      ? "1px solid #F1742E !important"
      : "1px solid #36415d",
  },

  "&:focus-within .MuiOutlinedInput-notchedOutline": {
    border: props?.isHovered
      ? "1px solid #F1742E !important"
      : "1px solid #36415d",
  },

  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    height: "7px",
  },
})) as any;

interface ContainerTextFieldProps {
  isHovered: boolean;
}

export const TextFieldContainer = styled("div")<ContainerTextFieldProps>({
  display: "flex",
  alignItems: "center",
});


export const RemoveButton = styled("div")((props: any) => ({
   cursor: "pointer",
  position: "relative",
  left: "-30px",
  top: props.errorPriority ? "-3px" : "10px", 
})) as any;

export const RemoveLogo = styled(Image)({
  width: "24px",
  height: "24px",
});

export const AddButton = styled("div")((props: any) => ({
 cursor: "pointer",
  position: "relative",
  left: "-10px",
  top: props.errorPriority ? "-3px" : "10px", 
})) as any;

export const AddButtonContainer = styled("div")({});

export const AddLogo = styled(Image)({
  width: "24px",
  height: "24px",
});