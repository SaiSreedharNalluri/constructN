import { styled } from "@mui/system";
import MaterialTable, { MTableToolbar } from "material-table";
import Image from "next/image";

export const ImageButtons = styled("div")({
  display: "flex",
  justifyContent: "center",
});

export const RemoveIconImage = styled(Image)({
  marginRight: "25px",
});

export const UserNameText = styled("div")({
  fontSize: "14px",
  color: "#101F4C",
});

export const UserImage = styled(Image)({
  borderRadius: "100%",
  width: "24px",
  height: "24px",
  marginRight: "5px",
});

export const UserDefaultIcon = styled("div")({
  borderRadius: "100%",
  width: "24px",
  height: "24px",
  border: "1px solid #F1742E",
  background: "white",
  color: "#101F4C",
  display: "flex",
  fontSize: "12px",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "5px",
});

export const UserName = styled("div")({
  display: "flex",
  alignItems: "center",
  marginLeft: "-15px",
});

export const ProjectUsersListContainer = styled("div")({
  padding: "20px",
});

export const TableHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  paddingBottom: "10px",
  fontSize: "18px",
  fontWeight: 400,
  fontFamily: "Open Sans",
});

export const Header = styled("div")({
  flexGrow: "1",
});

export const HeaderActions = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const HeaderImage = styled(Image)({
  marginRight: "20px",
  width: "24px",
  height: "24px",
});

export const StyledTable = styled(MaterialTable)({});
