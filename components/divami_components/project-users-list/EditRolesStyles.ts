import { styled } from "@mui/system";
import Image from "next/image";

export const EditRoleContainer = styled("div")({
  marginRight: "22px",
});

export const EditRoleHeader = styled("div")({});

export const EditRoleBody = styled("div")({ flexGrow: "1" });

export const EditRoleFooter = styled("div")({});

export const UserAvatarContainer = styled("div")({
  marginTop: "20px",
  display: "flex",
  alignItems: "center",
  marginBottom: "30px",
});

export const UserAvatarImage = styled(Image)({
  width: "58px",
  height: "58px",
  border: "1px solid #101F4C",
  borderRadius: "100%",
});

export const UserInfoContainer = styled("div")({
  marginLeft: "20px",
});

export const UserName = styled("div")({
  fontSize: "18px",
});

export const UserEmail = styled("div")({
  width: "",
});

export const AssignedLabel = styled("div")((props: any) => ({
  color: "#787878",
  fontSize: "14px",
  marginBottom: props.bottom ? "5px" : "",
})) as any;

export const AssignedValue = styled("div")({
  color: "#101F4C",
  fontSize: "14px",
  marginBottom: "20px",
});
