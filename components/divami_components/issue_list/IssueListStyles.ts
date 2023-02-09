import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box } from "@mui/material";

export const IssueListContainer = styled("div")({
    width:"438px"
});


export const HeaderContainer = styled("div")({
  backgroundColor: "white",
  height: "51px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
//   borderBottom: Theme?.palette?.smallCaseFontColor,
  borderBottom: "1px solid #d9d9d9",

});

export const TitleContiner = styled("div")({
  width:"100%",
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  paddingLeft:"20px",
  paddingRight:"20px"

})

export const CloseIcon = styled(Image)({
  cursor: "pointer",
});
export  const MiniHeaderContainer = styled(Box)`
  background-color: white;
  height: 51px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
//   border-bottom: 1px solid #d9d9d9;
`

export const MiniSymbolsContainer = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`

export const SearchGlassIcon = styled(Image)`
  cursor: pointer;
`

export const DividerIcon = styled(Image)`
  cursor: pointer;
  margin-left: 21px;
`

export const ArrowUpIcon = styled(Image)`
  cursor: pointer;
  margin-left: 27px;
`
export const DownloadIcon = styled(Image)`
  cursor: pointer;
  margin-left: 12px;
`
export const FunnelIcon = styled(Image)`
  cursor: pointer;
  margin-left: 12px;
`

export const DueDate = styled(Box)`
  margin-left: 14px;
`


export const BodyInfo = styled("div")();

export const BodyContIcon = styled("div")({
//   marginLeft: "25px",
});
export const BodyContTitle = styled("div")({
  marginLeft: "10px",
});

export const SecondHeader = styled("div")({
  marginLeft: "34px",
  marginTop: "6px",

});

export const ThirdHeader = styled("div")({
  display: "flex",
  marginLeft: "34px",
  marginTop: "6px",
  justifyContent: "space-between",
});

export const DueDateDiv = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "italic",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
});

export const HorizontalLine = styled("div")({
  backgroundColor: "#d9d9d9",
  borderBottom: "1px solid #d9d9d9",
  width: "398x",
  marginTop: "20px",
  marginBottom: "20px",
});

export const FirstHeader = styled("div")({
  display: "flex",
});

export const BodyContainer = styled("div")({
  height: "calc(100vh - 134px)",
  paddingLeft:"20px",
  paddingRight:"20px",
  overflow:"scroll"
});


// export const BodyContainer = styled(Box)`
//   height: calc(100vh - 134px);
//   padding-left: 20px;
//   padding-right: 20px;
//   overflow: scroll;
// `