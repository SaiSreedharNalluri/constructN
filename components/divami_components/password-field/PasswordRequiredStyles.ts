import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, Button, Checkbox, MenuItem, TextField } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";

export const StyledMenu = styled(MenuItem)({
  padding: 0,
});
export const PasswordFieldSection = styled("div")({
  paddingTop: "20px",
  paddingLeft: "20px",
  paddingRight: "15px",
  paddingBottom: "20px",
  background: "#FFFFFF",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.16)",
  borderRadius: "4px",
  width: "340px",
  whiteSpace: "initial",
});

export const InstructionsHeader = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#101F4C",
  wordWrap: "break-word",
}) as any;

export const InstructionsSections = styled("div")({
  marginTop: "15px",
});

export const InstructionsContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const InstructionsElements = styled("div")({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
});

export const PasswordImageLogo = styled(Image)({});

export const PasswordInstrcutions = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#101F4C",
  marginLeft: "5px",
});
