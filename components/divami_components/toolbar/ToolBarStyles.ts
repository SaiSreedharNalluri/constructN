import { styled } from '@mui/system';
import Image from 'next/image';

export const HotspotBox = styled("div")({
  border: "1px solid #d9d9d9",
  borderLeft: "none",
  borderTopRightRadius: "4px",
  borderBottomRightRadius: "4px",
  display: "flex",
  /* justify-content: space-between; */
  alignItems: "center",
  padding: "15px 20px",
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
  padding: "15px 20px",
  "& .MuiDrawer-paper": {
    height: "calc(100% - 60px)",
  },
});

export const TaskTitleDiv = styled("div")({});

export const IssuesSectionPlusImg = styled("div")({
  // width: '12px',
  // height: '12px',
  marginLeft: "8px",
});

export const IssuesSectionFileImg = styled("div")({
  // width: '12px',
  // height: '12px',
  marginLeft: "13px",
});

export const IssuesSectionClipImg = styled("div")({
  // width: '12px',
  // height: '12px',
  marginLeft: "13px",
});

export const SectionToolBar = styled("div")({
  background: "#ffffff",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "18px",
  width: "772px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
});

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
  padding: "15px 20px",
});

export const TypesTitle = styled("div")({
  width: "100px",
});

export const TypeArrowIconDiv = styled("div")({
  marginLeft: "110px",
});

export const TypesRightScroll = styled("div")({
  marginLeft: "auto",
});

export const IssueBox = styled("div")({
  border: "1px solid #d9d9d9",
  borderRight: "none",
  display: "flex",
  alignItems: "center",
  padding: "15px 20px",
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
  padding: "15px 20px",
  position: "relative",
});
export const SelectLayersWrapper = styled("div")({
  top: "50px",
  position: "absolute",
  border: "1px solid #D9D9D9",
  boxShadow: "5px 4px 8px rgb(0 0 0 / 24%)",
  background: "white",
});

export const LayerSecondSectionHexImg = styled("div")({
  // width: '18px',
  // height: '18px',
});

export const LayerSecondSectionCamImg = styled("div")({
  marginLeft: "18px",
  // width: '15px',
  // height: '15px',
});

export const LayerSecondSectionArrImg = styled("div")({
  marginLeft: "26px",
  // width: '15px',
  // height: '15px',
});

export const TaskTitle = styled("div")({
  fontWeight: "400",
  fontSize: "12px",
  // lineHeight:"16px"

})


export const CameraIcon = styled(Image)`
width:18px;
height:18px
`;

export const DownIcon = styled(Image)`
// width:5px;
// height:7px
`;
