import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, MenuItem, TextField } from "@mui/material";

export const TaskListContainer = styled("div")({
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
});

export const CloseIcon = styled(Image)({
  cursor: "pointer",
  width: "12px",
  height: "12px",
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
export const SecondDividerIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "15px",
});

export const ArrowUpIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "15px",
});

export const DownloadIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "12px",
});

export const IconContainer = styled(Image)({
  cursor: "pointer",
  marginLeft: "16px",
});

export const FilterIcon = styled(Image)({
  cursor: "pointer",
  marginRight: "10px",
  marginLeft: "7px",
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

export const DueDate = styled(Box)({
  marginLeft: "14px",
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

export const FirstHeader = styled("div")({
  display: "flex",
});

export const BodyInfo = styled("div")({
  cursor: "pointer",
});

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
  color: "#787878",
});

export const ArrowDownIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "27px",
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

export const CustomSearchField = styled(TextField)({
  width: "100%",
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
  },
});

export const SearchAreaContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  gap: "10px",
  // marginTop:"30px"
});

export const MessageDiv = styled("div")({
  // border: "1px solid red",
  // marginLeft: "10px",
  marginTop: "30px",
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
  lineHeight: "20px",
  color: "#101F4C",
  fontFamily: "Open Sans",
  fontWeight: "400"
});

export const LoadMoreText = styled("div")({
  fontFamily: "Open Sans",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "21.79px",
  textAlign: "center",
  color: "#FF843F",
  cursor: "pointer",
});

export const ErrorImageDiv = styled("div")({
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

export const RaiseButtonDiv = styled("div")({
  width: "180px",
  height: "40px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "16px",
  textAlign: "center",
  color: "#FFFFFF",
  marginTop: "20px",
  background: "#FF843F",
  borderRadius: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  // marginLeft: "20px",
});

export const ContentError = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "22px",
  color: " #101F4C",
  width: "245px",
  height: "22px",
  marginTop: "100px",
});

export const ContentErrorSpan = styled("span")({
  // marginLeft:"2px"
  color: "rgba(255, 132, 63, 1)",
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
interface ContainerProps {
  searchingOn: boolean;
}

interface ContainerHeaderProps {
  searchingOn: boolean;
}

export const CustomBox = styled(Box)<ContainerProps>`
  margin-top: ${(props) => (props.searchingOn ? "10px" : "")};
`;



export const MiniHeaderContainer = styled(Box)<ContainerHeaderProps>`
  margin-bottom: ${(props) => (props.searchingOn ? "24px" : "20px")};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  color: #36415d;
`;