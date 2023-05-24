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

const PasswordRequired = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(true);
  const handleSortMenuClose = () => {
    setIsSortMenuOpen(false);
    setAnchorEl(null);
  };
  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={isSortMenuOpen}
      onClose={handleSortMenuClose}
      onClick={handleSortMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            // width: 32,
            // height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <StyledMenu>
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
              <PasswordInstrcutions>
                An uppercase character
              </PasswordInstrcutions>
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
      </StyledMenu>
    </Menu>
  );
};

export default PasswordRequired;
