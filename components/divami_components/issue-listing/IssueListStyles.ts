import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";

export const TaskListContainer = styled("div")({
  width: "438px",
  height: "100%",
});

export const HeaderContainer = styled("div")({
  backgroundColor: "white",
  height: "51px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "34%",
  borderBottom: "1px solid #d9d9d9",
  position: "fixed",
  zIndex:"50"
});

export const TitleContainer = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: "20px",
  paddingRight: "20px",
color: "#36415D",

    // position:"fixed"

});

export const CloseIcon = styled(Image)({
  cursor: "pointer",
});

export const MiniHeaderContainer = styled(Box)({
  backgroundColor: "white",
  height: "51px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  marginTop: "60px",
  overflowY: "auto",
  color: "#36415D",
});

// border-bottom: 1px solid #d9d9d9;

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

export const ArrowUpIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "27px",
});

export const ArrowDownIcon  = styled(Image)({
  cursor: "pointer",
  marginLeft: "27px",
});

export const DownloadIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "12px",
});

export const FunnelIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "12px",
});

export const DueDate = styled(Box)({
  marginLeft: "14px",
});

export const BodyContainer = styled(Box)`
  height: 71%;
  padding-left: 20px;
  padding-right: 20px;
  margin-top:16px;
  overflow-y: auto;
  margin-top:16px;
  color: #101F4C;


  

  // overflow: scroll;


`;

export const FirstHeader = styled("div")({
  display: "flex",
});

export const BodyInfo = styled("div")({});

export const BodyContTitle = styled("div")({
  marginLeft: "10px",
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
   color:"#787878"
});

export const HorizontalLine = styled("div")({
  backgroundColor: "#d9d9d9",
  borderBottom: "1px solid #d9d9d9",
  width: "398x",
  marginTop: "18px",
  marginBottom: "20px",
});

export const LoadMoreContainer = styled("div")({
  border: "1px solid #d9d9d9",
  display: "flex",
});

export const LoadMoreButton = styled("div")({
  border: "1px solid red",
});

export const ArrowUpContainer = styled("div")({
  border: "1px solid red",
  marginLeft: "10px",
});


export const MessageDiv = styled("div")({
  // border: "1px solid red",
  // marginLeft: "10px",
  marginTop:"30px"
});


