import { Box, Button, styled } from '@mui/material';
import React from 'react'

const ProcoreFooter = (props:any) => {
    const{handleExternalSubmit,allFieldsTrue,
      handleInstances}=props as any
    
    const ButtonsContainer = styled(Box)({
        padding: "10px",
        paddingTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      });
  return (
    <div><ButtonsContainer>
    <Button className="border border-solid border-border-yellow p-2 w-[150px]   text-border-yellow font-medium py-2 px-4 rounded " type="reset"  onClick={() => {
                    handleInstances()
                  }}>Cancel</Button>
    <Button className="border border-solid border-border-yellow p-2 w-[150px] bg-border-yellow  text-box-white font-medium py-2 px-4 rounded hover:bg-border-yellow hover:text-box-white" type="submit" disabled={allFieldsTrue} onClick={() => { handleExternalSubmit()}}>Create</Button>
  </ButtonsContainer></div>
  )
}

export default ProcoreFooter