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

export const ActivityCard = styled("div")({

});

export const CommentsTitle = styled("div")({
  fontFamily: "'Open Sans'",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  color: "#787878",
  marginBottom: "12px",
});

export const ActivityHeader = styled("div")({
  display: "flex",
  alignItems: "center",
  height: "19px",
});
export const ActivityStatusIcon = styled("span")({
  display: "flex",
  marginRight: "7px",
  borderRadius: "100%",
});
export const ActivityImageAvatar = styled(Image)({
  borderRadius: "100%",
  width: "30px",
  height: "30px",
  border: "1px solid white",
});
export const ActivityStatusTitle = styled("span")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  color: "#787878",
});
export const ActivityHeaderDivider = styled("span")({
  margin: "0px 10px",
  color: "#787878",
});

export const ActivityBody = styled("div")({
  // borderLeft: "1px solid #d9d9d9",
  marginLeft: "15px",
  marginTop: "6px",
  marginBottom: "10px",
  paddingLeft: "14px !important",
  paddingBottom: "15px",
  color: "#787878",
});

export const ActivityBodyChild = styled("div")({
  // borderLeft: "1px solid #d9d9d9",

  marginLeft: "15px",
  marginTop: "6px",
  // marginBottom: "10px",
  paddingLeft: "18px !important",
  // paddingBottom: "15px",
  color: "#787878",
});

export const ActivityTimeStamp = styled("span")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  color: "#787878",
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
  marginLeft: "4px",
});
export const ActivityCommentAddedByMain = styled("span")({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  color: "#101F4C",
  lineHeight: "20px",
  paddingRight: "10px",
});

export const CommentTitleWrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  justifyContent: "space-between",
});

export const CommentTitleName = styled("div")({
  display: "flex",
  flexGrow: 1,
});

export const CommentEditActions = styled("div")({
  display: "flex",
});
export const EditIconImage = styled(Image)({
  cursor: "pointer",
  marginRight: "20px",
});
export const DeleteconImage = styled(Image)({
  cursor: "pointer",
});
export const ActivityAddedComment = styled("span")({
  marginLeft: "4px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  color: "#101F4C",
  lineHeight: "20px",
});
export const ActivityCommentDiv = styled("div")({
  marginTop: "5px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  color: "#101F4C",
  lineHeight: "20px",
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
export const ActivityScanUploadBox = styled("div")({});
export const ActivityIssueRaisedMainProfile = styled("span")({});
export const ActivityCurrentProgress = styled("span")({
  marginTop: "6px",
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
export const CommentActions = styled("div")({
  display: "flex",
  margin: "4px",
  marginLeft: 0,
});

export const ReplyButton = styled("div")({
  // marginRight: "20px",
  color: "#FF843F",
  cursor: "pointer",
});

export const RepliesContainer = styled("div")({
  marginTop: "16px",
});
