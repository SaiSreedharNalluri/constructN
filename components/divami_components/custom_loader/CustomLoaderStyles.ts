import styled from "@emotion/styled";
import { Box, Button, TextField, Typography } from "@mui/material";
import Image from "next/image";

export const LoaderContainer = styled("div")({
  position: "fixed",
  top: "0",
  left: "0",
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)" /* Add a semi-transparent background */,
  zIndex: 9999,
});


export const MiniLoaderContainer = styled("div")({
  height: "100%",
  width:"100%",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",

})

export const LoaderImage = styled(Image)({

});