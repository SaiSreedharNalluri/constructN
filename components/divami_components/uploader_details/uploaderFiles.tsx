import React, { useState } from "react";
import FileUploader from "../fileUploader/fileUploader";
const UploaderFiles = () => {
  const [isAppend,setIsAppend]=useState(false)
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  return (
    <React.Fragment>
      <div>
        <FileUploader  isAppend={isAppend}selectedFile={selectedFile}setSelectedFile={setSelectedFile}></FileUploader>
      </div>
    </React.Fragment>
  );
};

export default UploaderFiles;
