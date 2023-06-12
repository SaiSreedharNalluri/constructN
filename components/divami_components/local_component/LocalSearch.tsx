import React from "react";
import {
  CenteredErrorImage,
  NoResultText,
  ShowErrorContainer,
} from "./LocalSearchStyles";
import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";

const LocalSearch = () => {
  return (
    <ShowErrorContainer>
      <CenteredErrorImage src={projectHierIcon} alt="" />

      <NoResultText>No Result Found</NoResultText>
    </ShowErrorContainer>
  );
};

export default LocalSearch;
