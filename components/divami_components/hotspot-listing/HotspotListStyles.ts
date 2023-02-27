import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, MenuItem, TextField } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";

export const HotspotListContainer = styled("div")({
  width: "438px",
  height: "calc(100vh - 60px)",
});

export const HeaderContainer = styled("div")({
  backgroundColor: "white",
  height: "51px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderBottom: "1px solid #d9d9d9",
});

export const TitleContainer = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: "20px",
  paddingRight: "20px",
  color: "#36415D",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",

  // position:"fixed"
});

export const CloseIcon = styled(Image)({
  cursor: "pointer",
  width: "12px",
  height: "12px",
});

export const MiniHeaderContainer = styled(Box)({
  backgroundColor: "white",
  // height: '51px',
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  marginTop: "20px",
  marginBottom: "24px",
  // overflowY: "auto",
  color: "#36415D",
});

export const MiniSymbolsContainer = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  paddingLeft: "20px",
  paddingRight: "20px",
});

export const SearchGlassIcon = styled(Image)({
  cursor: "pointer",
});

export const DividerIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "21px",
});

export const FilterIcon = styled(Image)({
  cursor: "pointer",
  marginRight: "10px",
  marginLeft: "7px",
  width: "24px",
  height: "24px",
});


export const ArrowUpIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "15px",
});
export const ArrowDownIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "27px",
});


export const DueDate = styled(Box)({
  marginLeft: "14px",
});


export const SecondDividerIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "15px",
});

export const DownloadIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "12px",
});


export const BodyContainer = styled(Box)`
  height: calc(100vh - 200px);
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 16px;
  overflow-y: auto;
  margin-top: 16px;
  color: #101f4c;
  padding-bottom: 20px;
  // overflow: scroll;
`;


export const BodyInfo = styled("div")({
  cursor: "pointer",
});

export const FirstHeader = styled("div")({
  display: "flex",
});



export const BodyContTitle = styled("div")({
  marginLeft: "10px",
  cursor: "pointer",
});


export const SecondHeader = styled("div")({
  marginLeft: "35px",
});

export const ThirdHeader = styled("div")({
  display: "flex",
  marginLeft: "35px",
  marginTop: "6px",
  justifyContent: "space-between",
});

export const DueDateDiv = styled("div")({
  fontFamily: '"Open Sans"',
  fontStyle: "italic",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
  color: "#787878",
});

export const HorizontalLine = styled("div")({
  backgroundColor: "#d9d9d9",
  borderBottom: "1px solid #d9d9d9",
  width: "398x",
  marginTop: "18px",
  marginBottom: "20px",
});

export const NoMatchDiv = styled("div")({
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "50px",

  // margin:"auto"
});

export const ImageErrorIcon = styled(Image)({
  cursor: "pointer",
  width: "226px",
  height: "201px",
  // marginLeft: '27px',
});

export const MessageDivShowErr = styled("div")({
  width: "200px",
  height: "38px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
  textAlign: "center",
  color: "#101F4C",
  marginTop: "30px",
  // marginLeft: "12px",
});


export const SearchAreaContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  gap: '10px',
  // marginTop:"30px"
});


export const CustomSearchField = styled(TextField)({
  width: '100%',
  '&:focus-within fieldset': {
    border: '1px solid #36415d !important',
  },
  '&:focus-visible fieldset': {
    border: '1px solid #36415d !important',
  },
  '& .MuiOutlinedInput-root': {
    height: '40px',
    paddingLeft: '16px',
    paddingRight: '8px',
  },
});

export const FunnelIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "16px",
});


export const AppliedFilter = styled("div")({
  border: "1px solid #D9D9D9",
  borderRadius: "40px",
  color: "#F1742E",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
  padding: "6px 6px 6px 15px",
  display: "flex",
  marginLeft: "10px",
  cursor: "pointer",
});


export const IconContainer = styled(Image)({
  cursor: "pointer",
  marginLeft: "16px",
});


export const StyledMenu = styled(MenuItem)({
  borderBottom: "1px solid #D9D9D9",
  width: "178px",
  margin: "0px 20px",
  "&:hover": {
    cursor: "pointer",
  },
  padding: 0,
  height: "38px",
  fontSize: "14px",
});
