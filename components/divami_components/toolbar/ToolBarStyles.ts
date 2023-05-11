import { MenuItem } from "@mui/material";
import { styled } from "@mui/system";
import Image from "next/image";

export const HotspotBox = styled("div")({
  border: "1px solid #d9d9d9",
  // borderLeft: 'none',
  borderTopRightRadius: "4px",
  borderBottomRightRadius: "4px",
  display: "flex",
  /* justify-content: space-between; */
  alignItems: "center",
  // padding: '15px 20px 14px 20px',
  padding: "15px 20px 14px 15px",
});

export const HotspotTitleDiv = styled("div")({
  fontWeight: "400",
  fontSize: "12px",
});

export const ContainerDiv = styled("div")({});

export const HotspotImageContainerDiv = styled("div")({
  display: "flex",
  alignItems: "center",
  width: "100%",
});

export const HotspotSectionFileTextImg = styled("div")({
  // marginLeft: '13px',
});

export const HotspotCircleDiv = styled("div")({
  // marginLeft: '12px',
});

export const HotspotGroupIcon = styled("div")({
  // marginLeft: "54px",
});

export const TaskBox = styled("div")({
  border: "1px solid #d9d9d9",
  // borderRight: 'none',
  display: "flex",
  alignItems: "center",
  width: "164px",
  justifyContent: "center",
  borderTopRightRadius: "4px",
  borderBottomRightRadius: "4px",
  // padding: '15px 20px 14px 20px',
  padding: "15px 7px 14px 15px",
  "& .MuiDrawer-paper": {
    height: "calc(100% - 60px)",
  },
});

export const TaskTitleDiv = styled("div")({});

export const IssuesSectionPlusImg = styled("div")({
  // width: '12px',
  // height: '12px',
  // marginLeft: '8px',
  // margin: '0 6px'
});

export const IssuesSectionFileImg = styled("div")({
  // width: '12px',
  // height: '12px',
  // margin: '0 6px',
});

export const IssuesSectionClipImg = styled("div")({
  // width: '12px',
  // height: '12px',
  // margin: '0 6px',
});

export const SectionToolBar = styled("div")((props: any) => ({
  background: "#ffffff",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "18px",
  // marginTop: "14px",
  marginTop: "10px",

  // width: props.viewMode === "Reality" ? "620px" : "772px",
  width: "fit-content",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  // boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.25)',
  borderRadius: "4px",
})) as any;

export const ToolbarContainer = styled("div")({
  display: "flex",
});

export const TypeParentCont = styled("div")({
  border: "1px solid #d9d9d9",
  borderTopLeftRadius: "4px",
  borderBottomLeftRadius: "4px",
  borderRight: "none",
  display: "flex",
  alignItems: "center",
  padding: "15px 20px 14px 20px",
  // width: '250px',
  width: "250px",
});

export const TypesTitle = styled("div")({
  width: "156px",
  color: "#101F4C",
});

export const TypeArrowIconDiv = styled("div")({
  marginLeft: "40px",
  cursor: "pointer",
});

export const TypesRightScroll = styled("div")({
  marginLeft: "auto",
});

export const IssueBox = styled("div")({
  border: "1px solid #d9d9d9",
  borderRight: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "15px 7px 14px 15px",
  width: "167px",
});

export const IssueTitle = styled("div")({
  fontWeight: "400",
  fontSize: "12px",
  color: "#101F4C",
  // lineHeight:"16px"
});

export const LayersWrapper = styled("div")({
  // minWidth: '250px !important',
  minWidth: "238px !important",
  border: "1px solid #d9d9d9",
  borderRight: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "15px 20px 14px 20px",
});

export const IconsContainer = styled("div")({
  // minWidth: '108px',
  display: "flex",
  alignItems: "center",
});

interface selectLayerWrapperProps {
  typeOfWindow: "type" | "layer";
}
export const SelectLayersWrapper = styled("div")(
  (props: selectLayerWrapperProps) => ({
    // top: "62px",
    top: "58px",

    position: "absolute",
    left: props.typeOfWindow === "type" ? "1px" : "250px",
    // left: props.typeOfWindow === 'type' ? '1px' : '238px',

    // border: '1px solid #D9D9D9',
    boxShadow: "5px 4px 8px rgb(0 0 0 / 24%)",
    background: "white",
    fontSize: "14px",
    zIndex: -1,
    width: "250px",
  })
);

export const LayerSecondSectionCamImg = styled("div")({
  // marginRight: "14px",
  // width: '15px',
  // height: '15px',
});

export const LayerSecondSectionArrImg = styled("div")({
  marginLeft: "50px",
  cursor: "pointer",
  // width: '15px',
  // height: '15px',
});

export const TaskTitle = styled("div")({
  fontWeight: "400",
  fontSize: "12px",
  color: "#101F4C",
  // lineHeight:"16px"
});

