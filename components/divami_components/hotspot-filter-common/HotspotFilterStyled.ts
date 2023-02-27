import styled from "@emotion/styled";
import { Box, Button, TextField, Typography } from "@mui/material";
import Image from "next/image";

export const HotspotFilterCommonMain = styled("div")({
  width: "438px",
  // height: "100%",
  display: "block",
  height: "calc(100vh - 60px)",
});

export const FilterCommonHeader = styled.div`
  height: 52px;
`;

export const HeaderContainer = styled("div")({
  backgroundColor: "white",
  height: "51px",
  display: "flex",
  // justifyContent: "center",
  alignItems: "center",
  // width: "100%",
  borderBottom: "1px solid #d9d9d9",
});

export const TitleContainer = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: "20px",
  paddingRight: "20px",
});

export const HeaderLeftSection = styled.div({});


export const HeaderLeftSectionText = styled.div({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  color: "#36415d",
});

export const HeaderRightSection = styled.div({
  display: "flex",
  alignItems: "center",
});
export const HeaderRightSectionResetIcon = styled.div({
  marginRight: "7px",
});

export const HeaderRightSectionResetText = styled.div({
  marginRight: "10px",
  borderRight: "1px solid #d9d9d9",
  paddingRight: "15px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  color: " #ff843f",
});

export const HeaderRightSectionCancel = styled.div({});

//  export 
  
//  export  const CloseIcon = styled(Image)({
//     cursor: "pointer",
//     width: "24px",
//     height: "24px",
//  });
  
 export const FilterCommonBody = styled.div({
  // marginBottom: "50px",
  overflowY: "auto",
  height: "calc(100% - 130px)",
 });

 export const FilterCardContainer = styled.div({
  marginTop: "20px",
 });

 export const FormElementContainer = styled(Box)({
//   marginTop: "30px",
  paddingLeft: "20px",
  paddingRight: "20px",
 });

  export const ElementDivCardContainer = styled.div({
  marginTop: "30px",
  });
 
    export const ElementDivCardDateContainer = styled.div({
  marginTop: "10px",
 });

export const HorizontalLine = styled.div({
    borderBottom: "1px solid #d9d9d9",
    marginTop:"5px"
});
 
export const DatePickersContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
`;


export const DatePickerContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`;


export const FilterFooter = styled.div`
  // height: calc(100% - 50px);
  // margin-top: 72px;
`;


export const ButtonsContainer = styled(Box)`
  padding-left: 20px;
  padding-right: 20px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-top: 50px;
`;