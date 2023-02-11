import { MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import { styled } from "@mui/system";

const StyledSelect = styled(Select) ({
  width: '100%',
  height: '40px',
  outline: '0px',
  border: '1px solid #36415d',
  borderRadius: '4px',
  fontFamily: 'Open Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 14,
  color: '#101F4B',
  "& .MuiOutlinedInput-notchedOutline" :{
    border: 0,
    offset: 0,
  }
});

const StyledMenuItem = styled(MenuItem) ({
  fontFamily: 'Open Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 14,
  color: '#101F4B',
});


const CustomSelectContainer = styled("div") ({
  width: '398px',
  fontFamily: 'Open Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 14,
  color: '#101F4B'
});

const CustomSelect = (props: any) => {
  const { config, defaultValue, id, setFormConfig } = props

  const [val, setVal] = useState(defaultValue)

  const handlechange = (e: any) => {
    setVal(e.target.value)
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
                }
              }
              return { ...each, selected: false }
            }),
          }
        }
        return item
      }),
    )
  }

  return (
    <CustomSelectContainer>
      <StyledSelect value={val} onChange={handlechange} id={id}>
        {config.options?.length &&
          config.options.map((item: any, index: any) => (
            <StyledMenuItem key={item.value} value={`${item.value}`} id={`select-dropdown${index}`}>
              {item.label}
            </StyledMenuItem>
          ))}
      </StyledSelect>
      {/* {isError && (
        <div className={textstyles.error_message}>This is required</div>
      )} */}
    </CustomSelectContainer>
  )
}

export default CustomSelect