export const CameraIcon = styled(Image)({
  width: "18px",
  height: "18px",
  cursor: "pointer",
  margin: "0 7px",
});

export const GroupIcon = styled(Image)({
  width: "18px",
  height: "18px",
  cursor: "pointer",
});

export const DownIcon = styled(Image)({
  // width:"5px",
  // height:"7px"
});

export const CompareViewBox = styled("div")({
  display: "flex",
  alignItems: "center",
  border: "1px solid #d9d9d9",
  padding: "0 20px",
  // paddingRight: '35px',
  paddingRight: "20px",

  borderRight: "transparent",
  // width: '270px',
  width: "230px",
  borderTopRightRadius: "4px",
  borderBottomRightRadius: "4px",
});

export const CompareIcon = styled("div")((props: any) => ({
  // width: "30px",
  // height: "30px",
  borderRight: "1px solid #F1742E",
  padding: "6px",
  background: props.active === "hideCompare" ? "#F1742E" : "white",
  borderTopLeftRadius: 3,
  borderBottomLeftRadius: 3,
  cursor: "pointer",
})) as any;
export const DesignCompareViewIcon = styled("div")((props: any) => ({
  borderRight: "1px solid #F1742E",
  padding: "6px",
  background: props.active === "compareDesign" ? "#F1742E" : "white",
  cursor: "pointer",
})) as any;
export const RealityCompareViewIcon = styled("div")((props: any) => ({
  borderRight: "1px solid #F1742E",
  padding: "6px",
  borderTopRightRadius: "3px",
  borderBottomRightRadius: "3px",
  paddingTop: "8px",
  background: props.active === "compareReality" ? "#F1742E" : "white",
  cursor: "pointer",
})) as any;
export const CompareViewTitleDiv = styled("div")({
  color: "#101F4C",
});
export const CompareContainer = styled("div")({
  background: "#FFFFFF",
  borderLeft: "1px solid #F1742E",
  borderTop: "1px solid #F1742E",
  borderBottom: "1px solid #F1742E",
  borderRadius: "4px",
  display: "flex",
  marginLeft: "6px",
}) as any;




export const MoreOptionBox = styled("div")({
  display: "flex",
  alignItems: "center",
  border: "1px solid #d9d9d9",
  padding: "0 20px",
  // paddingRight: '35px',
  paddingRight: "20px",

  borderRight: "transparent",
  // width: '270px',
  width: "175px",
  borderTopRightRadius: "4px",
  borderBottomRightRadius: "4px",
});

export const MoreOptionContainer = styled("div")({
 cursor:"pointer"
});


export const StyledOptionMenu = styled("div")({
  // borderBottom: "1px solid #D9D9D9",
  width: "293px",
  // margin: "0px 20px",
  "&:hover": {
    cursor: "pointer",
    backgroundColor:"tranparent !important"
    
  },
  padding: 0,
  // height: "38px",
  // fontSize: "14px",
  // lineHeight: "20px",
  // color: "#101F4C",
  // fontFamily: "Open Sans",
  // fontWeight: "400",
});

export const OptionListContainer = styled("div")({
  paddingLeft: "20px",
  paddingRight: "20px",
  paddingTop: "20px",
  paddingBottom:"20px",
  // border: "2px solid blue",
});

export const OptionTaskContainer = styled("div")({

})

export const TaskHeader = styled("div")({
//   font-family: 'Open Sans';
// font-style: normal;
// font-weight: 500;
// font-size: 16px;
// line-height: 20px;
  
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "16px",
  color:"#101F4C"
})

export const TaskOptionContainer = styled("div")({

})


export const CreateTaskDiv = styled("div")({
  display: "flex",
  marginTop: "18px",
  alignItems:"center"
})


export const OptionSectionPlusImg = styled("div")({
  // width: '12px',
  // height: '12px',
  // marginLeft: '8px',
  // margin: '0 6px'
});


export const OptionCameraIcon = styled(Image)({
  width: "24px",
  height: "24px",
  cursor: "pointer",
  // margin: "0 7px",
});

export const CreateOptionTask = styled("div")({
  marginLeft:"13px",
fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  color:"#101F4C"
});


export const HorizontalLineOpt = styled("div")({
  border: "1px solid #D9D9D9",
  marginTop:"20px"
});

export const TaskListDiv = styled("div")({
  display: "flex",
  marginTop: "18px",
  alignItems:"center"
})

export const TaskMarkupDiv = styled("div")({
  display: "flex",
  marginTop: "18px",
  alignItems:"center"
})

export const SwitchDiv = styled("div")({
 display: "flex",
  alignItems: "center",
  marginLeft:"auto"
})

export const SwitchText = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  color:"#101F4C"

})


export const OptionHotspotContainer = styled("div")({
marginTop:"30px"
})