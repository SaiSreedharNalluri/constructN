import React, { useRef, useState } from "react";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";
import { ErrorField } from "../custom-select/CustomSelect";
import { InputAdornment, Menu } from "@mui/material";
import Image from "next/image";
import Mail from "../../../public/divami_icons/Mail.svg";
import name from "../../../public/divami_icons/name.svg";
import Blocked from "../../../public/divami_icons/Blocked.svg";

import lock from "../../../public/divami_icons/lock.svg";
import { ShowHideDiv } from "../sign-in/SignInPageStyle";
import { text } from "stream/consumers";
// import { ErrorShowcase } from "./CustomTextFieldStyles";

interface PropTypes {
  id: any;
  variant: "outlined" | "standard" | "filled";
  placeholder: any;
  onChange: any;
  className: any;
  defaultValue: any;
  isError: any;
  dataTestId: any;
  icon?: string;
  isRequired: boolean;
  type: string;
  isDisabled?: boolean;
  minVal?: number;
  maxVal?: number;
  showRangeError?: boolean;
  onBlur?: any;
  isReadOnly?: boolean;
  loginField?: boolean;
  imageIcon?: string;
  isValidField: boolean;
  errorMsg: string;
  showErrorMsg: boolean;
  width?: string;
  onFocus?: any;
}

const StyledTextField = styled(TextField)((props: any) => ({
  width: props.width
    ? props.width
    : props.loginField
    ? "340px"
    : "392px !important",
  height: "40px !important",
  borderRadius: "4px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",

  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    height: "40px",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #36415d",
  },

  "&:focus-within .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #F1742E !important",
  },

  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    height: "7px",
  },
})) as any;
const ErrorShowcase = styled("div")({
  // border: "2px solid blue",
  paddingTop: "6px",
  display: "flex",
  alignItems: "center",
  // background: "blue",
});
const HeaderImageLogo = styled(Image)({});
const ErrorShowText = styled("div")({
  marginLeft: "4px",
  // border: "2px solid blue",
});

export const CustomTextField = (props: any) => {
  const reff = useRef<any>(null);
  const {
    id,
    variant,
    placeholder,
    defaultValue,
    isError,
    dataTestId,
    type = "text",
    isDisabled = false,
    onBlur,
    isReadOnly = false,
    onChange,
    className,
    imageIcon,
    loginField,
    isValidField,
    errorMsg,
    showErrorMsg,
    onFocus,
  } = props;
  // console.log("loginField", loginField);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  console.log("showerrot", type);
  return (
    <div>
      <StyledTextField
        width={props.width ? props.width : ""}
        autoComplete="off"
        id={id}
        className={` ${isError ? "formErrorField" : ""} formField`}
        //  type={showPassword ? "text" : "password"}

        type={
          type === "password"
            ? showPassword
              ? "text"
              : "password"
            : type === "textfield"
            ? type
            : ""
        }
        placeholder={props.loginField ? placeholder : ""}
        defaultValue={defaultValue}
        value={defaultValue}
        data-testid={dataTestId}
        required={false}
        disabled={isDisabled}
        onWheel={(e: any) => e.target?.blur()}
        onBlur={onBlur}
        ref={reff}
        onClick={(e: any) => {
          reff?.current?.focus();
        }}
        onChange={onChange}
        loginField={loginField}
        // variant="outlined"
        // {...rest}
        InputProps={
          imageIcon === "emailIcon"
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    <Image width={24} height={24} src={Mail} alt="Search" />
                  </InputAdornment>
                ),
              }
            : imageIcon === "nameIcon"
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    <Image width={24} height={24} src={name} alt="Search" />
                  </InputAdornment>
                ),
              }
            : imageIcon === "passwordIcon"
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    <Image width={24} height={24} src={lock} alt="Search" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {showPassword ? (
                      //   <VisibilityOffIcon onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} />
                      <ShowHideDiv
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        Hide
                      </ShowHideDiv>
                    ) : (
                      //   <VisibilityIcon onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} />
                      <ShowHideDiv
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        Show
                      </ShowHideDiv>
                    )}
                  </InputAdornment>
                ),
              }
            : {}
        }
      />
      {isError && showErrorMsg ? (
        <ErrorShowcase>
          <HeaderImageLogo src={Blocked} alt="blocked" />
          <ErrorShowText>{errorMsg}</ErrorShowText>
        </ErrorShowcase>
      ) : (
        // <div style={{ height: "30px" }}></div>
        ""
      )}
    </div>
  );
};

CustomTextField.defaultProps = {
  isDisabled: false,
  minVal: "",
  maxVal: "",
  showRangeError: false,
  onBlur: "",
  onKeyDown: "",
};
