import {
  ToasFirstHalf,
  ToastContainerDiv,
  ToasterCloseIcon,
  ToasterIcon,
  ToastImgCloseCont,
  ToastImgContainer,
  ToastTitle,
  ToastTitleContainer,
} from "./CustomToastStyles";
import toasterIcon from "../../../public/divami_icons/toasterIcon.svg";
import toastClose from "../../../public/divami_icons/toastClose.svg";

export const CustomToaster = (props: any) => {
  return (
    <ToastContainerDiv>
      <ToasFirstHalf>
        <ToastImgContainer>
          <ToasterIcon src={toasterIcon} alt="toaster" />
        </ToastImgContainer>

        <ToastTitleContainer>
          <ToastTitle>{props.successMessage}</ToastTitle>
        </ToastTitleContainer>
      </ToasFirstHalf>

      <ToastImgCloseCont>
        <ToasterCloseIcon src={toastClose} alt="toaster" />
      </ToastImgCloseCont>
    </ToastContainerDiv>
  );
};
