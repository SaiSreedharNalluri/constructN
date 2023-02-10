import React from 'react'
// import CustomButton from '../../Common/custom-button/CustomButton'
import { styled } from "@mui/system";
import { Box } from '@mui/material'
import CustomButton from '../../custom-button/CustomButton';

const ButtonsContainer = styled(Box)({
  paddingLeft: '20px',
  paddingRight: '20px',
  height: '80px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Footer = ({ formHandler }: any) => (
  <ButtonsContainer>
    <CustomButton type="outlined" label="Cancel" formHandler={formHandler} />
    <CustomButton type="contained" label="Create" formHandler={formHandler} />
  </ButtonsContainer>
)

export default Footer
