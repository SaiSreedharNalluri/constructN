import { styled } from "@mui/system";
import Image from "next/image";

export const HotspotBox = styled("div")({
  border: "1px solid #d9d9d9",
  borderLeft: "none",
  borderTopRightRadius: "4px",
  borderBottomRightRadius: "4px",
  display: "flex",
  /* justify-content: space-between; */
  alignItems: "center",
  padding: "15px 20px 14px 20px",
});

export const HotspotTitleDiv = styled("div")({});

export const HotspotImageContainerDiv = styled("div")({
  display: "flex",
  alignItems: "center",
  width: "100%",
});

export const HotspotSectionFileTextImg = styled("div")({
  marginLeft: "13px",
});

export const HotspotCircleDiv = styled("div")({
  marginLeft: "20px",
});

export const HotspotGroupIcon = styled("div")({
  // marginLeft: "54px",
});

export const TaskBox = styled("div")({
  border: "1px solid #d9d9d9",
  borderRight: "none",
  display: "flex",
  /* justify-content: space-between; */
  alignItems: "center",
  padding: "15px 20px 14px 20px",
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
  marginTop: "14px",
  // width: props.viewMode === "Reality" ? "620px" : "772px",
  width: "fit-content",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "0px 2px 1px rgba(0, 0, 0, 0.25)",
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
  width: "250px",
});

export const TypesTitle = styled("div")({
  width: "100px",
});

export const TypeArrowIconDiv = styled("div")({
  marginLeft: "110px",
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
  padding: "15px 20px 14px 20px",
  width: "167px",
});

export const IssueTitle = styled("div")({
  fontWeight: "400",
  fontSize: "12px",
  // lineHeight:"16px"
});

export const LayersWrapper = styled("div")({
  border: "1px solid #d9d9d9",
  borderRight: "none",
  display: "flex",
  alignItems: "center",
  padding: "15px 20px 14px 20px",

  position: "relative",
  width: "190px",
});

export const IconsContainer = styled("div")({
  minWidth: "108px",
  display: "flex",
  alignItems: "center",
});
export const SelectLayersWrapper = styled("div")({
  top: "63px",
  position: "absolute",
  border: "1px solid #D9D9D9",
  boxShadow: "5px 4px 8px rgb(0 0 0 / 24%)",
  background: "white",
  fontSize: "14px",
});

export const LayerSecondSectionCamImg = styled("div")({
  marginRight: "14px",
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
  // lineHeight:"16px"
});

export const CameraIcon = styled(Image)({
  width: "18px",
  height: "18px",
  cursor: "pointer",
  margin: "0 12px",
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
  paddingRight: "35px",
  borderRight: "transparent",
  width: "270px",
});

export const CompareIcon = styled("div")((props: any) => ({
  // width: "30px",
  // height: "30px",
  borderRight: "1px solid #F1742E",
  padding: "6px",
  background: props.active === "hideCompare" ? "#F1742E" : "white",
})) as any;
export const DesignCompareViewIcon = styled("div")((props: any) => ({
  borderRight: "1px solid #F1742E",
  padding: "6px",
  background: props.active === "compareDesign" ? "#F1742E" : "white",
})) as any;
export const RealityCompareViewIcon = styled("div")((props: any) => ({
  borderRight: "1px solid #F1742E",
  padding: "6px",
  borderTopRightRadius: "4px",
  borderBottomRightRadius: "4px",
  paddingTop: "8px",
  background: props.active === "compareReality" ? "#F1742E" : "white",
})) as any;
export const CompareViewTitleDiv = styled("div")({});
export const CompareContainer = styled("div")({
  background: "#FFFFFF",
  borderLeft: "1px solid #F1742E",
  borderTop: "1px solid #F1742E",
  borderBottom: "1px solid #F1742E",
  borderRadius: "4px",
  display: "flex",
  marginLeft: "6px",
}) as any;
