import { TextField, Box, ListItem, List } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

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

export const DrawerHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 22px 15px 19px",
});
export const DrawerBox = styled(Box)({
  width: "253px",
  border: "1px solid #b5b5b5",
  boxShadow: "5px 4px 8px rgba(200, 200, 200, 0.1)",
});

export const DrawerHeaderTitle = styled("div")({});

export const CloseIconStyled = styled(CloseIcon)({
  cursor: "pointer",
});

export const DrawerSearchBar = styled("div")({
  width: "209px",
  height: "40px",
  outline: "none",
  padding: "0px 22px 0px 19px",
  marginBottom: "2px",
});

export const ListItemStyled = styled(ListItem)({
  paddingLeft: "22px",
  height: "34px",
  "&:hover": {
    backgroundColor: "#fff2eb",
    color: "#f1742e",
    cursor: "pointer",
  },
});
export const ListStyled = styled(List)({
  fontWeight: 400,
  "& .MuiListItem-root": {
    height: "38px",
  },
  "& .MuiDivider-root": {
    margin: "0px 10px",
  },
});
