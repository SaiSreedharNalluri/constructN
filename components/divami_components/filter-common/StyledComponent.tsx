import styled from '@emotion/styled'
import { Box, Button, TextField, Typography } from '@mui/material';



export const FilterCommonMain  = styled("div")({
  width: "438px",
  height: "100%",
});
export const HeaderContainer = styled("div")({
  backgroundColor: "white",
  height: "51px",
  display: "flex",
  // justifyContent: "center",
  alignItems: "center",
  width: "100%",
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


export const HeaderLeftSection = styled.div`
  // padding-left: 20px;
`

export const HeaderLeftSectionText = styled.div``

export const HeaderRightSection = styled.div`
  // margin-right: 20px;
  width: 100px;
  display: flex;
  align-items: center;
`
export const HeaderRightSectionResetIcon = styled.div`
  margin-right: 7px;
  // width: 100%;
  // height: 100%;
`

export const HeaderRightSectionResetText = styled.div`
  margin-right: 10px;
  border-right: 1px solid #d9d9d9;
  padding-right: 15px;
`

export const HeaderRightSectionCancel = styled.div``

export const FilterCardContainer = styled.div`
  margin-top: 20px;
`

export const FilterCardTitle = styled.div`
  padding-left: 20px;
`

export const FormElementContainer = styled(Box)`
  margin-top: 30px;
  padding-left: 20px;
  padding-right: 20px;
`

export const StyledLabel = styled(Typography)`
  font-weight: 400;
  line-height: 20px;
  font-size: 14px;
  margin-bottom: 8px;
`

export const FilterCardTitleText = styled.div``

export const FilterCardSelectAll = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding-bottom: 10px;
  margin-left: 20px;
  margin-right: 20px;
  border-bottom: 1px solid #d9d9d9;
`

export const FilterCardSelectAllSpan = styled.span`
  display: flex;
`

export const FilterCardSelectAllText = styled.div`
  margin-left: 10px;
`

export const FilterCardOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0px 20px;
`

export const FilterCardOptionContainer = styled.div`
  width: 50%;
`

export const FilterCardOptionSpan = styled.span`
  display: flex;
  margin-top: 10px;
`



export const FilterCommonHeader = styled.div`
  height: 52px;
`

export const FilterCommonBody = styled.div`
  height: calc(100% - 50px);
`

export const FilterCommonFooter = styled.div`
  // border: 1px solid blue;
`


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
  width:" 100%",
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
  margin-top: 50px;
`


export const StyledButton = styled(Button)`
  width: 180px;
  height: 40px;
  text-transform: none;
`

export const ContainedButton = styled(StyledButton)`
  background-color: #f1742e;
  color: #ffffff;
  &:hover {
    background-color: #f1742e;
    color: #ffffff;
  }
`

export const OulinedButton = styled(StyledButton)`
  background-color: #ffffff;
  color: #f1742e;
  border-color: #f1742e;
  &:hover {
    background-color: #ffffff;
    border-color: #f1742e;
  }
`

export const DatePickersContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
`

export const DatePickerContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`