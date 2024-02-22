import React, { useEffect, useRef, useState } from "react";
import GcpEnterManually from "../GCPFiles/gcpEnterManually";
import GcpUploadFile from "../GCPFiles/gcpUploadFile";
import downloadFileIcon from "../../../public/divami_icons/downloadOrange.svg";
import { useUploaderContext } from "../../../state/uploaderState/context";
import Image from "next/image";
import { AWS } from "../../../config/config";
const UploaderGCP = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [selectedOption, setSelectedOption] = useState("Upload File");
  const [selectedFileName, setSelectedFileName] = useState<string>(uploaderState.gcpList.base64ImageName ? uploaderState.gcpList.base64ImageName : "");
  const [textareaValue, setTextareaValue] = useState<string>(uploaderState.gcpList.description ? uploaderState.gcpList.description : ""); 

  

  const handleFirstOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(event.target.value);
    uploaderAction.setGCPDescription(event.target.value)
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];
      const allowedFormats = ["image/jpeg", "image/png"];

      if (allowedFormats.includes(selectedFile.type)) {
        setSelectedFileName(selectedFile.name);

        const reader = new FileReader();

        reader.onload = (e) => {
          const base64Data = e.target?.result;
          uploaderAction.setGCPBase64(base64Data as string, selectedFile.name)
        };
          reader.readAsDataURL(selectedFile);
      } else {
        console.log("Please select a valid JPG or PNG file.");
      }
    }
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(()=> {
    if (!uploaderState.gcpList || uploaderState.isGCPInit) {
      return;
    }

    if ((uploaderState.gcpList.utmLocation && uploaderState.gcpList.utmLocation?.length > 0) 
    || (uploaderState.gcpList.location && uploaderState.gcpList.location?.length > 0)) {
      setSelectedOption("Enter Manually")
    }

  }, [uploaderState.gcpList])

  return (
    <React.Fragment>
      <div className="calc-w mx-[20px] mt-3 flex border-t border-solid  border-[#F1742E] h-[1px]">
        <div className="flex-1">
        <div className="flex flex-col items-start gap-[16px]">
            <div>
            <p  style={{fontSize:"18px",fontWeight:"400",fontStyle:"normal",fontFamily:"Open sans",marginTop:"16px",lineHeight:"20px",color:"#000"}}>
            Choose how you want to provide Ground Control Points
          </p>
          </div>
          <div className="flex w-1/3 justify-between">
              <div>
                <label>
                  <input
                    type="radio"
                    name="firstOption"
                    value="Upload File"
                    className="h-[20px] w-[20px] relative top-[2px] accent-orange-600"
                    checked={selectedOption === "Upload File"}
                    onChange={handleFirstOptionChange}
                  />
                 &nbsp; Upload File
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="firstOption"
                    value="Enter Manually"
                    className="h-[20px] w-[20px] relative top-[2px] accent-orange-600"
                    checked={selectedOption === "Enter Manually"}
                    onChange={handleFirstOptionChange}
                  />
                  &nbsp; Enter Manually
                </label>
              </div>
          </div>

        </div>
        {selectedOption == "Enter Manually" ? (
         <GcpEnterManually/>
        ) : (
          <div>
            <p onClick={() => {window.open(`${AWS.CDN_ATTACHMENTS}/gcpTemplate/GCP-UTM.csv`,"_blank");}}
              className="text-border-yellow italic text-sm flex items-center mt-[4px]">
              <Image className="w-[13.24] h-[12.68px]" src={downloadFileIcon} alt=""/>
             <span className="ml-[8px]">Sample template UTM file</span> 
            </p>
            <p onClick={() => {window.open(`${AWS.CDN_ATTACHMENTS}/gcpTemplate/GCP-LAT-LONG.csv`,"_blank");}}
              className="text-border-yellow italic text-sm flex items-center" >
              <Image className="w-[13.24] h-[12.68px]" src={downloadFileIcon} alt=""/>
              <span className="ml-[8px]">  Sample template LngLat file</span>
            </p>
            <GcpUploadFile></GcpUploadFile>
           
          </div>
        )}
        </div>
      <div className=" ml-[20px] w-[35%]">
      <div>
          <p style={{fontSize:"14px",fontWeight:"400",fontStyle:"normal",fontFamily:"Open sans",marginTop:"16px",lineHeight:"20px",color:"#000"}}>
            Give a brief description of your GCP and / or upload an image
            (optional)
          </p>
          <textarea
            className="border border-gray-300 p-1 w-[100%] h-[100px] mt-2"
            placeholder="Enter text up to 120 characters"
            value={textareaValue}
            onChange={handleTextareaChange} 
          ></textarea>
          <div>
            <p
            className="text-base font-normal font-open-sans mt-4 leading-5 text-black"
            >
              Choose File
            </p>
            <input
              type="text"
              className="border border-gray-300 p-2 ml-[8px] w-[100%] h-[40px] mt-2 mb-3"
              placeholder=".jpg or .png files only"
              value={selectedFileName}
              readOnly
            />
            <label
              htmlFor="fileInput"
              className=" ml-2 border border-gray-300 bg-border-yellow rounded-md text-white p-1"
            >
              Add File
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png"
              />
            </label>
          </div>
        </div>
        <input
          type="file"
          ref={(input) => (fileInputRef.current = input)}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        </div>
      </div>
    </React.Fragment>
  );
};

export default UploaderGCP;
