import { styled } from "@mui/system";
import SidePanelMenu from "../side-panel/SidePanel";

export const Content = styled("div")({
  display: "flex",
});

export const SidePanelMenuContainer = styled(SidePanelMenu)({});
export const ProjectsListContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});
