import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";
import * as React from "react";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import calender from "../../../public/divami_icons/calender.svg";
import dayjs from "dayjs";
import Icon from "@mui/material/Icon";

const CalenderICon = (props: any) => {
  return (
    <>
      <svg
        width="14"
        height="15"
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.6861 14.5396V4.55469C14.6861 3.45012 13.7907 2.55469 12.6861 2.55469H2.70117C1.5966 2.55469 0.701172 3.45012 0.701172 4.55469V14.5396C0.701172 15.6442 1.5966 16.5396 2.70117 16.5396H12.6861C13.7907 16.5396 14.6861 15.6442 14.6861 14.5396Z"
          stroke="#36415D"
          strokeLinecap="round"
        />
        <path
          d="M10.8027 1V4.10776"
          stroke="#36415D"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.58398 1V4.10776"
          stroke="#36415D"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.701172 7.2168H14.6861"
          stroke="#36415D"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
const CustomDatePicker = styled(DesktopDatePicker)({
  border: "1px solid #36415d",
  borderRadius: "6px",
  width: "184px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",
  "& .MuiOutlinedInput-notchedOutline ": {
    border: "none",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root": {
    display: "none",
    textTransform: "uppercase",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root.Mui-focused": {
    border: "1px solid #F1742E !important",
    borderRadius: "4px",
  },
  "& .MuiDayPicker-weekContainer": {
    color: "red",
    backgroundColor: "red",
  },
});

const CustomDatePickerInputField = styled(TextField)({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",
  "& .MuiInputBase-input": {
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    color: "#101F4B",
    textTransform: "uppercase",
  },
});
//data?.defaultValue
const CustomCalender = (props: any) => {
  const {
    data,
    onChange,
    hideTextField = false,
    disablePast = false,
    config,
    dataTestId,
  } = props;

  const [value, setValue] = React.useState<Dayjs | null>(
    
    dayjs(data?.defaultValue) || null
  );
  useEffect(() => {
    setValue(dayjs(data?.defaultValue));
  }, [data?.defaultValue]);
  const calenderIcon = React.forwardRef((props, ref) => (
    <CalenderICon ref={ref} />
  ));

  return (
    <div data-testid={`custom-calender-parent-${dataTestId}`}>
      <LocalizationProvider dateAdapter={AdapterDayjs as any}>
        <CustomDatePicker
          data-testid={dataTestId}
          className={` ${data?.isError ? "formErrorField" : ""} formField`}
          components={{
            OpenPickerIcon: calenderIcon,
          }}
          PopperProps={
            hideTextField
              ? {
                  sx: {
                    "& .MuiPickersDay-root:not(.Mui-disabled,.Mui-selected)": {
                      backgroundColor: "#FFF5EF",
                      paddingRight: "5px",
                      color: "#101F4C",
                      fontSize: "14px",
                      fontWeight: 400,
                      fontFamily: "Open Sans",

                      "&::after": {
                        content: '""',
                        display: "block",
                        width: "4px",
                        height: "4px",
                        background: "#FF843F",
                        border: "1px solid red",
                        borderRadius: "50%",
                        marginTop: "22px",
                        marginLeft: "-7px",
                      },
                    },
                    "& .Mui-selected:hover": {
                      backgroundColor: "#FF843F",
                      color: "#FFFFFF",
                    },

                    "& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "#FF843F",
                      color: "#FFFFFF",
                      fontSize: "14px",
                      fontWeight: 400,
                      fontFamily: "Open Sans",
                    },

                    // "& .MuiButtonBase-root.MuiPickersDay-root:not(.Mui-selected)":
                    //   {
                    //     border: "1px solid #FF843F",
                    //     borderRadius: "50%",
                    //     fontSize: "14px",
                    //     fontWeight: 400,
                    //     fontFamily: "Open Sans",
                    //   },
                    "&  .MuiButtonBase-root.Mui-disabled": {
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#888888",
                      fontFamily: "Open Sans",
                    },
                    "& .MuiDayPicker-weekDayLabel": {
                      color: "#888888",
                      fontSize: "14px",
                      fontWeight: 400,
                      fontFamily: "Open Sans",
                    },
                    "& .MuiPickersCalendarHeader-label": {
                      color: "#36415D",
                      fontWeight: 500,
                      fontFamily: "Open Sans",
                      fontSize: "14px",
                    },
                    "& .MuiPickersArrowSwitcher-button": {
                      border: "1px solid #9D9D9D",
                      borderRadius: "4px",
                      width: "24px",
                      height: "24px",
                      marginTop: "3px",
                    },
                    "& .MuiPickersCalendarHeader-root ": {
                      borderBottom: "1px solid #9D9D9D",
                      paddingBottom: "15px",
                      margin: "20px",
                    },
                    "& .MuiPickersArrowSwitcher-root": {
                      marginRight: "-10px",
                      marginTop: "-7px",
                    },
                    "& .MuiPickersCalendarHeader-labelContainer": {
                      marginLeft: "-20px",
                    },
                  },
                }
              : {}
          }
          label={"MM/DD/YYYY"}
          value={value}
          shouldDisableDate={data.disableDays}
          disablePast={disablePast}
          minDate={
            config && config[0] && data.id === "due-date"
              ? config[0]?.defaultValue
              : null
          }
          maxDate={
            config && config[1] && data.id === "start-date"
              ? config[1]?.defaultValue
              : null
          }
          onChange={(newValue: any) => {
            setValue(newValue);
            onChange(newValue);
          }}
          // PopperProps={data.styles ? data.styles : null}
          renderInput={
            hideTextField
              ? ({ inputRef, inputProps, InputProps }) => (
                  <Box ref={inputRef}>{InputProps?.endAdornment}</Box>
                )
              : (params) => (
                  <CustomDatePickerInputField
                    {...params}
                    value={value}
                    InputLabelProps={{ shrink: true }}
                    placeholder="MM/DD/YYYY"
                    sx={calender}
                    aria-readonly
                    onClick={() => {setIsOpen(!isOpen);}}
                  />
                )
          }
          // data-testid={dataTestId}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomCalender;
