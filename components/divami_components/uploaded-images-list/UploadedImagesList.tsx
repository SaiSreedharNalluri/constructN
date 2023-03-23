import React from "react";
import { styled } from "@mui/system";
import { Box } from "@mui/material";

const ImageItem = styled(Box)({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4C",
  marginTop: 10,
});

const UploadedImagesList = ({ formData }: any) => {
  return formData && formData.length
    ? formData
        .filter((item: any) => item.id === "file-upload")[0]
        ?.selectedFile?.map((eachSelectedFile: any) => {
          return (
            <ImageItem key={eachSelectedFile.name}>
              {eachSelectedFile.name}
            </ImageItem>
          );
        })
    : null;
};

export default UploadedImagesList;
