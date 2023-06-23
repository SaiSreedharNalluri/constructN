import styled from "@mui/system/styled";
import Image from "next/image";

export const HeaderLabel = styled("div")({
  fontSize: "18px",
});

export const EmptyUsersListContainer = styled("div")({
  color: "#101F4C",
  width: "100%",
  padding: "20px",
});

export const NoUsersContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "36px",
});

export const GoAheadText = styled("div")({
  fontSize: "14px",
  paddingTop: "10px",
});

export const AddSingleUserContainer = styled("div")({
  width: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  marginRight: "120px",
  marginTop: "25px",
});
export const BulkUserContainer = styled("div")({
  width: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  marginLeft: "120px",
  marginTop: "25px",
});
export const AddUserImage = styled(Image)({
  marginBottom: "10px",
  marginRight: "25px",
});
export const BulkImageIcon = styled(Image)({
  marginBottom: "10px",
  marginLeft: "30px",
});
export const AddByEmailText = styled("div")({
  marginBottom: "25px",
  width: "78px",
  marginRight: "52px",
  textAlign: "center",
});
export const DownloadTemplateText = styled("div")({
  marginBottom: "25px",
  width: "170px",
  textAlign: "center",
  marginLeft: "5px",
});
export const AddUserButton = styled("div")({});
export const AddUsersContainer = styled("div")({
  width: "100%",
  display: "flex",
  marginTop: "64px",
});

export const Divider = styled("div")((props: any) => ({
  display: "block",
  width: "1px",
  height: "285px",
  background: "#888888",
})) as any;

export const AddUserEmailContainer = styled("div")((props: any) => ({
  width: props?.overlay ? "535px" : "100%",
  marginTop: props.overlay ? "30px" : "",
})) as any;

export const BulkUserUploadContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#787878",
  fontWeight: 400,
  border: "1px dashed #F1742E",
  padding: "20px",
});

export const ClickHereText = styled("div")({
  fontSize: "14px",
  color: "#787878",
  fontWeight: 400,
  display: "flex",
  paddingTop: "20px",
});

export const DownloadText = styled("div")({
  fontSize: "14px",
  color: "#F1742E",
  fontWeight: 400,
  padding: "0 5px",
});

export const OrText = styled("div")({
  display: "flex",
  justifyContent: "center",
  color: "#787878",
  fontWeight: 400,
  padding: "20px 0",
});

export const BulkImage = styled(Image)({
  width: "68px",
  height: "68px",
});

export const BulkUserText = styled("div")({
  fontSize: "14px",
  color: "#787878",
  paddingTop: "10px",
});

export const LabelContainer = styled("div")({
  paddingBottom: "8px",
});

export const EnterIcon = styled(Image)({
  transform: "rotate(180deg)",
  width: "18px",
  height: "18px",
  cursor: "pointer",
});
