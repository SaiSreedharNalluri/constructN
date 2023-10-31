import { TreeItem, TreeView } from "@mui/lab";
import { styled } from "@mui/system";
export const TreeViewContainer = styled("div")({
    width: "250px",
    margin: "0 0 0 0",
    "&::-webkit-scrollbar": {
      background: "#D9D9D9",
      borderRadius: "60px",
      width: "5px",
    },
  });
export const UploaderStyledTreeView = styled(TreeView)({
    "& .Mui-expanded": {
      backgroundColor: "#F4F4F4",
      borderColor: "blue",
    },
    "& .MuiCollapse-root": {
      marginLeft: "0",
      paddingLeft: "25px",
    },
    "& .MuiTreeItem-content": {
      flexDirection: "row-reverse",
      width: "unset",
      padding: "0",
      display:"block !important",
      "& .MuiTreeItem-label": {
        fontSize: "12px",
        lineHeight: "12px",
        padding:"0px",
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
      backgroundColor:"white",
      "& .MuiTreeItem-label": {
        borderBottom: "0",
      },
      "& .MuiTreeItem-content": {
        borderLeft: "1px dotted #D9D9D9",
      },
    },
   
  });
  interface StyledTreeItemProps {
    needClick: boolean;
  }

  export const StyledTreeItem = styled(TreeItem)<StyledTreeItemProps>(
    (props) => ({
      padding: 0,
  "& .MuiCollapse-root": {},
    })
  ) as any;

  export const LabelContainer = styled("div")({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "80%",
    height: "20px",
    position: "relative",
  });

  export const LabelIcon = styled("div")({

  });

  export const StyledSpan = styled("span")({

  });

  export const LabelText = styled("div")({
    height: "40px",
    display: "block",
    paddingTop: "12px",
    paddingLeft: "8px",
    fontFamily: "Open Sans",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: "10px"
  });

  
