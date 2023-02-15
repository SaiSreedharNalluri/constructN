// import styled from "@emotion/styled";
import { TreeItem, TreeView } from "@mui/lab";
import TextField from "@mui/material/TextField";
// import { Typography } from "@mui/material/styles";
import { styled } from "@mui/system";
import Image from "next/image";
import type { SelectLayerContainerProps } from "./Type";

export const TreeViewContainer = styled("div")({
  width: "301px",
  marginTop: "28px",
});
export const CustomInputField = styled(TextField)({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4B",
  border: "1px solid #36415d",
  borderRadius: "6px",
  "& .MuiOutlinedInput-root ": {
    width: "261px",
    height: "40px",
  },
  "& .MuiTextField-endAdornment": {
    display: "none",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root.Mui-focused": {
    border: "0",
    display: "none",
    offset: "none",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "0",
  },
  " & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: "0",
    ouline: "none",
    offset: "0",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root": {
    display: "none",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    ouline: "none",
  },
  "& .MuiInputAdornment-root": {
    paddingLeft: "15px",
  },
  // "& .MuiInputBase-input": {
  //   fontFamily: "Open Sans",
  //   fontStyle: "normal",
  //   fontWeight: 400,
  //   fontSize: 14,
  //   color: "#101F4B",
  //   textTransform: "uppercase",
  // },
});
// export const useStyles = makeStyles({
//   root: {
//     "& .Mui-expanded": {
//       backgroundColor: "#F4F4F4",
//       borderColor: "red",
//     },
//     "& .MuiCollapse-root": {
//       marginLeft: "0",
//       paddingLeft: "25px",
//     },
//     "& .MuiTreeItem-content": {
//       flexDirection: "row-reverse",
//       width: "unset",
//       padding: "0",
//       paddingRight: "20px",
//       paddingLeft: "20px",
//       "& .MuiTreeItem-label": {
//         padding: "10px 0px 10px 0px",
//         fontSize: "14px",
//         lineHeight: "18px",
//         borderBottom: "1px solid #E7E7E7",
//       },
//     },
//     "& .MuiTreeItem-content.MuiTreeItem-content.Mui-selected": {
//       backgroundColor: "#F4F4F4",
//     },
//     " & .MuiTreeView-root": {
//       "& .MuiTreeItem-content": {
//         backgroundColor: "#ff0000",
//       },
//     },
//     "& ul": {
//       backgroundColor: "#F4F4F4",
//       "& .MuiTreeItem-label": {
//         borderBottom: "0",
//       },
//       "& .MuiTreeItem-content": {
//         borderLeft: "1px dotted #D9D9D9",
//       },
//     },
//     // "& .MuiTreeItem-content:hover": {
//     //   background: "none",
//     // },
//   },
// });

export const StyledTreeView = styled(TreeView)({
  "& .Mui-expanded": {
    backgroundColor: "#F4F4F4",
    borderColor: "red",
  },
  "& .MuiCollapse-root": {
    marginLeft: "0",
    paddingLeft: "25px",
  },
  "& .MuiTreeItem-content": {
    flexDirection: "row-reverse",
    width: "unset",
    padding: "0",
    paddingRight: "20px",
    paddingLeft: "20px",
    "& .MuiTreeItem-label": {
      padding: "10px 0px 10px 0px",
      fontSize: "14px",
      lineHeight: "18px",
      borderBottom: "1px solid #E7E7E7",
    },
  },
  "& .MuiTreeItem-content.MuiTreeItem-content.Mui-selected": {
    backgroundColor: "#FFF2EB",
    color: "#F1742E",
  },
  " & .MuiTreeView-root": {
    "& .MuiTreeItem-content": {
      backgroundColor: "#ff0000",
    },
  },
  "& ul": {
    backgroundColor: "#F4F4F4",
    "& .MuiTreeItem-label": {
      borderBottom: "0",
    },
    "& .MuiTreeItem-content": {
      borderLeft: "1px dotted #D9D9D9",
    },
  },
  // "& .MuiTreeItem-content:hover": {
  //   background: "none",
  // },
});

// display: ${(props) => (props.openselectlayer ? null : "none")};

export const ProjectHierarchyContainer = styled(
  "div"
)<SelectLayerContainerProps>({
  display: "null",
  width: "301px",
  boxShadow: "5px 4px 8px rgba(200, 200, 200, 0.1)",
  backgroundColor: "#fff",
});
export const StyledTreeItem = styled(TreeItem)({
  padding: 0,
});

export const HeaderLabelContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 22px 15px 19px",
});

export const SearchContainer = styled("div")({
  // width: "261px",
  // height: "40px",
  outline: "none",
  padding: "20px 0px 0px 20px",
  marginBottom: "2px",
});

export const HeaderLabel = styled("div")({
  fontSize: "16px",
  fontWeight: "400",
});
export const CloseIcon = styled(Image)({
  cursor: "pointer",
});
