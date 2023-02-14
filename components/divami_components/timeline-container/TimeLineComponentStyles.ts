import { Pagination } from "@mui/material";
import PaginationItem from "@mui/material/PaginationItem";
import { styled } from "@mui/system";

export const TimeLineStyleContainer = styled("div")({
  //   display: "flex",
  //   flexDirection: "column",
  //   width: "400px",
  //   height: "50px",
  position: "absolute",
  width: "400px",
  margin: "0 auto",
  left: "0",
  right: "0",
  bottom: "20px",
  height: "56px",
});

export const SelectedTimeLine = styled("div")({
  boxSizing: "border-box",
  width: "158px",
  height: "24px",
  background: "#FFFFFF",
  border: "1px solid #B5B5B5",
  boxShadow: "5px 4px 8px rgba(200, 200, 200, 0.1)",
  textAlign: "center",
  borderRadius: "4px",
  position: "absolute",
  left: "120px",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
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
  bottom: "0",
  padding: "0px 15px",
  width: "100%",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
});

export const PaginationStyle = styled(Pagination)({
  "& .Mui-selected": {
    backgroundColor: "transparent",
    color: "#19D5C6",
  },
  "& .MuiPagination-root": {
    maxWidth: "163px",
  },
  // '& .MuiPaginationItem-root': {
  //   width: '7px',
  //   height: '7px',
  //   border: '0.5px solid #36415D',
  //   background: 'white',
  //   color: 'white',
  //   minWidth: '7px',
  // },
  // '& .MuiPaginationItem-root.Mui-selected': {
  //   background: 'black',
  //   width: '7px !important',
  //   height: '10px',
  //   minWidth: '7px !important',
  //   color: 'black',
  //   borderRadius: '50%',
  // },
  "& .MuiPagination-ul": {
    "& li:not(:first-child):not(:last-child)": {
      "& .MuiPaginationItem-root.Mui-selected": {
        background: "black",
        width: "14px !important",
        height: "14px",
        minWidth: "14px !important",
        color: "black",
        borderRadius: "50%",
      },
      "& button": {
        width: "7px",
        height: "13px",
        border: "0.5px solid #36415D",
        borderRadius: "50%",
        background: "white",
        color: "white",
        minWidth: "7px",
        marginRight: "10px",
      },
    },
  },
  "& li:last-child": {
    marginLeft: "-10px",
  },
});
