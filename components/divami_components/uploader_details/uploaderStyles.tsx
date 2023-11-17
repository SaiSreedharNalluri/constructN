import { TreeItem, TreeView } from "@mui/lab";
import { styled } from "@mui/system";
export const TreeViewContainer = styled("div")({
    width: "250px",
    margin: "10px 0 0 0",
    paddingTop:'0px',
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
        marginTop:"2px",
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
    // justifyContent: 'center',
    alignItems: 'center',
    width: "80%",
    height: "34px",
    // position: "relative",
  });

  export const LabelIcon = styled("div")({

  });

  export const StyledSpan = styled("span")({

  });

  export const LabelText = styled("div")({
    // height: "40px",
    // display: "block",
    // paddingTop: "10px",
    // paddingBottom: "10px",
    // paddingLeft: "8px",
    // fontFamily: "Open Sans",
    // fontSize: "12px",
    // fontStyle: "normal",
    // fontWeight: "400",
    marginLeft: "12px",
    marginTop:"2px",
    color:"#101f4c"
    // margin:"0px 20px"
  });

 export const nextButtonStyle = {
  display:"flex",
  flexDirection:"row",
  justifyContent:"center",
  alignItems:"center",
  padding:"8px 8px 8px 7px",
  gap:"10px",
  width:"77px",
  height:"35px",
  border: "1px solid #F1742E",
  backgroundColor:"#F1742E",
  boxSizing: "border-box",
  borderRadius:"4px",
  fontFamily:"Open Sans",
  fontStyle:"normal",
  fontWeight:"600",
  fontSize:"14px",
  lineHeight:"19px",
  color:"#F1742E",
  order:"1",
  
};
 export  const backbuttonStyle = {
  fontFamily: "Open Sans",
  fontWeight: "600",
  fontSize: "14px",
  lineHeight: "19px",
  textAlign: "center",
  color: "#F1742E",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: '8px',
  gap: "4px",
  width: "71px",
  height: "35px",
  order:"0",
};

