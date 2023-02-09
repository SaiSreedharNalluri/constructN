import React from "react";
import { styled } from "@mui/system";

import { Box } from "@mui/material";
import Image from "next/image";
import closeIcon from "../../../../public/divami_icons/closeIcon.svg";
import MiniHeaderComponent from "../miniHeader/MiniHeader";

const HeaderContainer = styled(Box)`
  background-color: white;
  height: 51px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
`;

const TitleContiner = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`;

const CloseIcon = styled(Image)`
  cursor: pointer;
`;

const HeaderComponent = () => {
  const title = "Issue List";
  return (
    <div>
      <HeaderContainer>
        <TitleContiner>
          <span>{title}</span>

          <CloseIcon src={closeIcon} alt={"close icon"} />
        </TitleContiner>
      </HeaderContainer>
      <MiniHeaderComponent />
    </div>
  );
};

export default HeaderComponent;
