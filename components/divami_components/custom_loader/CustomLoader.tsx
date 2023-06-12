import * as React from "react";
import { styled } from "@mui/material/styles";
import { LoaderContainer, LoaderImage } from "./CustomLoaderStyles";
import closeIcon from "../../../public/divami_icons/ConstructLoader.svg";
import IssuesHighlightedIcon from "../../../public/divami_icons/IssuesHighlightedIcon.svg";

const CustomLoader = () => {
  return (
    <>
      <LoaderContainer>
        <LoaderImage src={closeIcon} alt="" />
      </LoaderContainer>
    </>
  );
};

export default CustomLoader;
