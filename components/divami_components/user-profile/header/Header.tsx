import React from "react";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import Image from "next/image";
import closeIconCircle from "../../../../public/divami_icons/closeWithCircle.svg"
import { customHeaderState } from "../../../../models/IUtils";
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

const Header = ({ closeEditProject,id }: any) => {
  const getTitle=(headerTitle:string)=>{
    switch(headerTitle)
    {
      case customHeaderState.ChangePassword:
        return customHeaderState.ChangePassword
      case customHeaderState.MyProfile:
        return customHeaderState.MyProfile
      case customHeaderState.UploadsInProgress:
        return customHeaderState.UploadsInProgress
        default:
        return ''
    }

  }
  return (
    <HeaderContainer>
      <TitleContiner>
        <span>{getTitle(id)}</span>
        
        <div onClick={closeEditProject} className="rounded-full p-[6px] hover:bg-[#E7E7E7] cursor-pointer">
       {id==="ChangePassword"?"":<CloseIcon
          
         src={closeIconCircle}
          alt={"close icon"}
        />}
        </div>
        
      </TitleContiner>
    </HeaderContainer>
  );
};

export default Header;
