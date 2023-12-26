import React, { MouseEventHandler, ReactNode, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { Signal, useComputed } from "@preact/signals-react";

interface IProps {
  onDrop: (acceptedFiles: any) => void;
  onDelete: (e: any) => void;
  onUpload: (e: any) => void;
  dragDropText?: string;
  supportFileText?: string;
  UploadingStatus: ReactNode;
  fileToUpload: Signal<File | undefined>;
  uploadStatus: Signal<boolean>;
  existingBIM: Signal<string | undefined>;
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
  fileToUpload,
  uploadStatus,
  existingBIM,
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

  const renderDeleteIcon = useComputed(() => uploadStatus.value === false ? <Button
    onClick={(e: any) => onDelete(e)}
    startIcon={<DeleteIcon />}
  /> : <></>)

  const renderFileChooser = useComputed(() => fileToUpload.value !== undefined || existingBIM.value !== undefined ? (
    <div className="flex">
      <p className="m-0 text-gray-700 font-medium text-xl">
        {existingBIM.value !== undefined ? existingBIM.value : fileToUpload.value!.name }
      </p>
      {renderDeleteIcon}
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
  ))

  return (
    <div
      className={`flex flex-col items-center w-full h-15 border-[2px] rounded-lg border-dashed hover:border-[#F1742E] border-black py-6 px-8 cursor-pointer justify-center ${
        isDragActive ? "border-blue-500" : ""
      }`}
      {...getRootProps()}
    >
      <div className="flex  items-center justify-center gap-6">
        {renderFileChooser}
      </div>
    </div>
  );
};

export default ChooseOnboardingFiles;
