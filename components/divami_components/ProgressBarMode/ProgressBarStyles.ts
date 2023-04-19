import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, MenuItem, TextField } from "@mui/material";

export const UpperParent = styled("div")({
  display: "flex",
  /* justify-content: space-between; */
  textAlign: "center",

  alignItems: "center",
});

export const ParentBar = styled("div")({
  backgroundColor: "#e7e7e7",
  width: "80px",
  borderRadius: "15px",
  height: "10px",
});

export const ChildBar =styled("div")({
  backgroundColor: "rgb(116, 194, 92)",
  color: "white",
  textAlign: "right",
    fontSize: "20px",
    borderRadius: "15px",
  height:"10px"
});

export const PercentageBar=styled("div")({
 marginLeft:"10%"
});

