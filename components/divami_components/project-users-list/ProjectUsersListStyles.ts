import { styled } from "@mui/system";
import MaterialTable, { MTableToolbar } from "material-table";
import Image from "next/image";

export const ImageButtons = styled("div")((props: any) => ({
  display: props.hoveringOver ? "flex" : "none",
  // display: "flex",

  justifyContent: "center",
  "& :hover": {
    display: "flex",
  },
})) as any;

export const RemoveIconImage = styled(Image)({
  marginRight: "22px",
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
  width: "100%",
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

export const ProjectsHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  // paddingBottom: "10px",
  fontSize: "18px",
  fontWeight: 400,
  fontFamily: "Open Sans",
  maxHeight: "60px",
  alignItems: "center",
  paddingLeft: "20px",
  paddingRight: "20px",
  height: "60px",
});

export const HeaderLabel = styled("div")({
  fontSize: "18px",
  color: "#101F4C",
});

export const HeaderActions = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  maxHeight: "68px",
});

export const HeaderImage = styled(Image)({
  marginRight: "20px",
  width: "24px",
  height: "24px",
});

export const StyledTable = styled(MaterialTable)({});

export const ToggleButtonContainer = styled("div")({ display: "flex" });

export const GridViewButton = styled("div")((props: any) => ({
  background: !props?.toggleStatus ? "none" : "#F1742E",
  // border: !props?.toggleStatus ? `1px solid #FFFFFF` : "none",
  cursor: "pointer",
  color: !props?.toggleStatus ? "#36415D" : "#FFFFFF",
  padding: "10px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  border: "1px solid #F1742E",
  borderTopLeftRadius: "2px",
  borderBottomLeftRadius: "2px",
})) as any;

export const GridViewButtonRight = styled("div")((props: any) => ({
  background: !props?.toggleStatus ? "none" : "#F1742E",
  // border: !props?.toggleStatus ? `1px solid #FFFFFF` : "none",
  cursor: "pointer",
  color: !props?.toggleStatus ? "#36415D" : "#FFFFFF",
  padding: "10px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  border: "1px solid #F1742E",
  borderTopRightRadius: "2px",
  borderBottomRightRadius: "2px",
})) as any;

export const GridButton = styled(Image)((props: any) => ({
  width: "18px",
  height: "18px",
}));

export const ListViewButton = styled("div")({});
