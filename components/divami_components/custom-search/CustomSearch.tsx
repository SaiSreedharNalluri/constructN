import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { styled } from "@mui/system";
import { InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Search from "../../../public/divami_icons/search.svg";
import Image from "next/image";

const CustomAutoComplete = styled(Autocomplete) ({
  border: '1px solid #36415d',
  borderRadius: '6px',
  fontFamily: 'Open Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 14,
  color: '#101F4B',
  "& .MuiAutocomplete-root" :{
    width: '398px',
    height: '40px'
  },
  "& .MuiAutocomplete-endAdornment" :{
    display: 'none'
  },
  "& .MuiFormLabel-root.MuiInputLabel-root.Mui-focused": {
    border: 0,
    display: 'none',
    offset: 'none'
  },
  "& .MuiOutlinedInput-root" :{
    borderRadius: '0',
    padding: '0',
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    color: '#101F4B',
  },
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: 0,
    ouline: 'none',
    offset: 0,
  },
  "& .MuiFormLabel-root.MuiInputLabel-root": {
    display: 'none'
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    ouline: 'none'
  },
  "& .MuiInputAdornment-root" :{
    paddingLeft: '15px'
  }
})

const CustomSearch = (props: any) => {
  const { data, handleSearchResult } = props

  return (
    <CustomAutoComplete
      disablePortal
      id="combo-box-demo"
      options={data.listOfEntries}
      renderInput={(params) => (
        <TextField
          placeholder="Enter Name or Teams here ..."
          {...params}
          label={data.label}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Image width={15} height={15} src={Search} alt="Search" />
              </InputAdornment>
            ),
          }}
        />
      )}
      onChange={(e, value) => handleSearchResult(e, value)}
    />
  )
}

export default CustomSearch
