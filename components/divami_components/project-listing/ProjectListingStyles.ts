import { styled } from "@mui/system";
import Image from "next/image";
export const ProjectsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
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

export const CompanyLogo = styled(Image)({});

export const MoreMenuIcon = styled(Image)({});
