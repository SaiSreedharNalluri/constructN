import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import GcpManualFile from "./gcpManualFile";
import uploaderIcon from "../../../public/divami_icons/Upload_graphics.svg";
import { useUploaderContext } from "../../../state/uploaderState/context";
import Papa from "papaparse";
export const UploaderIcon = styled(Image)({
  cursor: "pointer",
});

const GcpUploadFile: React.FC<any> = ({ handleUploadCompleted }) => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleUploaderIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
            header: false,
            complete: function (results) {
              const modifiedData = results.data.slice(1).map((row: any) => row.slice(1));

             
              const numberOfColumns = modifiedData[0].length;
              const numberOfRows = modifiedData.length;
              handleUploadCompleted(numberOfColumns);

              if (numberOfColumns === 4 && numberOfRows >= 4) {
                   uploaderAction.setIsNextEnabled(false);
              } 
              else if (numberOfColumns === 3 && numberOfRows >= 4) {
                uploaderAction.setIsNextEnabled(false);
              }
               else {
                console.log("The number of columns in the modified data is neither three nor four.");
              }
              uploaderAction.setExtractedFileValue(modifiedData);
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
          className={`border-[1px] text-center rounded-[8px] md:gap-[100px] w-[90%] md:w-[40vw] h-[20vh] border-dashed relative md:top-[5px] md:left-[250px] border-black py-[6vh] px-[2%] cursor-pointer`}
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
        <div className="mt-4" style={{ margin: "8px 60px" }}>
          <hr></hr>
          <GcpManualFile></GcpManualFile>
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
