import React from "react";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import Image from "next/image";
import closeIconCircle from "../../../../public/divami_icons/closeWithCircle.svg";
const HeaderContainer = styled(Box)({
  backgroundColor: "white",
  height: "51px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderBottom: "2px solid #d9d9d9",
});
const TitleContiner = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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
});
const Header = ({ closeNotifications }: any) => {
  const title =  "Notifications";
  return (
    <HeaderContainer>
      <TitleContiner>
        <span>{title}</span>
        <div className="rounded-full p-[6px] hover:bg-[#EEEEEE]">
        <CloseIcon
          onClick={closeNotifications}
          src={closeIconCircle}
          alt={"close icon"}
        />
        </div>
      </TitleContiner>
    </HeaderContainer>
  );
};

export default Header;
