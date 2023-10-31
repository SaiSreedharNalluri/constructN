import React, { useCallback, useState } from "react";
import ChooseUploaderFile from "../uploaderFIle/chooseUploaderFile";
import FileListing from "../fileListing/fileListing";
import ExifReader from "exifreader";
const UploaderFiles = () => {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles:File[]) => {
    // Do something with the accepted files, like uploading them
    if(acceptedFiles)
    {
        acceptedFiles.map((file:any)=>{
        const reader = new FileReader();
        reader.onload = (event) => {
        const arrayBuffer:any = event?.target?.result;
        const tags = ExifReader.load(arrayBuffer);
        file.deviceId=tags?.BodySerialNumber?.description
        file.timestamp=tags?.DateTimeOriginal?.description
        file.altitude=tags?.GPSAltitude?.description
        file.latitude=tags?.GPSLatitude?.description
        file.longitude=tags?.GPSLongitude?.description
        };
        reader.readAsArrayBuffer(file);
        })
        setSelectedFile((prevFiles) => [...prevFiles, ...acceptedFiles]);
      }
  }, []);
  console.log('select',selectedFile)
    return (
    <React.Fragment>
      <div className="flex flex-col">
        <div>
        <ChooseUploaderFile onDrop={onDrop}  />
        </div>
       <div className="mt-5 mb-5">
        <FileListing selectedFile={selectedFile} isSizeRequired={true}/>
       </div>
      </div>
    </React.Fragment>
  );
};

export default UploaderFiles;
