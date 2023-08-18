import { Pagination } from "@mui/material";
import PaginationItem from "@mui/material/PaginationItem";
import { styled } from "@mui/system";
import Image from "next/image";

export const TimeLineStyleContainer = styled("div")(
  ({ isFullScreen }: any) => ({
    //   display: "flex",
    //   flexDirection: "column",
    //   width: "400px",
    //   height: "50px",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    // margin: "0 auto",
    left: "0",
    right: "0",
    bottom: "0px",
    height: 0,
    // bottom: "40px",
    // height: "56px",
    zIndex: "1",
    cursor: "pointer",
  })
) as any;

export const TimelineDots = styled("div")({
  display: "flex",
  overflow: "hidden",
});

export const TimelineNavigation = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  background: "white",
  border: "1px solid #888888",
  boxShadow: "5px 4px 8px rgba(200, 200, 200, 0.1)",
  padding: "8px 15px",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  justifyContent: "center",

  // bottom: "0",
});
export const SelectedTimeLine = styled("div")({
  boxSizing: "border-box",
  // width: "158px",
  background: "#FFFFFF",
  border: "1px solid #888888",
  boxShadow: "5px 4px 8px  inset rgba(200, 200, 200, 0.3)",

  borderRadius: "4px",
  position: "absolute",

  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
 
  fontSize: "12px",
  color: "#101F4C",
  padding: "6px 10px",
});

export const CircleIcon = styled("div")(({ active }: any) => ({
  display: "block",
  width: "7px",
  height: "7px",
  border:active?"1px double #FF843F": "1px solid #101F4C",
  borderRadius: "50%",
  background: active ? "#FF843F" : "white",
  marginRight: "10px",
  color: "transparent",
})) as any;

export const DateText = styled("div")(({ active }: any) => ({
  marginRight: "10px",
  fontSize: "12px",
  color: "#101F4C",
}));

export const LeftIconImage = styled(Image)({
  marginRight: "10px",
});

export const RightIconImage = styled(Image)({
  marginRight: "10px",
});

export const TimeLinePagination = styled("div")({
  background: "#FFFFFF",
  border: "1px solid #B5B5B5",
  boxShadow: "5px 4px 5px rgba(200, 200, 200, 0.1)",
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
