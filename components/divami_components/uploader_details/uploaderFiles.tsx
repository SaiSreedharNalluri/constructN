import React, { useState } from "react";
import ChooseFile from "../chooseFile/chooseFile";
import FileListing from "../fileListing/fileListing";
const UploaderFiles = () => {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
    return (
    <React.Fragment>
      <div className="flex flex-col">
        <div>
        <ChooseFile  isAppend={true} setSelectedFile={setSelectedFile} isExifRead={true}/>
        </div>
       <div className="mt-5 mb-5">
        <FileListing selectedFile={selectedFile} isSizeRequired={true}/>
       </div>
      </div>
    </React.Fragment>
  );
};

export default UploaderFiles;
