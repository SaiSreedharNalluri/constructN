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
  return (
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
  );
};

export default PasswordRequired;
