import React, { useState } from "react";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import Image from "next/image";
import Delete from "../../../public/divami_icons/delete.svg";
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
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const AttachedImageTitle = styled("div")`
  margin-left: 21px;
`;

export const AttachedImageIcon = styled("div")``;

export const DeleteIcon = styled(Image)`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const UploadedImagesList = ({
  formData,
  deleteTheAttachment,
  formConfig,
  setFormData,
}: any) => {
  const [showPopUp, setshowPopUp] = useState(false);
  const [delAttach, setDelAttach] = useState({
    _id: "",
    name: "",
  });

  // const hidePopup = () => {
  //   setshowPopUp()
  // }

  const handleDeleteAttachment = (props: any) => {
    //   console.log("deleting");
    // console.log("KARAN", eachSelectedFile);
    let eachSelectedFile = { ...delAttach };
    //   console.log()
    console.log("KARAN", eachSelectedFile);
    //  return;
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
  return formData && formData.length
    ? formData
        .filter((item: any) => item.id === "file-upload")[0]
        ?.selectedFile?.map((eachSelectedFile: any, index: number) => {
          return (
            <>
              <AttachedImageDiv className={`detailsImageDiv`} key={index}>
                {/* <AttachedImageTitle>{a?.name}</AttachedImageTitle> */}
                <AttachedImageTitle>
                  {eachSelectedFile?.name}
                </AttachedImageTitle>

                {/* <AttachedImageIcon>
              <Image src={""} alt="" />
            </AttachedImageIcon> */}
                <DeleteIcon
                  src={Delete}
                  alt={"delete icon"}
                  onClick={() => {
                    // handleDeleteAttachment(eachSelectedFile);
                    setshowPopUp(true);
                    setDelAttach({
                      _id: eachSelectedFile?.name,
                      name: eachSelectedFile?._id,
                    });
                  }}
                  className={`deleteIcon`}
                />
              </AttachedImageDiv>

              {showPopUp && (
                <PopupComponent
                  open={showPopUp}
                  setShowPopUp={setshowPopUp}
                  modalTitle={"Delete Issue"}
                  modalmessage={`Are you sure you want to delete this attachemnt ${delAttach?._id}"?`}
                  primaryButtonLabel={"Delete"}
                  SecondaryButtonlabel={"Cancel"}
                  callBackvalue={handleDeleteAttachment}
                />
              )}
            </>
          );
        })
    : null;
};

export default UploadedImagesList;
