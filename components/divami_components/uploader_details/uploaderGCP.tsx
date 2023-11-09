import React, { useEffect, useRef, useState } from "react";
import GcpEnterManually from "../GCPFiles/gcpEnterManually";
import GcpUploadFile from "../GCPFiles/gcpUploadFile";
import downloadFileIcon from "../../../public/divami_icons/downloadFileIcon.svg";
import { useUploaderContext } from "../../../state/uploaderState/context";
const UploaderGCP = () => {
  const [selectedOption, setSelectedOption] = useState("Upload File");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [base64File, setBase64File] = useState<string | null>(null);
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;

  const handleFirstOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  useEffect(() => {
    if (uploaderState.gcpList) {
      if (
        uploaderState.gcpList.utmLocation &&
        uploaderState.gcpList.utmLocation.length > 0
      ) {
        setSelectedOption("Enter Manually");
      } else {
        setSelectedOption("Enter Manually");
      }
    }
  }, [uploaderState.gcpList]);

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
          setBase64File(base64Data as string);
        };

        reader.readAsDataURL(selectedFile);
      } else {
        console.log("Please select a valid JPG or PNG file.");
      }
    }
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <React.Fragment>
      <div className="flex flex-col">
        <div>
          <div
            className="mt-3 w-full border-t border-solid border-border-yellow"
            style={{ height: "1px" }}
          ></div>
          <p className="p-2 w-997px h-24px font-sans font-normal not-italic text-base line-height-150%" style={{ margin: "0 60px" }} >
            Choose how you want to provide Ground Control Points.
          </p>
          <div
            className="flex items-start flex-wrap"
            style={{ margin: "0 60px", width: "997px" }}
          >
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
                    className="appearance-none h-2 w-2 border-8  rounded-full checked:bg-orange-500 checked:border-orange-500 focus:ring-2"
                    checked={selectedOption === "Enter Manually"}
                    onChange={handleFirstOptionChange}
                  />
                  &nbsp; Enter Manually
                </label>
              </div>
            </div>
          </div>
        </div>
        {selectedOption == "Enter Manually" ? (
          <GcpEnterManually></GcpEnterManually>
        ) : (
          <div style={{ margin: "0 60px" }}>
            <p onClick={() => {window.open(`${process.env.NEXT_PUBLIC_CONSTRUCTN_ATTACHMENTS_S3}/gcpTemplate/GCP-UTM.csv`,"_blank");}}
              className="text-border-yellow italic text-sm flex items-center">
              <img src={downloadFileIcon} className="mr-2" />
              sample template UTM file
            </p>
            <p onClick={() => {window.open(`${process.env.NEXT_PUBLIC_CONSTRUCTN_ATTACHMENTS_S3}/gcpTemplate/GCP-LAT-LONG.csv`,"_blank");}}
              className="text-border-yellow italic text-sm flex items-center" >
              <img src={downloadFileIcon} className="mr-2" />
              Sample template LatLng file
            </p>
            <GcpUploadFile></GcpUploadFile>
          </div>
        )}
        <div style={{ margin: "0 60px" }}>
          <p className="p-1 w-997px h-22px font-sans font-normal not-italic text-base line-height-150%">
            Give a brief description of your GCP and / or upload an image
            (optional)
          </p>
          <textarea
            className="border border-gray-300 p-1"
            style={{ width: "500px" }}
            placeholder="Enter text up to 120 characters"
          ></textarea>
          <div>
            <label
              htmlFor="fileInput"
              className="p-2 w-997px h-24px font-sans font-normal not-italic text-base line-height-150%"
            >
              Choose File
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2"
              placeholder=".jpg or .png files only"
              style={{ width: "300px", height: "24px" }}
              value={selectedFileName || ""}
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
    </React.Fragment>
  );
};

export default UploaderGCP;
