import React, { useCallback, useEffect, useState } from "react";
import ChooseUploaderFile from "../uploaderFIle/chooseUploaderFile";
import FileListing from "../fileListing/fileListing";
import ExifReader from "exifreader";
import PopupComponent from "../../popupComponent/PopupComponent";
import  Warning  from "../../../public/divami_icons/Warning_Icon.svg";
import { IExifFile } from "../../../models/IExifFile";
const UploaderFiles = () => {
  const [unExifFiles,setUnExifFiles]=useState<File[]>([])
  const [exifFiles,setExifFiles] =useState<IExifFile[]>([])
  const [showPopUp, setshowPopUp] = useState(false);
  const [message,setMessage]=useState<string>('')
  const [duplicateFiles,setDuplicateFiles] =useState<any[]>([])
  const onDrop = useCallback((acceptedFiles:File[]) => {
    if(acceptedFiles)
    {
        acceptedFiles.map((file:any)=>{
        const reader = new FileReader();
        reader.onload = (event) => {
        const arrayBuffer:any = event?.target?.result;
        const exifData = ExifReader.load(arrayBuffer);
        if(exifData?.BodySerialNumber?.description && exifData?.DateTimeOriginal?.description)
        {
          file.deviceId=exifData?.BodySerialNumber?.description
          file.timestamp=exifData?.DateTimeOriginal?.description
          file.altitude=exifData?.GPSAltitude?.description
          file.latitude=exifData?.GPSLatitude?.description
          file.longitude=exifData?.GPSLongitude?.description
          setExifFiles((prevFiles) =>
          {
             if(prevFiles.some((prevFile:any) => prevFile?.deviceId === file.deviceId && prevFile?.timestamp === file.timestamp))
            {
            setDuplicateFiles((prevFiles) => [...prevFiles, file]);
            return[...prevFiles]
            }
            else{
              return [...prevFiles, file]
            }
          });
        }
        else{
          setUnExifFiles((prevFiles) => [...prevFiles, file]);
            }
        };
        reader.readAsArrayBuffer(file);
        })
      }
      }, []);
      useEffect(()=>{
        if(unExifFiles.length> 0&& duplicateFiles.length>0)
      {
        setshowPopUp(true)
        setMessage(`${unExifFiles.length} files donot have exif data. these files will not be uploaded and ${duplicateFiles.length} duplicate files will not be uploaded `)
      }
      else if(unExifFiles.length>0)
      {
        setshowPopUp(true)
        setMessage(`${unExifFiles.length} files donot have exif data. these files will not be uploaded`)
      }
      else if(duplicateFiles.length>0)
      {
        setshowPopUp(true)
        setMessage(`${duplicateFiles.length} duplicate files will not be uploaded`)
      }
      },[unExifFiles,duplicateFiles])
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
      <PopupComponent  open={showPopUp}
                setShowPopUp={setshowPopUp}
                isImageThere={true}
                imageSrc={Warning}
                modalTitle={"Warning"}
                modalmessage={message}
                primaryButtonLabel={"Skip Files and Complete"}
                isUploader={false}
                SecondaryButtonlabel={""}
                callBackvalue={()=>{       
                setshowPopUp(false)
               }}/>
    </React.Fragment>
  );
};

export default UploaderFiles;
