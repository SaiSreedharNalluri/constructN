import React, { useEffect, useState } from "react";
import NextImage from "../core/Image";
import { BootstrapDialog, BootstrapDialogTitle } from "../popupComponent/PopupComponent";
import { DialogContent, Tooltip } from "@mui/material";
import { truncateString } from "../../pages/projects";
interface IProps{
    attachment: any,
    setShowPreview:React.Dispatch<React.SetStateAction<boolean>
  >;
}
const AttachmentPreview:React.FC<IProps>=({attachment,setShowPreview})=>{
    useEffect(()=>{
        getFileType(attachment)
    },[attachment])
    const [openPreview, setOpenPreview] = useState(false);
    const [previewType, setPreviewType] = useState(""); //image,file,video;
    const [url, setUrl] = useState("");
    const getFileType = (attachment: any) => {
        let extension = attachment?.name?.split(".")?.pop()?.toLowerCase();
        setOpenPreview(true);
        switch (extension) {
          case "pdf":
            setPreviewType("file");
            setUrl(
              `https://docs.google.com/viewer?url=${attachment.url}&embedded=true`
            );
            break;
          case "mp3":
          case "mp4":
            setUrl(attachment.url);
            setPreviewType("video");
            break;
          case "jpg":
          case "jpeg":
          case "png":
            setUrl(attachment.url);
            setPreviewType("image");
            break;
          case "doc":
          case "docx":
            setPreviewType("file");
            setUrl(
              `https://view.officeapps.live.com/op/embed.aspx?src=${attachment.url}`
            );
            break;
          case "xls":
          case "xlsx":
            setPreviewType("file");
            setUrl(
              `https://view.officeapps.live.com/op/embed.aspx?src=${attachment.url}`
            );
            break;
          default:
            setUrl(attachment.url);
        }
      };
    const loadPreviewData = (url: string) => {
        switch (previewType) {
          case "image":
            return <NextImage src={url} className="h-fit w-fit" />;
          case "file":
            return <div className="h-101 w-auto"><iframe src={url} height="100%" width="100%" ></iframe></div> ;
          case "video":
            return (
               
              <video autoPlay controls height="100%" width="100%">
                <source src={url} type="video/mp4" />
              </video>
             
            );
          default:
            return <iframe src={url} width={800} height={800}></iframe>;
        }
      };
      
    return(
    <div>
        {url && <BootstrapDialog
        open={openPreview}
        aria-labelledby="customized-dialog-title"
         onClose={() => {
            setShowPreview(false)
            setOpenPreview(false);
          }}
        width="100%"
        >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          isUploader={true}
          onClose={() => {
            setShowPreview(false)
            setOpenPreview(false);
          }}
        >
          <Tooltip title={attachment?.name?.length > 20 ? attachment?.name : ""}><div>{truncateString(attachment.name,20)}</div></Tooltip>
       </BootstrapDialogTitle>
        <DialogContent dividers style={{padding:'30px',height:'100%',width:"100%"}}>
            <div>{loadPreviewData(url)}</div> </DialogContent>
        </BootstrapDialog>}
       
    </div>)
}
export default AttachmentPreview