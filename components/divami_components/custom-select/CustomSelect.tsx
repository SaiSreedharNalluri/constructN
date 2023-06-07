import { MenuItem, Select, ThemeProvider, createTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";

const StyledSelect = styled(Select)((props: any) => ({
  width: props.width ? props.width : "100%",
  height: "40px",
  outline: "0px",
  border: "1px solid #36415d",

  borderRadius: "4px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",
  "& .MuiOutlinedInput-notchedOutline": {
    border: 0,
    offset: 0,
  },
  // "& .MuiInputBase-root": {
  //   border: "none !important",
  //   background: "red",
  // },
})) as any;

const StyledMenuItem = styled(MenuItem)({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",
});

const CustomSelectContainer = styled("div")({
  width: "100%",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",
});

export const ErrorField = styled("div")({
  color: "red",
  fontSize: "14px",
});

const CustomSelect = (props: any) => {
  const { config, defaultValue, id, setFormConfig, isReadOnly = false } = props;

  const [val, setVal] = useState(config?.defaultValue);

  const handlechange = (e: any) => {
    setVal(e.target.value);
    setFormConfig((prevState: any) =>
      prevState.map((item: any) => {
        if (id === item.id) {
          return {
            ...item,
            defaultValue: e.target.value,
            options: item.options.map((each: any) => {
              if (each.value == e.target.value) {
                return {
                  ...each,
                  selected: true,
                };
              }
              return { ...each, selected: false };
            }),
          };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    setVal(config?.defaultValue);
  }, [config?.defaultValue]);

  return (
    <CustomSelectContainer>
      <StyledSelect
        value={val}
        onChange={props.onChangeHandler ? props.onChangeHandler : handlechange}
        id={id}
        readOnly={isReadOnly}
        className={` ${config?.isError ? "formErrorField" : ""} formField`}
        width={props.width || ""}
        // sx={{
        //   boxShadow: "none",
        //   ".MuiOutlinedInput-notchedOutline": { border: 0 },
        //   "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
        //     border: 0,
        //   },
        //   "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
        //     {
        //       border: 0,
        //     },
        // }}
      >
        {config.options?.length &&
          config.options.map((item: any, index: any) => (
            <StyledMenuItem
              key={item.value}
              value={`${item.value}`}
              id={`select-dropdown${index}`}
            >
              {item.label}
            </StyledMenuItem>
          ))}
      </StyledSelect>

      {/* <ErrorField>{data?.isError ? "Required" : ""}</ErrorField> */}
    </CustomSelectContainer>
  );
};

export default CustomSelect;
