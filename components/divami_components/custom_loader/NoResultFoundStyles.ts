import styled from "@emotion/styled";
import { Box, Button, TextField, Typography } from "@mui/material";
import Image from "next/image";


export const Container = styled("div")({
    position: "absolute",
    top:"50%",
    left: "50%",
    transform:"translate(-50%, -50%)"
});


export const GifContainer = styled("div")({
    display: "flex",
    justifyContent:"center",

});


export const LoaderImage = styled(Image)({

});

export const Content =styled("div")({
    textAlign: "center",
    
});

export const MainHeading =styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "18px",
  color: "rgba(16, 31, 76, 1)",
//   marginTop: "20px",
  lineHeight: "20px",
    
});


export const Paragraph =styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "12px",
  color: "rgba(16, 31, 76, 1)",
//   marginTop: "20px",
  lineHeight: "20px",
    
});