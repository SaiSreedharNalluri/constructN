import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/system";
import { InputAdornment } from "@mui/material";
import Image from "next/image";
import SearchBoxIcon from "../../public/divami_icons/search.svg";

const CustomAutoComplete = styled(Autocomplete)({
  border: "1px solid #36415d",
  borderRadius: "6px",
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
  " & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: "0",
    ouline: "none",
    offset: "0",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root": {
    display: "none",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    ouline: "none",
  },
  "& .MuiInputAdornment-root": {
    paddingLeft: "15px",
  },
});

const CustomSearch = (props: any) => {
  const { data, handleSearchResult } = props;

  return (
    <CustomAutoComplete
      disablePortal
      id="combo-box-demo"
      options={data}
      getOptionLabel={(option: any) => option.name}
      renderInput={(params) => (
        <TextField
          placeholder="Search ..."
          {...params}
          label={"a"}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Image src={SearchBoxIcon} alt="" />
              </InputAdornment>
            ),
          }}
        />
      )}
      onChange={(e, value) => handleSearchResult(e, value)}
    />
  );
};

export default CustomSearch;
