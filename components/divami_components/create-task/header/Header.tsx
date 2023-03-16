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
  fontFamily: "Open Sans",
  fontWeight: "400",
  lineHeight: "20px",
  fontSize: "14px",
  color: "#101F4C",
});
const CloseIcon = styled(Image)({ cursor: "pointer" });

const Header = ({ closeTaskCreate, editData }: any) => {
  const title = editData ? "Edit Task" : "Create Task";
  return (
    <HeaderContainer>
      <TitleContiner>
        <span>{title}</span>
        <CloseIcon
          onClick={closeTaskCreate}
          src={closeIcon}
          alt={"close icon"}
          data-testid="const-custom-drawer-close-icon"
        />
      </TitleContiner>
    </HeaderContainer>
  );
};

export default Header;
