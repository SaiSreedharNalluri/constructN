import { styled } from "@mui/system";
import Image from "next/image";
import { Box, MenuItem, TextField } from "@mui/material";

import MaterialTable, { MTableToolbar } from "material-table";



export const SectionsListContainer = styled("div")({
  // padding: "20px",
  // paddingTop:"1px",
  // paddingLeft:"1px",
  // width: "100%",
  // boxShadow:"0px 2px 3px rgba(0, 0, 0, 0.3)"
});
export const ArrowIcon = styled(Image)`
  cursor: pointer;
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 55px;
  //   margin-right: 10px;
`;

export const SearchIconStyling = styled("div")({
  position: "absolute",
  zIndex: 1,
  top: "20px",
  right: "85px",
  // marginTop:"30px"
});

export const SearchAreaContainer = styled("div")((props: any) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  gap: "10px",
  height: "24px",
  marginRight: props.marginRight ? "22px" : "",
  // marginTop:"30px"
})) as any;

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
    bottom: "8px",
  },
});

export const CloseIcon = styled(Image)({
  cursor: "pointer",
  width: "12px",
  height: "12px",
});

export const SearchGlassIcon = styled(Image)({
  cursor: "pointer",
});

export const FunnelIcon = styled(Image)({
  cursor: "pointer",
  marginLeft: "16px",
  position: "absolute",
  zIndex: 1,
  top: "20px",
  right: "35px",
});


export const TableHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  paddingBottom: "10px",
  fontSize: "18px",
  fontWeight: 400,
  fontFamily: "Open Sans",
});

export const Header = styled("div")({
  flexGrow: "1",
});

export const HeaderActions = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  maxHeight: "68px",
});

export const HeaderImage = styled(Image)({
  marginRight: "20px",
  width: "24px",
  height: "24px",
});

export const TableWrapper = styled("div")({
  marginBottom: "50px",
});

export const StyledTable = styled(MaterialTable)({});
