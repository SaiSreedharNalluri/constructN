import React, { useCallback, useState } from "react";
import ChooseUploaderFile from "../uploaderFIle/chooseUploaderFile";
import FileListing from "../fileListing/fileListing";
import ExifReader from "exifreader";
const UploaderFiles = () => {
  const [unExifFiles,setUnExifFiles]=useState<File[]>([])
  const [exifFiles,setExifFiles] =useState<File[]>([])
  const onDrop = useCallback((acceptedFiles:File[]) => {
    if(acceptedFiles)
    {
        acceptedFiles.map((file:any)=>{
        const reader = new FileReader();
        reader.onload = (event) => {
        const arrayBuffer:any = event?.target?.result;
        const exifData = ExifReader.load(arrayBuffer);
        if(exifData?.GPSLatitude?.description && exifData?.GPSLatitude?.description && exifData?.DateTimeOriginal?.description && exifData?.DateTimeOriginal?.description)
        {
          file.deviceId=exifData?.BodySerialNumber?.description
          file.timestamp=exifData?.DateTimeOriginal?.description
          file.altitude=exifData?.GPSAltitude?.description
          file.latitude=exifData?.GPSLatitude?.description
          file.longitude=exifData?.GPSLongitude?.description
          setExifFiles((prevFiles) => [...prevFiles, file]);
        }
        else{
          setUnExifFiles((prevFiles) => [...prevFiles, file]);
        }
        };
        reader.readAsArrayBuffer(file);
        })
      }
  }, []);
    return (
    <React.Fragment>
      <div className="flex flex-col">
        <div>
        <ChooseUploaderFile onDrop={onDrop}  />
        </div>
       <div className="mt-5 mb-5">
        <FileListing selectedFile={exifFiles} isSizeRequired={true}/>
       </div>
      </div>
    </React.Fragment>
  );
};

export default UploaderFiles;
