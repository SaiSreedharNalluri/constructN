import React from "react";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import Image from "next/image";
import closeIcon from "../../../../public/divami_icons/closeIcon.svg";
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
  
});
const CloseIcon = styled(Image)({
  cursor: "pointer",
  width: "20px",
  height: "20px",
  padding:"4px",
  borderRadius: "50%", 
  "&:hover": {
    background: '#EEEEEE'
    
  },
});
const Header = ({ closeNotifications }: any) => {
  const title =  "Notifications";
  return (
    <HeaderContainer>
      <TitleContiner>
        <span>{title}</span>
        <CloseIcon
          onClick={closeNotifications}
          src={closeIcon}
          alt={"close icon"}
        />
      </TitleContiner>
    </HeaderContainer>
  );
};

export default Header;
