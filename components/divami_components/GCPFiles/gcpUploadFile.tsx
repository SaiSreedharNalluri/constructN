import React, { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import uploaderIcon from "../../../public/divami_icons/Upload_graphics.svg";
import { useUploaderContext } from "../../../state/uploaderState/context";
import Papa from "papaparse";
import { object } from "yup";
import { location, utmLocation } from "../../../models/IRawImages";
import { GCPType, GCPUploadFile, IGCP, LONGLATType, UTMType, longLatGCP, utmGCP } from "../../../models/IGCP";
import ChooseUploaderFile from "../uploaderFIle/chooseUploaderFile";
import ChooseFiles from "../chooseFile/chooseFiles";
import UploadingStatus from "../uploaderFIle/uploadingStatus";
export const UploaderIcon = styled(Image)({
  cursor: "pointer",
});

const GcpUploadFile: React.FC<any> = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleUploaderIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const csvToGcp = (data: any) => {
    if (data.length > 0) {
      let isUTM = false;
      let keys = Object.keys(data[0]);
      let gcp: IGCP = {};

      if (keys.find((e) => e === "EASTING")) {
        isUTM = true;

        let utmLocations: utmLocation[] = data.map((e: any): utmLocation => {
          return {
            easting: e.EASTING||0,
            northing: e.NORTHING||0,
            zone: e["UTM ZONE"] !== undefined ? String(e["UTM ZONE"]) : "",
            elevation: e.ELEVATION||0,
          };
        });
        gcp.utmLocation = utmLocations;
      } else if (keys.find((e) => e === "LATITUDE")) {
        isUTM = false;
        let locations: location[] = data.map((e: any): location => {
          return {
            type: "point",
            coordinates: [e.LONGITUDE ||0, e.LATITUDE||0],
            elevation: e.ALTITUDE||0,
          };
        });
        gcp.location = locations;
      } else {
        console.log("errorsssss");
        return;
      }
      uploaderAction.setGCPList(gcp, isUTM ? GCPType.UTM : GCPType.LONGLAT);
    } else {
      console.log("Final error");
    }
  };
  const onDrop = useCallback((acceptedFiles:File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileContent = e.target?.result as string;
          Papa.parse(fileContent, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function (results) {
              const data = results.data;
              csvToGcp(data);
            },
 
            error: function (error: any) {
              console.error("Error parsing the CSV file", error);
            },
          });
        } catch (error) {
          console.error("Error parsing the CSV file", error);
        }
      };
      reader.readAsText(file);
    }
  },[]);
  const dragDropText = "Drag and Drop the files / folders you want to upload or browse";
  const supportFileText="Supported file types:csv types"
  return (
    <React.Fragment>
      <div>
      <ChooseFiles onDrop={onDrop} dragDropText={dragDropText} supportFileText={supportFileText} UploadingStatus={<UploadingStatus/>} isDisabled={false} acceptFiles={{['text/*']:['.csv']}}/>
      
      </div>
    </React.Fragment>
  );
};

export default GcpUploadFile;
