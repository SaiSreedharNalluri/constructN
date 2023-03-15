import { styled } from "@mui/system";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

const CustomAutoComplete = styled(Autocomplete)({
  border: "1px solid #36415d",
  borderRadius: "4px",
  "& .MuiAutocomplete-root": {
    width: "398px",
    height: "40px",
  },
  "& .MuiAutocomplete-endAdornment": {
    display: "none",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root.Mui-focused": {
    border: "0",
    display: "none",
    offset: "none",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "0",
    padding: "0",
  },

  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: "0",
    ouline: "none",
    offset: "0",
  },
  " & .MuiFormLabel-root.MuiInputLabel-root": {
    display: "none",
  },
  " & .Mui-focused .MuiOutlinedInput-notchedOutline": {
    ouline: "none",
  },
  "& .MuiInputAdornment-root": {
    paddingLeft: "15px",
  },
});

const CustomTagSuggestion = (props: any) => {
  const { data, handleChipMaking, dataTestId } = props;
  console.log("data", data);
  const [options, setOptions] = useState(data.chipSuggestions);
  const [autoCompleteValue, setAutoCompleteValue] = useState([]);

  useEffect(() => {
    setAutoCompleteValue(data.chipString);
  }, [data.chipString]);
  useEffect(() => {
    console.log("data-changed", data);
    setOptions(data.chipSuggestions);
  }, [data]);

  console.log("autoCompleteValue", data);
  return (
    <CustomAutoComplete
      multiple
      id="tags-outlined"
      options={options}
      value={autoCompleteValue}
      freeSolo
      onChange={(e, newval, reason) => {
        handleChipMaking(newval);
      }}
      data-testid={dataTestId}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="filterSelectedOptions"
          placeholder="Add tags separated by commas"
        // onKeyDown={(e: any) => {
        //   if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
        //     setAutoCompleteValue(
        //       // autoCompleteValue.concat((e.target as HTMLInputElement).value)
        //       autoCompleteValue.concat(e.target.value)
        //     );
        //   }
        // }}
        />
      )}
    />
  );
};

export default CustomTagSuggestion;
