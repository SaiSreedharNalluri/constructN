import { Pagination } from "@mui/material";
import PaginationItem from "@mui/material/PaginationItem";
import { styled } from "@mui/system";

export const TimeLineStyleContainer = styled("div")({
  //   display: "flex",
  //   flexDirection: "column",
  //   width: "400px",
  //   height: "50px",
});

export const SelectedTimeLine = styled("div")({
  boxSizing: "border-box",
  width: "158px",
  height: "22px",
  background: "#FFFFFF",
  border: "1px solid #B5B5B5",
  boxShadow: "5px 4px 8px rgba(200, 200, 200, 0.1)",
  textAlign: "center",
  borderRadius: "4px",
  position: "absolute",
  bottom: "48px",
  left: "45%",
});

export const TimeLinePagination = styled("div")({
  background: "#FFFFFF",
  border: "1px solid #B5B5B5",
  boxShadow: "5px 4px 8px rgba(200, 200, 200, 0.1)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "4px",
  position: "absolute",
  bottom: "25px",
  left: "40%",
  padding: "0px 15px",
});

export const PaginationStyle = styled(Pagination)({
  //   "& .Mui-selected": {
  //     backgroundColor: "transparent",
  //     color: "#19D5C6",
  //   },
  "& .MuiPaginationItem-root": {
    width: "7px",
    height: "7px",
    border: "0.5px solid #36415D",
    background: "white",
    color: "white",
    minWidth: "7px",
  },
  "& .MuiPaginationItem-root.Mui-selected": {
    background: "black",
    width: "7px !important",
    height: "10px",
    minWidth: "7px !important",
    color: "black",
  },
  "&.MuiPagination-ul": {
    "& li": {
      "& button": {
        color: "red",
      },
    },
  },
});
