import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";


export const HeaderContainer = styled("div")({
  minHeight: "60px",
  boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const HeaderLeftPart = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const HeaderLogoImageContainer = styled("div")({
  padding: "0px 21px",
  cursor: "pointer",
});

export const HeaderRightPart = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
});

export const HeaderToggle = styled("div")({
  display: "flex",
  boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
  marginRight: "15px",
  borderRadius: "4px",
  border: "1px solid #F1742E",
});

export const HeaderToggleButtonOne = styled("button")((props: any) => ({
  background: !props?.toggleStatus ? "#FFFFFF" : "#F1742E",
  border: !props?.toggleStatus ? `1px solid #FFFFFF` : "none",
  cursor: "pointer",
  color: !props?.toggleStatus ? "#36415D" : "#FFFFFF",
  padding: "6px 10px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  borderTopLeftRadius: "4px",
  borderBottomLeftRadius: "4px",
})) as any;

export const HeaderProfileImageContainer = styled("div")({
  marginRight: "15px",
  cursor: "pointer",
  // border: "1.5px solid #36415D",
  // borderRadius: "50%",
  // boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
});

export const ProfileImgIcon = styled(Image)({
  cursor: "pointer",
  // boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",

});


export const HeaderMenuImageContainer = styled("div")({
  marginRight: "15px",
  cursor: "pointer",
});

export const HeaderNotificationImageContainer = styled("div")({
  marginRight: "15px",
  cursor: "pointer",
});
