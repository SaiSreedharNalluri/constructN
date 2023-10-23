import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import closeWithCircle from "../../../public/divami_icons/closeWithCircle.svg";
import React, { useState } from "react";
import { CloseIcon } from "../task_list/TaskListStyles";

const UploaderFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: any) => {
    const files = e.target.files;
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    if (selectedFiles) {
      const updatedFiles = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        if (i !== index) {
          updatedFiles.push(selectedFiles[i]);
        }
      }
      const updatedFileList = createFileList(updatedFiles);
      setSelectedFiles(updatedFileList);
    }
  };

  const handleUpload = () => {
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        console.log("Selected file name:", selectedFiles[i].name);
      }
    }
  };

  const createFileList = (files: File[]) => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      dataTransfer.items.add(file);
    });
    return dataTransfer.files;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="my-4 mb-4 font-bold">Upload Files</h2>
      <div className="flex items-center mb-4">
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          multiple
          onChange={handleFileChange}
          className="mr-4"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>
      {selectedFiles && selectedFiles.length > 0 && (
        <div>
          <h3 className="mt-4">Selected Files: ({selectedFiles.length})</h3>
          <ul>
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index}>
                {file.name}
                <CloseIcon
                  onClick={() => removeFile(index)}
                  src={closeWithCircle}
                  alt="close icon"
                  data-testid="close-icon"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploaderFiles;
