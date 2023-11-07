import React, { useEffect, useState } from "react";
import  GcpEnterManually from "../GCPFiles/gcpEnterManually";
import GcpUploadFile from "../GCPFiles/gcpUploadFile";
import latLngSample from "../../../public/images/latlng_sample.jpg"
import downloadFileIcon from "../../../public/divami_icons/downloadFileIcon.svg"
const UploaderGCP = () => {
  const [selectedOption, setSelectedOption] = useState("Upload File");
  const [selectOption, setSelectOption] = useState("LatLng");
  const handleFirstOptionChange = (event:any) => {
    setSelectedOption(event.target.value);

  };

  const handleSecondOptionsChange = (event:any) => {
    setSelectOption(event.target.value);
  };
  const handleUploadCompleted = (numberOfColumns: number) => {
    if (numberOfColumns === 4) {
      setSelectOption("UTM");
    } else if (numberOfColumns === 3) {
      setSelectOption("LatLng");
    } else {
    }
    setSelectedOption("Enter Manually");
  };

  return (
    <React.Fragment>
      <div className="flex flex-col">
        <div>
          <div className="mt-3 w-full border-t border-solid border-border-yellow" style={{ height: "1px" }}></div>
          <p className="p-2 w-997px h-24px font-sans font-normal not-italic text-base line-height-150%" style={{ margin: "0 60px" }}>Choose how you want to provide Ground Control Points.</p>
          <div className="flex items-start flex-wrap" style={{ margin: "0 60px", width: "997px" }}>
            <div className="w-full grid grid-cols-2 gap-4">
              <div>
                <label>
                  <input
                    type="radio"
                    name="firstOption"
                    value="Upload File"
                    className="appearance-none h-2 w-2 border-8  rounded-full checked:bg-orange-500 checked:border-orange-500 focus:ring-2"
                    checked={selectedOption === "Upload File"}
                    onChange={handleFirstOptionChange}
                  />&nbsp;
                  Upload File
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="firstOption"
                    value="Enter Manually"
                    className="appearance-none h-2 w-2 border-8  rounded-full checked:bg-orange-500 checked:border-orange-500 focus:ring-2"
                    checked={selectedOption === "Enter Manually"}
                    onChange={handleFirstOptionChange}
                  />&nbsp;
                  Enter Manually
                </label>
              </div>
              </div>
              {selectedOption === "Enter Manually" ? (
                <div className="w-full grid grid-cols-2 gap-4">
              <div>
                <label>
                  <input
                    type="radio"
                    name="secondOption"
                    value="UTM"
                    className="appearance-none h-2 w-2 border-8  rounded-full checked:bg-orange-500 checked:border-orange-500 focus:ring-2"
                    checked={selectOption === "UTM"}
                    onChange={handleSecondOptionsChange}
                  />&nbsp;
                  UTM
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="secondOption"
                    value="LatLng"
                    className="appearance-none h-2 w-2 border-8  rounded-full checked:bg-orange-500 checked:border-orange-500 focus:ring-2"
                    checked={selectOption === "LatLng"}
                    onChange={handleSecondOptionsChange}
                  />&nbsp;
                  LatLng
                </label>
              </div>
              </div>
              ):(<p></p>)}
            </div>
           
        </div>
        {selectedOption=="Enter Manually"?(
            < GcpEnterManually selectOption={selectOption}></ GcpEnterManually>
        ):(<div style={{ margin: "0 60px"}}>
            <p onClick={() => {window.open(`${process.env.NEXT_PUBLIC_CONSTRUCTN_ATTACHMENTS_S3}/gcpTemplate/GCP-UTM.csv`, "_blank");}} className="text-border-yellow italic text-sm flex items-center"><img src={downloadFileIcon}  className="mr-2" />sample template UTM file</p>
            <p onClick={() => {window.open(`${process.env.NEXT_PUBLIC_CONSTRUCTN_ATTACHMENTS_S3}/gcpTemplate/GCP-LAT-LONG.csv`, "_blank");}} className="text-border-yellow italic text-sm flex items-center"><img src={downloadFileIcon}  className="mr-2" />Sample template LatLng file</p>
            <GcpUploadFile handleUploadCompleted={handleUploadCompleted}></GcpUploadFile>
        </div>)}
      </div>
    </React.Fragment>
  );
};

export default UploaderGCP;
