import React, { MouseEventHandler, ReactNode, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProps {
  onDrop: (acceptedFiles: any) => void;
  onDelete: (e: any) => void;
  onUpload: (e: any) => void;
  dragDropText?: string;
  supportFileText?: string;
  UploadingStatus: ReactNode;
  uploadedFileName: string | null;
  isDisabled: boolean;
  acceptFiles: Accept;
}

const ChooseOnboardingFiles: React.FC<IProps> = ({
  onDrop,
  onDelete,
  onUpload,
  dragDropText,
  supportFileText,
  UploadingStatus,
  isDisabled,
  uploadedFileName,
  acceptFiles,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    disabled: isDisabled,
    accept: acceptFiles,
  });
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleUpload = async (e: any) => {
    setIsFileUploaded(true);
    onUpload(e);
  };

  return (
    <div
      className={`flex flex-col items-center mt-16 w-40 h-20 border-[2px] rounded-8 border-dashed hover:border-[#F1742E] border-black py-6 px-2 cursor-pointer justify-center ${
        isDragActive ? "border-blue-500" : ""
      }`}
      {...getRootProps()}
    >
      <div className="flex  items-center justify-center gap-6">
        {uploadedFileName ? (
          <div className="flex">
            <p className="m-0 text-gray-700 font-medium text-xl">
              {uploadedFileName}
            </p>
            <Button
              onClick={(e: any) => onDelete(e)}
              startIcon={<DeleteIcon />}
            ></Button>
            {isFileUploaded ? (
              <Button
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  marginRight: "10px",
                  cursor: "not-allowed",
                }}
              >
                Uploaded
              </Button>
            ) : (
              <>
                <Button
                  onClick={(e: any) => handleUpload(e)}
                  style={{
                    backgroundColor: "#FF853E",
                    marginRight: "10px",
                    color: "white",
                  }}
                >
                  Upload
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="flex">
            {UploadingStatus}
            <div className="font-sans">
              <input {...getInputProps()} />
              <p className="font-thin">{supportFileText}</p>
              <p className="m-0 text-gray-700 font-medium text-xl">
                {dragDropText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseOnboardingFiles;
