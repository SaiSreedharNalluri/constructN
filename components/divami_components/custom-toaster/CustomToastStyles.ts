import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box } from "@mui/material";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styled from 'styled-components';

export const ToastContainerDiv = styled("div")({
  borderRadius: "4px",

  marginLeft: "100px",
  maxWidth: "335px",
  border: "1px solid black",
  paddingLeft: "15px",
  paddingTop: "15px",
  paddingBottom: "15px",

  //   height: "100%",
  display: "flex",
  background: "rgba(255, 255, 255, 1)",
  boxShadow: "rgba(0, 0, 0, 0.3)",
  // alignItems:"center"
});

export const ToasFirstHalf = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const ToastImgContainer = styled("div")({});

export const ToasterIcon = styled(Image)({
  //   cursor: "pointer",
  width: "30px",
  height: "30px",
});

export const ToastTitleContainer = styled("div")({
  marginLeft: "10px",
});

export const ToastTitle = styled("div")({
  fontFamily: "Open Sans",
  fontSize: "14px",
  fontWeight: "400",
});

export const ToastImgCloseCont = styled("div")({
  marginLeft: "auto",
  paddingRight: "10px",
  marginTop: "-5px",
});

export const ToasterCloseIcon = styled(Image)({
  cursor: "pointer",
});

export const StyledToastContainer = styled(ToastContainer)``;
