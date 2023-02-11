import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";
import * as React from "react";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";

const CustomDatePicker = styled(DatePicker)({
  border: "1px solid #36415d",
  borderRadius: "6px",
  width: "184px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiOutlinedInput-notchedOutline ": {
    border: "none",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root": {
    display: "none",
    textTransform: "uppercase",
  },
});

const CustomCalender = (props: any) => {
  const { data, onChange, hideTextField = false } = props;
  const [value, setValue] = React.useState<Dayjs | null>(null);
  return (
    <div data-testid="custom-calender-parent">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CustomDatePicker
          label={"MM/DD/YYYY"}
          value={value}
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
                  <TextField
                    {...params}
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
