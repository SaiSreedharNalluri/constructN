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

const UploadedImagesList = ({
  formData,
  deleteTheAttachment,
  formConfig,
  setFormData,
}: any) => {
  const [attachmentPopup, setAttachmentPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>();
  const handleDeleteAttachment = (eachSelectedFile: any) => {
    if (eachSelectedFile?._id) {
      deleteTheAttachment(eachSelectedFile?._id, "issue");
      setFormData((prev: any) =>
        prev.map((item: any) => {
          if (item.id === "file-upload") {
            return {
              ...item,
              selectedFile: item.selectedFile.filter(
                (file: any) => file.name !== eachSelectedFile?.name
              ),
            };
          }
          return item;
        })
      );
    } else {
      setFormData((prev: any) =>
        prev.map((item: any) => {
          if (item.id === "file-upload") {
            return {
              ...item,
              selectedFile: item.selectedFile.filter(
                (file: any) => file.name !== eachSelectedFile?.name
              ),
            };
          }
          return item;
        })
      );
    }
  };
  return (<React.Fragment>
{formData && formData.length
    ? formData
        .filter((item: any) => item.id === "file-upload")[0]
        ?.selectedFile?.map((eachSelectedFile: any, index: number) => {
          return (
            <AttachedImageDiv className={`detailsImageDiv`} key={index}>
              <div className="w-[50%]">
              <Tooltip title={eachSelectedFile?.name?.length > 20 ? eachSelectedFile?.name : ""}>
              <AttachedImageTitle>{truncateString(eachSelectedFile?.name,20)}</AttachedImageTitle>
              </Tooltip>
              </div>
              <DeleteIcon
                src={Delete}
                alt={"delete icon"}
                onClick={() => {
                setAttachmentPopup(true);
                setSelectedFile(eachSelectedFile);
                  }}
              />
            </AttachedImageDiv>
          );
        })
    : null}
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
                  handleDeleteAttachment(selectedFile);
                 
                }}
              />
              )}
  </React.Fragment>) 
};

export default UploadedImagesList;
