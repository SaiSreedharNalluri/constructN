import { TreeItem, TreeView } from "@mui/x-tree-view";
import { Menu, MenuProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import type { SelectLayerContainerProps } from "./Type";
import { styled } from "@mui/system";

export const TreeViewContainer = styled("div")({
  // width: "252px",
  // width: "252px",
  //
  marginTop: "10px",
});

export const TreeItemLabelContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
});

export const TreeLabelContainer = styled(Box)({
  display: "inline",
  fontSize: "14px",
  color: "#101F4C",
  fontWeight: "400",
  lineHeight: "19px",
  fontFamily: "Open Sans",
});

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
    paddingRight: "10px",
    paddingLeft: "10px",
    // marginRight: "10px",
    borderBottom: "1px solid #E7E7E7",
    "& .MuiTreeItem-label": {
      fontSize: "14px",
      lineHeight: "18px",
      // borderBottom: "1px solid #E7E7E7",
    },
  },
  "& .MuiTreeItem-iconContainer": {
    height: "18px",
    padding: "10px 10px 10px 0px",
    // borderBottom: "1px solid #e7e7e7",
  },
  "& .MuiTreeItem-content.MuiTreeItem-content.Mui-selected": {
    backgroundColor: "#f4f4f4",
  },
  "& .MuiTreeView-root": {
    "& .MuiTreeItem-content": {
      backgroundColor: "#ff0000",
    },
  },
  "& ul": {
    backgroundColor: "#F4F4F4",
    "& .MuiTreeItem-label": {
      borderBottom: "0",
    },
  },
  "& .MuiTreeItem-content:hover": {
    background: "none",
  },
  "& .MuiCollapse-wrapper": {
    "& .MuiTreeItem-iconContainer": {
      border: "0",
    },
    "& .MuiTreeItem-label": {
      border: "0",
    },
  },
  "& .Mui-selected": {
    "& .MuiTreeItem-iconContainer": {
      border: "0",
    },
    "& .MuiTreeItem-label": {
      border: "0",
    },
  },
});

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transitionDuration={10}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  

}));
export const SelectLayerContainer = styled(Box)((props: any) => ({
  display: props.openselectlayer ? "" : "none",
  // width: "250px",
  width: "236px",
  boxShadow: "5px 4px 8px rgba(200, 200, 200, 0.1)",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
})) as any;

export const StyledTreeItem = styled(TreeItem)`
  padding: 0;
`;

export const HeaderLabelContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 22px 15px 19px",

  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
});

export const SearchContainer = styled(Box)({
  width: "261px",
  height: "40px",
  outline: "none",
  padding: "0 22px 0px 19px",
  marginBottom: "2px",
});

export const HeaderLabel = styled(Typography)({
  fontSize: "14px",
  fontWeight: "400",
  color: "#101F4C",
  fontFamily: "Open Sans",
  "& .MuiTypography-root": {
    color: "#101F4C",
  },
});

export const CloseIcon = styled(Image)({
  cursor: "pointer",
});
