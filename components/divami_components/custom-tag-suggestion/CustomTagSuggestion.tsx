import { styled } from "@mui/system";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
import Image from "next/image";
import Chip from "@mui/material/Chip";

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

const TagsContainer = styled("div")({});

const ValueContainer = styled("div")(({ theme }) => ({
  "& > :not(:last-child)": {
    marginRight: theme.spacing(1),
  },
  "& > *": {
    marginBottom: theme.spacing(1),
  },
  marginTop: "15px",
}));
const CloseIcon = styled(Image)`
  cursor: pointer;
`;

const CustomTagSuggestion = (props: any) => {
  const { data, handleChipMaking, setFormConfig, dataTestId } = props;
  const [options, setOptions] = useState(data.chipSuggestions);
  const [autoCompleteValue, setAutoCompleteValue] = useState([]);

  useEffect(() => {
    setAutoCompleteValue(data.chipString);
  }, [data.chipString]);
  useEffect(() => {
    setOptions(data.chipSuggestions);
  }, [data]);

  return (
    <TagsContainer>
      <CustomAutoComplete
        multiple
        id="tags-outlined"
        options={options}
        value={autoCompleteValue}
        freeSolo
        onChange={(e, newval, reason) => {
          handleChipMaking(newval);
        }}
        renderTags={() => null}
        data-testid={dataTestId}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            // label="filterSelectedOptions"
            placeholder="Add tags separated by commas"
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "14px",
                lineHeight: "20px",
                fontFamily: "Open Sans",
                color: "#101F4C",
                fontWeight: "400",
                "&::placeholder": {
                  color: "#888888",

                  fontFamily: "Open Sans",
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: "400",
                },
              },
              "& .MuiOutlinedInput-root": {
                paddingLeft: "10px !important",
              },
            }}
            data-testid="custom-tag-suggestion-text-field"

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
      <ValueContainer>
        {autoCompleteValue?.map((v: any) =>
          v ? (
            <Chip
              key={v}
              label={v}
              variant="outlined"
              style={{ marginTop: "10px" }}
              deleteIcon={
                <CloseIcon
                  src={closeIcon}
                  alt=""
                  style={{ marginLeft: "5px", marginRight: "12px" }}
                />
              }
              onDelete={() => {
                const newValue = autoCompleteValue.filter(
                  (selected: any) => selected !== v
                );
                setAutoCompleteValue(newValue);
              }}
            />
          ) : null
        )}
      </ValueContainer>
    </TagsContainer>
  );
};

export default CustomTagSuggestion;
