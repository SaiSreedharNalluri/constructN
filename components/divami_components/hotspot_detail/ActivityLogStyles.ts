import { styled } from "@mui/system";
import Image from "next/image";

export const ActivityCardContainer = styled("div")({
  marginTop: "5px",
  fontFamily: "'Open Sans'",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
});

export const ActivityCard = styled("div")({});

export const ActivityHeader = styled("div")({
  display: "flex",
  alignItems: "center",
  height: "19px",
});
export const ActivityStatusIcon = styled("span")({
  display: "flex",
  marginRight: "7px",
});
export const ActivityStatusTitle = styled("span")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  color: " #787878",
});
export const ActivityHeaderDivider = styled("span")({
  margin: "0px 7px",
});

export const ActivityBody = styled("div")({
  // borderLeft: "1px solid #d9d9d9",
  marginLeft: "18px",
  marginTop: "6px",
  marginBottom: "10px",
  paddingLeft: "14px !important",
  paddingBottom: "15px",
  color: "#787878",
});

export const ActivityTimeStamp = styled("span")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  color: " #787878",
});

export const ActivityBodyIssueRaisedCase = styled("div")({
  marginLeft: "10px",
  marginTop: "6px",
  marginBottom: "10px",
  paddingLeft: "14px !important",
  paddingBottom: "10px",
  color: "#787878",
});

export const ActivityCommentAddedBy = styled("div")({
  marginLeft: "5px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#101F4C",
});
export const ActivityCommentAddedByMain = styled("span")({});
export const ActivityAddedComment = styled("span")({
  marginLeft: "4px",
});
export const ActivityCommentDiv = styled("div")({
  marginTop: "5px",
});
export const ActivityComment = styled("span")({});
export const ActivityIssueRaisedMain = styled("span")({});
export const ActivityCreated = styled("span")({
  marginLeft: "4px",
});
export const ActivityIssueType = styled("span")({
  marginLeft: "4px",
});
export const ActivityFor = styled("span")({
  marginLeft: "4px",
});
export const IssuesDescription = styled("span")({
  marginLeft: "4px",
});
export const ActivityScanUploadBox = styled("div")({
  marginLeft: "4px",

  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#101F4C",
});
export const ActivityIssueRaisedMainProfile = styled("span")({});
export const ActivityCurrentProgress = styled("span")({
  marginTop: "6px",

  marginLeft: "4px",

  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#101F4C",
});

export const ActivityImageSection = styled("div")({
  height: "40px",
  width: "315px",
  display: "flex",
  marginTop: "4px",
  alignItems: "center",
  color: "#F1742E",
});

export const ActivityImage = styled("span")({
  marginLeft: "7px",
});

export const ActivityScreenShotIconContainer = styled("div")({});
