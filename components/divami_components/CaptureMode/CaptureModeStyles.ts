import { styled } from "@mui/system";
import Image from "next/image";

export const ParentComp = styled("div")({
  display: "flex",
  textAlign: "center",
});

export const FirstDiv = styled("div")({
  display: "flex",
});

export const SpareDiv =styled("div")({
  // display: "flex",
});


export const SymbolMode = styled("div")({
  marginLeft: "5px",
});

export const SecondDiv = styled("div")({
  display: "flex",
  marginLeft: "10px",
});

export const ArrowIcon = styled(Image)`
  cursor: pointer;
  //   margin-right: 10px;
`;
