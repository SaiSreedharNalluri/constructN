import { styled } from "@mui/system";
import Image from "next/image";
import { Box, MenuItem, TextField } from "@mui/material";


export const ArrowIcon = styled(Image)`
  cursor: pointer;
  position:absolute;
  z-index:1;
  top:10px;
  right:55px
  //   margin-right: 10px;
`;


export const SearchIconStyling = styled("div")({
   position:"absolute",
  zIndex:1,
  top:"20px",
  right:"85px"
  // marginTop:"30px"
});


export const SearchAreaContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  gap: "10px",
  // marginTop:"30px"
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
   zIndex:1,
  top:"20px",
  right:"35px"
});