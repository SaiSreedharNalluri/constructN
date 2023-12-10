import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import uploaderIcon from "../../../public/divami_icons/Upload_graphics.svg";
import { useUploaderContext } from "../../../state/uploaderState/context";
import Papa from "papaparse";
import { object } from "yup";
import { location, utmLocation } from "../../../models/IRawImages";
import { GCPType, GCPUploadFile, IGCP, LONGLATType, UTMType, longLatGCP, utmGCP } from "../../../models/IGCP";
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];

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
  };

  return (
    <React.Fragment>
      <div>
        <div
          className={`border-[1px] text-center rounded-[8px] w-[40vw] h-[20vh] border-dashed  mt-[16px]  border-black py-[6vh] px-[2%] cursor-pointer`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="w-[10%] h-[5%] md:w-[109.78px] md:h-[104px]">
              <UploaderIcon
                src={uploaderIcon}
                alt={"uploader icon"}
                className="h-[70%] w-[70%] md:h-[50.94px] md:w-[50.94px]"
                onClick={handleUploaderIconClick}
              />
            </div>

            <div className="font-sans">
              <p className="m-0 text-gray-700 font-medium text-l">
                Drag and Drop the files / folders you want to upload or browse
              </p>
              <p className="font-thin">Supported file types: csv types.</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <hr></hr>
        </div>
        <input
          type="file"
          ref={(input) => (fileInputRef.current = input)}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </React.Fragment>
  );
};

export default GcpUploadFile;
