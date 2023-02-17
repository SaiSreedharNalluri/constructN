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
});
const CloseIcon = styled(Image)({ cursor: "pointer" });

const Header = ({ setOpenCreateTask, closeIssueCreate }: any) => {
  const title = "Create Issue";
  return (
    <HeaderContainer>
      <TitleContiner>
        <span>{title}</span>
        <CloseIcon
          onClick={closeIssueCreate}
          src={closeIcon}
          alt={"close icon"}
        />
      </TitleContiner>
    </HeaderContainer>
  );
};

export default Header;
