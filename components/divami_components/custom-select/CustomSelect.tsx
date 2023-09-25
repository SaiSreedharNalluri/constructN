import { MenuItem, Select, ThemeProvider, createTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";

const StyledSelect = styled(Select)((props: any) => ({
  width: props.width ? props.width : "100%",
  height: "40px",
  outline: "0px",
  maxWidth:props.maxWidth,
  border: props.hideBorder ? "none !important" : "1px solid #36415d",
  borderRadius: "4px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  textAlign:props.textAlign,
  color: "#101F4B",
  "& .MuiOutlinedInput-notchedOutline": {
    border: 0,
    offset: 0,
  },
  "& .MuiSelect-icon": {
    color: "#101F4C",
  },
  "& .Mui-focused": {
    border: "none",
  },
  // "& .MuiInputBase-root": {
  //   border: "none !important",
  //   background: "red",
  // },
})) as any;

const StyledMenuItem = styled(MenuItem)({
  height: "38px",
  lineHeight: "38px",
  color: "#101F4C",
  fontFamily: "Open Sans",
  fontWeight: "400",
  fontSize: "14px",
  display: "block !important",
  cursor: "pointer",
  margin: "0px 20px",
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
  const {
    config,
    defaultValue,
    id,
    setFormConfig,
    isReadOnly = false,
    hideBorder = false,
    customClass,
    parentId,
    parentType,
  } = props;

  const [val, setVal] = useState(config?.defaultValue);

  const handlechange = (e: any) => {
    setVal(e.target.value);
    if (parentType === "doubleField") {
      setFormConfig((prevState: any) =>
        prevState.map((item: any) => {
          if (item.id === parentId) {
            return {
              ...item,
              fields: item.fields.map((each: any) => {
                if (each.id === id) {
                  return {
                    ...each,
                    defaultValue: e.target.value,
                    options: each.options.map((iter: any) => {
                      if (iter.value == e.target.value) {
                        return {
                          ...iter,
                          selected: true,
                        };
                      }
                      return { ...iter, selected: false };
                    }),
                  };
                } else {
                  return each;
                }
              }),
            };
          }
          return item;
        })
      );
    } else {
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
    }
  };

  useEffect(() => {
    setVal(config?.defaultValue);
  }, [config?.defaultValue]);
  const handleKeyDown = (event:React.KeyboardEvent) => {
    const arrowKeys = ["ArrowUp", "ArrowDown",'ArrowRight','ArrowLeft'];
     if (arrowKeys.includes(event.key)) {
      event.stopPropagation();
    }
  };
  return (
    <CustomSelectContainer  onKeyDown={handleKeyDown}>
      <StyledSelect
        value={val}
        onChange={props.onChangeHandler ? props.onChangeHandler : handlechange}
        id={id}
        textAlign={config?.textAlign}
        readOnly={isReadOnly}
        className={` ${config?.isError ? "formErrorField" : ""} formField ${
          customClass ? customClass : null
        }`}
        width={props.width || ""}
        maxWidth={config.maxWidth||""}
        styles={config.styles ? config.styles : {}}
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
        hideBorder={hideBorder}
      >
        {config?.options?.length ? (
          config?.options?.map((item: any, index: any) => (
            <StyledMenuItem
              key={item.value}
              value={`${item.value}`}
              id={`select-dropdown${index}`}
            >
             <p className="ml-[8px]">{item.label}</p> 
            </StyledMenuItem>
          ))
        ) : (
          <></>
        )}
      </StyledSelect>

      {/* <ErrorField>{data?.isError ? "Required" : ""}</ErrorField> */}
    </CustomSelectContainer>
  );
};

export default CustomSelect;
