import { styled } from "@mui/system";
import Image from "next/image";

export const CaptureModeParent = styled("div")({
  display: "flex",
  textAlign: "center",
  justifyContent:"space-between"
});

export const CaptureModeFirstChild = styled("div")({
  display: "flex",
});

export const BlockElem =styled("div")({
  // display: "flex",
});


export const SymbolContainer = styled("div")({
  marginLeft: "5px",
});

export const CaptureModeSecondChild = styled("div")({
  display: "flex",
  marginLeft: "10px",
});

export const CaptureModeThirdChild = styled("div")({
  display: "flex",
  marginLeft: "10px",
});

export const CaptureModeFourthChild = styled("div")({
  display: "flex",
  marginLeft: "10px",
});

export const ArrowIcon = styled(Image)`
  cursor: pointer;
  //   margin-right: 10px;
`;
