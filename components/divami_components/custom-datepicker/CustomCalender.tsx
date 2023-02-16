import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";
import * as React from "react";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import calender from "../../../public/divami_icons/calender.svg";
import dayjs from "dayjs";

const CustomDatePicker = styled(DatePicker)({
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
  const { data, onChange, hideTextField = false } = props;
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs(data?.defaultValue) || null
  );
  useEffect(() => {
    setValue(dayjs(data?.defaultValue));
  }, [data?.defaultValue]);
  return (
    <div data-testid="custom-calender-parent">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CustomDatePicker
          // components={{
          //   OpenPickerIcon: calender,
          // }}
          label={"MM/DD/YYYY"}
          value={value}
          minDate={data?.disableAll ? value : null}
          maxDate={data?.disableAll ? value : null}
          onChange={(newValue: any) => {
            setValue(newValue);
            onChange(newValue);
          }}
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
                  />
                )
          }
          data-testid="date-picker"
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomCalender;
