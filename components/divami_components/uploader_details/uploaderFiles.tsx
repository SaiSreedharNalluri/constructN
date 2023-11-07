import React, { useCallback, useEffect, useState } from "react";
import ChooseUploaderFile from "../uploaderFIle/chooseUploaderFile";
import FileListing from "../fileListing/fileListing";
import ExifReader from "exifreader";
import PopupComponent from "../../popupComponent/PopupComponent";
import Warning from "../../../public/divami_icons/Warning_Icon.svg";
import { IExifFile } from "../../../models/IExifFile";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { fileWithExif } from "../../../state/uploaderState/state";
const UploaderFiles = () => {
  const { state, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;

  const validEXIFFiles = state.choosenFiles.validFiles;
  const invalidEXIFFiles = state.choosenFiles.invalidEXIFFiles;
  const duplicateFiles = state.choosenFiles.duplicateFiles;
  const [showPopUp, setshowPopUp] = useState(false);
  const [message, setMessage] = useState<string>("");
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles) {
      // console.log("ChooseFiles onDrop: ", acceptedFiles);
      let acceptedFilesWithExif: fileWithExif[] = await Promise.all(
        acceptedFiles.map(async (file) => {
          return {
            file: file,
            exifData: await ExifReader.load(file),
          };
        })
      );
      uploaderAction.appendFiles(acceptedFilesWithExif);
      // console.log("ChooseFiles onDrop: withExif", acceptedFilesWithExif);
    }
  }, []);
  useEffect(() => {
    // console.log("ChooseFiles inavlidDialog useeffect: ", invalidEXIFFiles, duplicateFiles);
    if (invalidEXIFFiles.length > 0 && duplicateFiles.length > 0) {
      setshowPopUp(true);
      setMessage(
        `${invalidEXIFFiles.length} files donot have exif data. these files will not be uploaded and ${duplicateFiles.length} duplicate files will not be uploaded `
      );
    } else if (invalidEXIFFiles.length > 0) {
      setshowPopUp(true);
      setMessage(
        `${invalidEXIFFiles.length} files donot have exif data. these files will not be uploaded`
      );
    } else if (duplicateFiles.length > 0) {
      setshowPopUp(true);
      setMessage(
        `${duplicateFiles.length} duplicate files will not be uploaded`
      );
    }
  }, [invalidEXIFFiles.length,duplicateFiles.length]);
  return (
    <React.Fragment>
      <div className="flex flex-col">
        <div>
          <ChooseUploaderFile onDrop={onDrop} />
        </div>
        <div className="mt-5 mb-5">
          <FileListing selectedFile={validEXIFFiles.map((e) => e.file)} isSizeRequired={true} />
        </div>
      </div>
      <PopupComponent
        open={showPopUp}
        setShowPopUp={setshowPopUp}
        isImageThere={true}
        imageSrc={Warning}
        modalTitle={"Warning"}
        modalmessage={message}
        primaryButtonLabel={"Skip Files and Complete"}
        isUploader={false}
        SecondaryButtonlabel={""}
        callBackvalue={() => {
          setshowPopUp(false);
        }}
      />
    </React.Fragment>
  );
};

export default UploaderFiles;
