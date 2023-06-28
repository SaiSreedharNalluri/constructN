import styled from "@emotion/styled";
import { Box, Button, TextField, Typography } from "@mui/material";
import Image from "next/image";

export const FilterCommonMain = styled("div")({
  width: "438px",
  // height: "100%",
  display: "block",
  height: "calc(100vh - 60px)",
  paddingLeft: "20px",
  paddingRight: "20px",
  overflowY:"hidden"
});
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
  // paddingLeft: "20px",
  // paddingRight: "20px",
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
  color: " #F1742E",
});

export const HeaderRightSectionCancel = styled.div({});

export const FilterCardContainer = styled.div({
  marginTop: "20px",
});

export const FilterCardSecondContainer = styled.div({
  marginTop: "50px",
});

export const FilterCardTitle = styled.div({
  // paddingLeft: "20px",
});

export const FormElementContainer = styled(Box)({
  marginTop: "30px",
  // paddingLeft: "20px",
  // paddingRight: "20px",
});

export const StyledLabel = styled(Typography)({
  fontWeight: "400",
  lineHeight: "20px",
  fontSize: "14px",
  marginBottom: "8px",
});

// export const FilterCardTitleText = styled.div({
//   color: " #101f4c",
//   fontFamily:""
// })

export const FilterCardTitleText = styled.div`
  color: #101f4c;

  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

export const FilterCardSelectAll = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding-bottom: 5px;
  // margin-left: 20px;
  margin-right: 20px;
  // border-bottom: 1px solid #d9d9d9;
`;
export const RefreshIcon = styled(Image)({
  cursor: "pointer",
  width: "18px",
  height: "15px",
});
export const CloseIcon = styled(Image)({
  cursor: "pointer",
  width: "24px",
  height: "24px",
});

export const FilterCardSelectAllSpan = styled.span`
  display: flex;
`;

export const FilterCardSelectAllText = styled.div`
  margin-left: 10px;
  color: #101f4c;

  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  // line-height: 19px;
`;

export const FilterCardSelectAllTextHeader = styled.div`
  margin-left: 10px;
  color: #101f4c;

  font-family: "Open Sans";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  // line-height: 19px;
`;

export const FilterCardOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  // padding: 0px 20px;
  // margin-top: 5px;
`;

export const FilterCardOptionContainer = styled.div`
  width: 50%;
`;

export const FilterCardOptionSpan = styled.span`
  display: flex;
  margin-top: 20px;
`;

export const FilterCommonHeader = styled.div`
  height: 52px;
`;

export const FilterFooter = styled.div`
  // height: calc(100% - 50px);
  // margin-top: 72px;
`;

export const FilterCommonBody = styled.div({
  // marginBottom: "50px",
  overflowY: "auto",
  height: "calc(100% - 130px)",
});

// export const FilterCommonBody = styled.div`
//   // height: calc(100% - 50px);
//   margin-bottom: 50px;

//   overflowY: "auto",
//   height: "calc(100% - 132px)",
// `;

export const FilterCommonFooter = styled.div`
  // border: 1px solid blue;
`;

export const CustomSearchField = styled(TextField)({
  "&:focus-within fieldset": {
    border: "1px solid #36415d !important",
  },
  "&:focus-visible fieldset": {
    border: "1px solid #36415d !important",
  },
  "& .MuiOutlinedInput-root": {
    height: "40px",
    paddingLeft: "16px",
    paddingRight: "8px",
    width: "209px",
  },
});

export const DrawerSearchBar = styled("div")({
  width: "209px",
  height: "40px",
  outline: "none",
  padding: "0px 22px 0px 19px",
  marginBottom: "2px",
});

export const SearchContainer = styled(Box)({
  width: " 100%",
  height: "40px",
  outline: "none",
  padding: "8px 20px 0px 20px",
  marginBottom: "2px",
});

export const ButtonsContainer = styled(Box)`
  padding-left: 20px;
  padding-right: 20px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-top: 50px;
`;

export const StyledButton = styled(Button)`
  width: 180px;
  height: 40px;
  text-transform: none;
`;

export const ContainedButton = styled(StyledButton)`
  background-color: #f1742e;
  color: #ffffff;
  &:hover {
    background-color: #f1742e;
    color: #ffffff;
  }
`;

export const OulinedButton = styled(StyledButton)`
  background-color: #ffffff;
  color: #f1742e;
  border-color: #f1742e;
  &:hover {
    background-color: #ffffff;
    border-color: #f1742e;
  }
`;

export const DatePickersContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const DatePickerContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`;

// export const FormElementContainer = styled(Box)({
//   marginTop: '8px'
// })
