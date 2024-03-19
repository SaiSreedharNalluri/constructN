import { Box, Button, styled } from '@mui/material';
import React from 'react'

const ProcoreFooter = (props:any) => {
    const{handleExternalSubmit,allFieldsTrue,
      handleInstances}=props as any
    
    const ButtonsContainer = styled(Box)({
        padding: "5px",
        paddingTop:"20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      });
      const StyledButton = styled(Button)((props: any) => ({
        // border: "2px solid red",
      
        width: props.loginField ? "340px" : "180px !important",
        height: "40px",
        textTransform: "none",
        backgroundColor: props.loginField ? "#888888 !important" : "",
        color: props.loginField ? "#ffffff !important" : "",
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "16px",
        lineHeight: "16px",
      })) as any;
      const ContainedButton = styled(StyledButton)({
        backgroundColor: !allFieldsTrue? "#888888 !important": '#f1742e !important',
        color: !allFieldsTrue ? "#ffffff !important": '#ffffff',
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "16px",
        lineHeight: "16px",
        "&:hover": {
          backgroundColor: "#f1742e",
          color: "#ffffff",
        },
      });
      const OulinedButton = styled(StyledButton)({
        backgroundColor: "#ffffff",
        color: "#f1742e",
        borderColor: "#f1742e",
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "16px",
        lineHeight: "16px",
        "&:hover": {
          backgroundColor: "#ffffff",
          borderColor: "#f1742e",
        },
      });
  return (
    <ButtonsContainer>
      <OulinedButton
       variant="outlined"
       type="reset"  
       onClick={() => {
            handleInstances()
        }}>Cancel
      </OulinedButton>
    <ContainedButton 
    type="submit" 
    disabled={!allFieldsTrue} 
    onClick={() => { handleExternalSubmit()}}>
      Create
      </ContainedButton>
  </ButtonsContainer>
  )
}

export default ProcoreFooter