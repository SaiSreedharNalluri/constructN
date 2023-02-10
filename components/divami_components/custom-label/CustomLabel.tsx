import { styled } from "@mui/system";
import { Typography } from '@mui/material'
import React from 'react'

const StyledLabel = styled(Typography)
  ({
    fontWeight: '400',
  lineHeight: '20px',
  fontSize: '14px',
  marginBottom: '8px',
  fontFamily: 'Open Sans'
})


const CustomLabel = ({ label }: any) => (
  <div>
    <StyledLabel>{label}</StyledLabel>
  </div>
)

export default CustomLabel
