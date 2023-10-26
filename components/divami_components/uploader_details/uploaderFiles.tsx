import React, { useState } from "react";
import FileUploader from "../fileUploader/fileUploader";
import FileListing from "../fileListing/fileListing";
const UploaderFiles = () => {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
    return (
    <React.Fragment>
      <div className="flex flex-col">
        <div>
        <FileUploader  isAppend={true}selectedFile={selectedFile}setSelectedFile={setSelectedFile}/>
        </div>
       <div className="mt-5 mb-5">
        <FileListing selectedFile={selectedFile} isSizeRequired={true}/>
       </div>
      </div>
    </React.Fragment>
  );
};

export default UploaderFiles;
