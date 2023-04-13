import React from "react";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import Image from "next/image";
import closeIcon from "../../../../public/divami_icons/closeIcon.svg";
// import closeIcon from '../../../public/divami_icons/closeIcon.svg'

const HeaderContainer = styled(Box)({
  backgroundColor: "white",
  height: "51px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderBottom: "1px solid #d9d9d9",
});
const TitleContiner = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: "20px",
  paddingRight: "20px",
  color: "#101F4C",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "20px",
});
const CloseIcon = styled(Image)({
  cursor: "pointer",
  width: "12px",
  height: "12px",
});

const Header = ({ closeIssueCreate, editData }: any) => {
  const title = editData ? "Edit Issue" : "Create Issue";
  return (
    <HeaderContainer>
      <TitleContiner>
        <span>{title}</span>
        <CloseIcon
          onClick={closeIssueCreate}
          src={closeIcon}
          alt={"close icon"}
          data-testid="closeIcon"
        />
      </TitleContiner>
    </HeaderContainer>
  );
};

export default Header;
