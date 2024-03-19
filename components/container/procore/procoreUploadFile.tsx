import React, { useState } from "react";
import { styled } from "@mui/system";
import { Box, Tooltip } from "@mui/material";
import Image from "next/image";
import Delete from "../../../public/divami_icons/delete.svg";
import { truncateString } from "../../../pages/projects";
import PopupComponent from "../../popupComponent/PopupComponent";

const ImageItem = styled(Box)({
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#101F4C",
  marginTop: 10,
});

const AttachedImageDiv = styled("div")`
  display: flex;
 // justify-content:  space-around;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const AttachedImageTitle = styled("div")`
margin-left: 21px;
cursor: pointer;
`;

export const AttachedImageIcon = styled("div")``;

export const DeleteIcon = styled(Image)`
cursor: pointer;
width: 24px;
height: 24px;
`;

const ProcoreUploadFile = ({
 files,
 setFiles
}: any) => {  
  const [attachmentPopup, setAttachmentPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [fileIndex,setFileIndex] = useState<number>()
  const handleDelete = (indexToRemove:number,selectedFile:any) => {
    const updatedFiles:any = files?.filter(( index:any) => index !== indexToRemove);
    setFiles(updatedFiles); 
  };
  return (
  <React.Fragment>
 {files&&files.length > 0 && (
                        <div>
                         {files.map((file: File, index: number) => {
                                return(
                              <AttachedImageDiv className={`detailsImageDiv`} key={index}>
                              <div className="w-[50%]">
                                <Tooltip title={file?.name?.length > 20 ? file?.name : ""}>
                                  <AttachedImageTitle>{truncateString(file?.name, 20)}</AttachedImageTitle>
                                </Tooltip>
                                </div>
                                <DeleteIcon
                                  src={Delete}
                                  alt={"delete icon"}
                                  onClick={() => {
                                    setFileIndex(index)
                                    setAttachmentPopup(true);
                                    setSelectedFile(file);

                                  } } />
                              
                              </AttachedImageDiv>
                               )})}
                          
                        </div>
                      )}
                      {attachmentPopup && (
                <PopupComponent
                open={attachmentPopup}
                setShowPopUp={setAttachmentPopup}
                modalTitle={"Delete Attachment"}
                modalmessage={`Are you sure you want to delete this attachment "${truncateString(selectedFile?.name,20)}" ?`}
                primaryButtonLabel={"Delete"}
                SecondaryButtonlabel={"Cancel"}
                callBackvalue={() => {
                  setAttachmentPopup(false);
                  handleDelete(selectedFile,fileIndex)
                 
                }}
              />
              )}
  </React.Fragment>) 
};

export default ProcoreUploadFile;
