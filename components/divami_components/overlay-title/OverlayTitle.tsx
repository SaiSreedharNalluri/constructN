import {
  TitleContainer,
  TitleText,
  CloseIcon,
  UserIcon,
  SubTitle,
} from "./OverlayTitleStyles";
import closeWithCircle from "../../../public/divami_icons/closeWithCircle.svg";
import React from "react";

export const OverlayTitle = ({
  handleClose,
  title,
  userRole,
  userIcon,
}: any) => {
  return (
    <TitleContainer>
      {userRole ? (
        <React.Fragment>
          <UserIcon src={userIcon} alt=""></UserIcon>
          <TitleText>{title}</TitleText>
          <SubTitle>{userRole}</SubTitle>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <TitleText>{title}</TitleText>
        </React.Fragment>
      )}

      <CloseIcon
        onClick={() => {
          handleClose();
        }}
        src={closeWithCircle}
        alt={"close icon"}
      />
    </TitleContainer>
  );
};
