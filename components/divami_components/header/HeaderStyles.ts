import { styled, createTheme, ThemeProvider } from "@mui/system";

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
});

export const HeaderToggleButtonTwo = styled("button")({
  // background: ${(props) =>
  //     props?.toggleStatus
  //       ? props?.theme?.colors?.default
  //       : props?.theme?.colors?.white};
  //   border: ${(props) =>
  //     props?.toggleStatus
  //       ? "none"
  //       : `1px solid ${props?.theme?.colors?.default}`};
  //   padding: ${(props) => (props?.toggleStatus ? "0" : "")};
  //   cursor: pointer;
  //   outline: inherit;
  //   color: ${(props) =>
  //     props?.toggleStatus
  //       ? props?.theme?.colors?.white
  //       : props?.theme?.colors?.textColor};
  //   padding: 6px 10px;
  //   height: 30px;
  //   display: flex;
  //   align-items: center;
  //   width: 64px;
  //   border-top-right-radius: 4px;
  //   border-bottom-right-radius: 4px;
});

export const HeaderToggleButtonOne = styled("button")({
  // background: ${(props) =>
  //     props?.toggleStatus
  //       ? props?.theme?.colors?.default
  //       : props?.theme?.colors?.white};
  //   border: ${(props) =>
  //     props?.toggleStatus
  //       ? "none"
  //       : `1px solid ${props?.theme?.colors?.default}`};
  //   padding: ${(props) => (props?.toggleStatus ? "0" : "")};
  //   cursor: pointer;
  //   outline: inherit;
  //   color: ${(props) =>
  //     props?.toggleStatus
  //       ? props?.theme?.colors?.white
  //       : props?.theme?.colors?.textColor};
  //   padding: 6px 10px;
  //   height: 30px;
  //   display: flex;
  //   align-items: center;
  //   width: 64px;
  //   border-top-left-radius: 4px;
  //   border-bottom-left-radius: 4px;
});

export const HeaderProfileImageContainer = styled("div")({
  marginRight: "15px",
  cursor: "pointer",
});

export const HeaderMenuImageContainer = styled("div")({
  marginRight: "15px",
  cursor: "pointer",
});

export const HeaderNotificationImageContainer = styled("div")({
  marginRight: "15px",
  cursor: "pointer",
});
