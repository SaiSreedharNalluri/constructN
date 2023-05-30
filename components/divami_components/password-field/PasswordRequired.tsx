import React, { useState } from "react";
import {
  InstructionsContainer,
  InstructionsElements,
  InstructionsHeader,
  InstructionsSections,
  PasswordFieldSection,
  PasswordImageLogo,
  PasswordInstrcutions,
  StyledMenu,
} from "./PasswordRequiredStyles";
import iconCompleted from "../../../public/divami_icons/iconCompleted.svg";
import PasswordError from "../../../public/divami_icons/PasswordError.svg";
import { Menu } from "@mui/material";
import Popover from "@mui/material";

const PasswordRequired = ({ showPasswordMenu }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(true);
  const handleSortMenuClose = () => {
    setIsSortMenuOpen(false);
    setAnchorEl(null);
  };
  return (
    <Menu
      anchorEl={anchorEl}
      id="password-menu"
      open={isSortMenuOpen}
      onClose={handleSortMenuClose}
      onClick={handleSortMenuClose}
      // sx={{
      //   top: "5px",
      //   left: "-43px",
      // }}
      // PaperProps={{
      //   elevation: 0,
      //   sx: {
      //     overflow: "visible",
      //     width: "342px",

      //     "& .MuiMenu-list": {
      //       padding: "0px",
      //     },

      //     "& .MuiAvatar-root": {
      //       width: 32,
      //       height: 32,
      //       ml: -0.5,
      //       mr: 1,
      //     },
      //   },
      // }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      {/* <StyledMenu> */}
      <PasswordFieldSection>
        <InstructionsHeader>
          Use these instructions to make your password strong
        </InstructionsHeader>
        <InstructionsSections>
          <InstructionsContainer>
            <PasswordImageLogo src={iconCompleted} alt="logo" />
            <PasswordInstrcutions>
              Between 08 to 14 character
            </PasswordInstrcutions>
          </InstructionsContainer>

          <InstructionsElements>
            <PasswordImageLogo src={iconCompleted} alt="logo" />
            <PasswordInstrcutions>An uppercase character</PasswordInstrcutions>
          </InstructionsElements>
          <InstructionsElements>
            <PasswordImageLogo src={PasswordError} alt="logo" />
            <PasswordInstrcutions>A lowercase character</PasswordInstrcutions>
          </InstructionsElements>
          <InstructionsElements>
            <PasswordImageLogo src={PasswordError} alt="logo" />
            <PasswordInstrcutions>A number</PasswordInstrcutions>
          </InstructionsElements>

          <InstructionsElements>
            <PasswordImageLogo src={PasswordError} alt="logo" />
            <PasswordInstrcutions>A special character</PasswordInstrcutions>
          </InstructionsElements>
        </InstructionsSections>
      </PasswordFieldSection>
      {/* </StyledMenu> */}
    </Menu>
  );
};

export default PasswordRequired;
