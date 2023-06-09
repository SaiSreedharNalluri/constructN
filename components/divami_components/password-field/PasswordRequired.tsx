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

const PasswordRequired = ({ passwordString }: { passwordString: string }) => {
  const renderIcon = (fieldType: String) => {
    if (passwordString.length === 0) {
      return PasswordError;
    }
    switch (fieldType) {
      case "length":
        // code block
        if (passwordString.length < 8 || passwordString.length > 14) {
          return PasswordError;
        } else return iconCompleted;

      case "upperCase":
        if (hasUpperCase(passwordString)) {
          return iconCompleted;
        } else return PasswordError;
      case "lowerCase":
        if (hasLowerCase(passwordString)) {
          return iconCompleted;
        } else return PasswordError;
      case "number":
        if (hasNumber(passwordString)) {
          return iconCompleted;
        } else return PasswordError;
      case "special-character":
        if (hasSpecialCharacters(passwordString)) {
          return iconCompleted;
        } else return PasswordError;
      default:
        return PasswordError;
      // code block
    }
  };

  function hasUpperCase(str: string): boolean {
    return /[A-Z]/.test(str);
  }
  function hasLowerCase(str: string): boolean {
    return /[a-z]/.test(str);
  }
  function hasNumber(str: string): boolean {
    return /\d/.test(str);
  }

  function hasSpecialCharacters(str: string): boolean {
    return /[!@#$%^&*]/.test(str);
  }

  return (
    <PasswordFieldSection>
      <InstructionsHeader>
        Use these instructions to make your password strong
      </InstructionsHeader>
      <InstructionsSections>
        <InstructionsContainer>
          <PasswordImageLogo src={renderIcon("length")} alt="logo" />
          <PasswordInstrcutions>
            Between 08 to 14 character
          </PasswordInstrcutions>
        </InstructionsContainer>

        <InstructionsElements>
          <PasswordImageLogo src={renderIcon("upperCase")} alt="logo" />
          <PasswordInstrcutions>An uppercase character</PasswordInstrcutions>
        </InstructionsElements>
        <InstructionsElements>
          <PasswordImageLogo src={renderIcon("lowerCase")} alt="logo" />
          <PasswordInstrcutions>A lowercase character</PasswordInstrcutions>
        </InstructionsElements>
        <InstructionsElements>
          <PasswordImageLogo src={renderIcon("number")} alt="logo" />
          <PasswordInstrcutions>A number</PasswordInstrcutions>
        </InstructionsElements>

        <InstructionsElements>
          <PasswordImageLogo src={renderIcon("special-character")} alt="logo" />
          <PasswordInstrcutions>A special character</PasswordInstrcutions>
        </InstructionsElements>
      </InstructionsSections>
    </PasswordFieldSection>
  );
};

export default PasswordRequired;
