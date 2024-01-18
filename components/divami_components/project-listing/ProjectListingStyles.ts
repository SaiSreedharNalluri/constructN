import { styled } from "@mui/system";
import Image from "next/image";
export const ProjectsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  
});

export const StyledFilterText = styled("div")({
  fontSize: "16px",
  color: "#101F4C",
  marginTop: "20px",
});

export const ProjectsListItemContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  border: "1px solid #888888",
  marginBottom: "40px",
  padding: "20px",
  width: "100%",
});

export const ProjectNameContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "25%",
  justifyContent: "center",
});

export const ProjectName = styled("div")({
  display: "flex",
  flexDirection: "row",
  marginBottom: "18px",
  color: "#101F4C",
  marginTop: "10px",
});

export const ProjectDetailsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "75%",
});

export const Divider = styled("div")((props: any) => ({
  display: "block",
  width: props.orientation === "horizontal" ? "270px" : "1px",
  height: props.orientation === "horizontal" ? "1px" : "160px",
  background: props.theme === "light" ? "#D9D9D9" : "#888888",
  marginRight: props.orientation === "vertical" ? "30px" : "0",
})) as any;

export const CountsContainer = styled("div")({ display: "flex" });
export const FirstCount = styled("div")({
  display: "flex",
});
export const FirstCountIcon = styled(Image)({ marginRight: "8px" });
export const FirstCountNumber = styled("div")({
  marginRight: "16px",
  color: "#515151",
});
export const UpdatedText = styled("div")({
  fontSize: "14px",
  color: "#515151",
  marginTop: "10px",
});
export const ListActionsContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "30px",
});
export const ViewLink = styled("div")({
  color: "#F1742E",
  fontSize: "16px",
  display: "flex",
  marginRight: "36px",
});

export const LinkIcon = styled(Image)({
  marginRight: "8px",
});

export const LinkText = styled("div")({
  color: "#F1742E",
  fontSize: "16px",
});

export const ListProgressContainer = styled("div")({
  display: "flex",
  color: "#515151",
});

export const ListProgressItemContainer = styled("div")({
  display: "flex",
  width: "200px",
  flexDirection: "column",
  overflow: "hidden",
  marginRight: "60px",
  position: "relative",
});
export const ProgressCount = styled("div")({
  fontSize: "28px",
  marginRight: "6px",
});
export const ProgressText = styled("div")({});
export const LastCaptureText = styled("div")((props: any) => ({
  textAlign: props.leftAlign ? "left" : "center",
  paddingTop: "5px",
  fontSize: "16px",
  display: "flex",
  alignItems: "baseline",
})) as any;

export const CaptureProgress = styled("div")((props: any) => ({
  fontSize: "14px",
  marginRight: "6px",
}));
export const PercentageDelay = styled("div")({
  position: "absolute",
  top: "22%",
  left: "15%",
  fontSize: "30px",
  display: "flex",
  alignItems: "baseline",
});
export const PercentageSymbol = styled("div")({
  fontSize: "20px",
});
export const ProgressBar = styled("div")({
  width: "95px",
  borderRadius: "150px 150px 0 0",
  border: "7px solid #D9D9D9",
});

export const ListProgressCountContainer = styled("div")({
  display: "flex",
  justifyContent: "left",
  alignItems: "baseline",
  paddingBottom: "4px",
  color: "#515151",
});

export const CompanyLogoContainer = styled("div")({});

export const CompanyLogo = styled(Image)({
  height: "45px !important",
  width: "242px",
});

export const MoreMenuIcon = styled(Image)({});

export const ProjectCardsContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  overflowY: "auto",
  overflowX:"hidden",
  height: "calc(100vh - 128px)",
  // height: "calc(100vh - 70px)",

  padding: "0 20px",
  // paddingBottom: "70px",

  paddingTop: "18px",
  position: "relative",
});

export const ProjectCard = styled("div")((props: any) => ({
  width: props.active ? "300px" : "300px",
  // height: props.active ? "458px" : "438px",
  height: "436px", //increasing height
  background: "#FFFFFF",
  border: "1px solid #888888",
  padding: "20px",
  paddingTop: "11px",
  paddingRight: "12px",
  boxShadow: props.active ? "0px 4px 15px rgba(0, 0, 0, 0.25)" : "",
  color: "#101F4C",
  fontSize: "14px",
  fontFamily: "Open Sans",
  position: "relative",
  marginBottom: "35px",
  cursor: "pointer",
})) as any;

export const ProjectTopLeftBg = styled("div")((props: any) => ({
  position: "absolute",
  borderBottom: props.active ? "1px solid #F1742E" : "1px solid #888888",
  top: "-1px",
  left: "-8px",
  width: "314px",
})) as any;

export const ProjectTopRightBg = styled("div")((props: any) => ({
  position: "absolute",
  borderRight: props.active ? "1px solid #F1742E" : "1px solid #888888",
  bottom: "-8px",
  right: "-1px",
  height: "424px",

  // height: props.active ? "454px" : "434px",
})) as any;

export const ProjectBottomLeftBg = styled("div")((props: any) => ({
  position: "absolute",
  borderLeft: props.active ? "1px solid #F1742E" : "1px solid #888888",
  bottom: "-8px",
  left: "-1px",
  height: "424px",

  // height: props.active ? "454px" : "434px",
})) as any;

