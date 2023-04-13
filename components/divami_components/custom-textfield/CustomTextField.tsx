import React, { useRef } from "react";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";
import { ErrorField } from "../custom-select/CustomSelect";

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
}

const StyledTextField = styled(TextField)({
  width: "392px !important",
  height: "40px !important",
  // padding: "5px 10px",
  // border: "1px solid #36415d",
  borderRadius: "4px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",
  // "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
  //   height: "40px !important",
  //   border: "1px solid #36415d",
  // },
  // "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
  //   borderWidth:0
  // }
  "& .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root": {
    height: "40px !important",
    "& fieldset": { border: "1px solid #36415d !important" },
  },
  "&:focus-within fieldset": {
    border: "1px solid #ff843f !important",
  },
});

export const CustomTextField = (props: PropTypes) => {
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
  } = props;

  return (
    <div>
      <StyledTextField
        id={id}
        className={` ${isError ? "formErrorField" : ""} formField`}
        // placeholder={placeholder}
        defaultValue={defaultValue}
        value={defaultValue}
        data-testid={dataTestId}
        required={false}
        disabled={isDisabled}
        onWheel={(e: any) => e.target?.blur()}
        onBlur={onBlur}
        ref={reff}
        onClick={(e) => {
          reff?.current?.focus();
        }}
        onChange={onChange}
        // readOnly={isReadOnly}
      />
      {/* <ErrorField>{isError ? "Required" : ""}</ErrorField> */}
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
