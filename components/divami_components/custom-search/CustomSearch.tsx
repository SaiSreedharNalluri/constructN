import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/system";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Search from "../../../public/divami_icons/search.svg";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
import Image from "next/image";
import Chip from "@mui/material/Chip";

const CustomAutoComplete = styled(Autocomplete)({
  border: "1px solid #36415d",
  borderRadius: "6px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",
  "& .MuiAutocomplete-root": {
    width: "398px",
    height: "40px",
  },
  "& .MuiAutocomplete-endAdornment": {
    display: "none",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root.Mui-focused": {
    border: 0,
    display: "none",
    offset: "none",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "0",
    padding: "0",
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    color: "#101F4B",
  },
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: 0,
    ouline: "none",
    offset: 0,
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
  const AssignEditSearchContainer = styled("div")({});

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

  const { data, handleSearchResult, setFormConfig } = props;
  const { isMultiSelect = false } = props.data;
  const [val, setVal] = React.useState<any>([]);

  React.useEffect(() => {
    if (isMultiSelect) {
      if (data?.selectedName?.length) {
        setVal(
          data.selectedName?.map((each: any) => {
            return {
              ...each,
              label: each.fullName || each.user?.fullName,
            };
          })
        );
      } else {
        setVal([
          // {
          //   user: data.selectedName,
          //   label: data?.selectedName?.fullName,
          //   value: data.selectedName?._id,
          // },
        ]);
      }
    } else {
      if (data.selectedName) {
        if (data?.selectedName?.label && data?.selectedName?.value) {
          setVal(data.selectedName);
        } else {
          setVal({
            user: data.selectedName,
            label: data?.selectedName?.fullName,
            value: data.selectedName?._id,
          });
        }
      }
    }
  }, [data.selectedName?.length]);

  return (
    <>
      {isMultiSelect ? (
        <AssignEditSearchContainer>
          <CustomAutoComplete
            className={"formField"}
            disablePortal
            data-testid={props.dataTestId || "search-auto-complete"}
            id="combo-box-demo"
            options={data.listOfEntries}
            getOptionLabel={(option: any) => option.label}
            value={val}
            multiple={isMultiSelect}
            renderTags={() => null}
            renderInput={(params) => (
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    paddingRight: "8px !important",
                    paddingLeft: "10px !important",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontFamily: "Open Sans",
                    color: "#101F4C",
                    fontWeight: "400",
                    "&::placeholder": {
                      color: "#787878",

                      fontFamily: "Open Sans",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: "400",
                    },
                  },
                }}
                placeholder="Enter Name or Teams here ..."
                {...params}
                // label={data.label}
                InputProps={
                  val.length
                    ? {
                        ...params.InputProps,
                        // startAdornment: (
                        //   <InputAdornment position="start">
                        //     <Image width={15} height={15} src={Search} alt="Search" />
                        //   </InputAdornment>
                        // ),
                      }
                    : {
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="start">
                            <Image
                              width={15}
                              height={15}
                              src={Search}
                              alt="Search"
                            />
                          </InputAdornment>
                        ),
                      }
                }
              />
            )}
            onChange={(e, value) => handleSearchResult(e, value, data.id)}
          />
          <ValueContainer>
            {val.map((v: any) =>
              v?.label ? (
                <Chip
                  key={v?.label}
                  label={v?.label}
                  variant="outlined"
                  style={{ marginTop: "10px" }}
                  deleteIcon={
                    <CloseIcon
                      src={closeIcon}
                      alt=""
                      style={{ marginLeft: "5px", marginRight: "12px" }}
                    />
                  }
                  onDelete={(id: string) => {
                    const newSelectedUser = val.filter(
                      (selected: any) => selected?.label !== v?.label
                    );
                    setVal(newSelectedUser);
                    setFormConfig((prev: any) =>
                      prev.map((item: any) => {
                        if (item.id === data.id) {
                          return { ...item, selectedName: newSelectedUser };
                        }
                        return item;
                      })
                    );
                  }}
                />
              ) : null
            )}
          </ValueContainer>
        </AssignEditSearchContainer>
      ) : (
        <CustomAutoComplete
          disablePortal
          data-testid={props.dataTestId || "search-auto-complete"}
          id="combo-box-demo"
          options={data.listOfEntries}
          value={val}
          renderInput={(params) => (
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  paddingRight: "8px !important",
                },
              }}
              placeholder="Enter Name or Teams here ..."
              {...params}
              // label={data.label}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <Image width={15} height={15} src={Search} alt="Search" />
                  </InputAdornment>
                ),
              }}
            />
          )}
          onChange={(e, value) => handleSearchResult(e, value, data.id)}
        />
      )}
    </>
  );
};

export default CustomSearch;