export const ProjectBottomRightBg = styled("div")((props: any) => ({
  position: "absolute",
  borderBottom: props.active ? "1px solid #F1742E" : "1px solid #888888",
  bottom: "-1px",
  left: "-8px",
  width: "314px",

  // width: props.active ? "318px" : "314px",
})) as any;

export const ProjectLogo = styled("img")({
  height: "45px !important",
  width: "unset !important",
  margin: "auto",
  maxWidth: "240px",
  marginTop: "10px",
});

export const ProjectCardFlipIcon = styled(Image)({
  width: "24px",
  height: "24px",
  float: "right",
});

export const ProjectNameTitle = styled("div")({
  fontSize: "18px",
  height: "53px",
  lineHeight: "26px",
  marginBottom: "10px",
  wordBreak:"break-all"
});
export const UsersCountContainer = styled("div")({ display: "flex" });
export const UsersCountText = styled("div")({
  fontSize: "14px",
  marginLeft: "7px",
  color: "#515151",
});

export const UpdatedAtContainer = styled("div")({
  display: "flex",
  alignItems: "flex-start",
});
export const CapturesText = styled("div")({
  color: "#101F4C",
  fontSize: "14px",
  fontStyle: "italic",
  marginBottom: "13px",
});
export const CaptureImageContainer = styled("div")((props: { marginBottom?: boolean , opacity?: number }) => ({
  display: "flex",
  color: "#515151",
  fontSize: "14px",
  alignItems: "center",
  opacity: props.opacity || 1,
  marginBottom: props.marginBottom ? "4px" : "16px",
}));
export const CaptureImageIcon = styled(Image)({
  marginRight: "7px",
  width: "20px",
  height: "20px",
});
export const CaptureName = styled("div")({
  marginRight: "5px",
});
export const CaptureCount = styled("div")({
  width: "48px",
});
export const OtherUsersCount = styled("div")({
  color: "#FF843F",
});

export const UsersInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
});

export const UserPic = styled(Image)({
  border: "1px solid #F1742E",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  marginRight: "5px",
});

export const UserMonogram = styled("div")({
  border: "1px solid #F1742E",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  textAlign: "center",
  fontSize: "12px",
  color: "#101F4C",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  marginRight: "5px",
});

export const EmailIconContainer = styled("div")({
  width: "24px",
  height: "24px",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  marginRight: "5px",
});

export const EmailIcon = styled(Image)({
  width: "24px",
  height: "24px",
  marginRight: "5px",
});

export const ListDivider = styled("div")({
  display: "block",
  width: "1px",
  height: "20px",
  background: "#D9D9D9",
  margin: "0 10px",
});
export const ListVerticalDivider = styled("div")({
  display: "block",
  width: "1px",
  height: "20px",
  background: "#D9D9D9",
  margin: "0 10px",
});
export const ListHorizontalDivider = styled("div")((props: any) => ({
  display: props.active ? "block" : "",
  width: props.active ? "300px" : "100%",

  height: props.active ? "12px" : "1px",
  background: props.active ? "#FFFFFF" : "#888888",
  padding: "0 20px",
  marginTop: props.active ? "35px" : "14px",
  marginBottom: props.active ? "0" : "17px",
  borderTop: props.active ? "1px solid #F1742E" : "",
  borderTopLeftRadius: props.active ? "12px" : "",
  borderTopRightRadius: props.active ? "12px" : "",
  marginLeft: props.active ? "-22px" : "",
})) as any;

export const HorizontalSeparator = styled("div")((props: any) => ({
  display: "",
  width: "100%",

  height: "1px",
  background: "#888888",
  padding: "0 20px",
}));

export const CapturesField = styled("div")({
  display: "flex",
  marginRight: "18px",
  alignItems: "center",
  justifyContent: "center",
});

export const CapturesFieldContainer = styled("div")({
  display: "flex",
});

export const ProjectActionsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  // borderTop: "1px solid #F1742E",
});

export const ProjectActionItem = styled("div")({
  fontSize: "14px",
  color: "#101F4C",
  padding: " 16px 10px",
  cursor: "pointer",
  borderBottom: "1px solid #D9D9D9",
  "&: last-child": {
    borderBottom: "none",
  },
  "&:hover": {
    background: "#EEEEEE",
  },
});

export const UsersList = styled("div")({
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  background: "#FFFFFF",
  border: "1px solid #D9D9D9",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.16)",
  borderRadius: "4px",
  minWidth: "200px",
});

export const UsersListItem = styled("div")((props: any) => ({
  display: "flex",
  borderBottom: props.hideLastStyle ? "none" : "1px solid #D9D9D9",
  paddingBottom: "10px",
  paddingTop: props.hideFirstStyle ? "" : "10px",
  color: "#101F4C",
  fontSize: "14px",
})) as any;

export const ShowMore = styled("div")({
  color: "#F1742E",
  fontSize: "14px",
  cursor: "pointer",
  textAlign: "end",
});

export const ShowErrorContainer = styled("div")({
  display:"flex",
  flexDirection:"column"
});

export const CenteredErrorImage = styled(Image)({
  // position: "absolute",
  // top: "30%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  // position: "absolute",
  // top: "30%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",

});

export const NoResultText = styled("div")({
  // fontStyle: "normal",
  // fontWeight: "400",
  // fontSize: "14px",
  // lineHeight: "19px",
  textAlign: "center",
  // color: "#101F4C",
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  
});
