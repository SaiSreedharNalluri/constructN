import { styled } from "@mui/system";
import Image from "next/image";

export const CaptureModeParent = styled("div")({
  display: "flex",
  textAlign: "center",
  justifyContent:"space-between"
});

export const PhoneImgCount = styled("div")({
  display: "flex",
});

export const CountElem =styled("div")({
  // display: "flex",
});


export const SymbolContainer = styled("div")({
  marginLeft: "5px",
});

export const HotspotImgCount = styled("div")({
  display: "flex",
  marginLeft: "10px",
});

export const VideoWalkCount = styled("div")({
  display: "flex",
  marginLeft: "10px",
});

export const LidarScanCount = styled("div")({
  display: "flex",
  marginLeft: "10px",
});

export const ArrowIcon = styled(Image)`
  cursor: pointer;
  //   margin-right: 10px;
`;
