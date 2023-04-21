import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, MenuItem, TextField } from "@mui/material";

export const UpperParent = styled("div")({
  display: "flex",
  /* justify-content: space-between; */
  textAlign: "center",

  alignItems: "center",
});

export const ImageBar = styled("div")({

})

export const ParentBar = styled("div")({
  backgroundColor: "#e7e7e7",
  width: "80px",
  borderRadius: "15px",
  height: "5px",
  marginLeft:"15px"
});

export const ChildBar =styled("div")({
  backgroundColor: "rgb(116, 194, 92)",
  color: "white",
  textAlign: "right",
    fontSize: "20px",
    borderRadius: "15px",
  height:"5px"
});

export const PercentageBar=styled("div")({
  marginLeft: "10%",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  color:"#101F4C"
});



export const ImageIcon = styled(Image)({
  cursor: "pointer",
  // width: "12px",
  // height: "12px",
});


export const AssigneeList = styled("div")({
  // display: "inline-block",

  // background:"#FFFFF"
  // width: "308px",
  // height: "86px",
  padding: "15px",
  color: "#101F4C",
  fontSize: "14px",
  border: "1px solid #D9D9D9",
  marginTop: "-3px",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.16)",
  borderRadius: "4px",
  // position: "absolute",
  // right:"10px",
});

export const ParentToolDiv = styled("div")({
  display: "flex",
  textAlign:"center"
})
export const ToolImg = styled("div")({

})

export const ToolImgDiv = styled("div")({
  marginLeft: "10px",
  marginTop:"1px"
})

export const ToolImageIcon = styled(Image)({
  cursor: "pointer",
  // width: "12px",
  // height: "12px",
});
