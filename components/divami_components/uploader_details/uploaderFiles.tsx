import React, { useCallback, useEffect, useState } from "react";
import ChooseUploaderFile from "../uploaderFIle/chooseUploaderFile";
import FileListing from "../fileListing/fileListing";
import ExifReader from "exifreader";
import PopupComponent from "../../popupComponent/PopupComponent";
import Warning from "../../../public/divami_icons/Warning_Icon.svg";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { fileWithExif } from "../../../state/uploaderState/state";
import { getCaptureIdFromModelOrString } from "../../../utils/utils";
import { getRawImages } from "../../../services/captureManagement";
const UploaderFiles = () => {
  const { state, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;

  const [showPopUp, setshowPopUp] = useState(false);
  const [message, setMessage] = useState<string>("");
 
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles) {
      uploaderAction.chageIsReading(true);
      let filesWithExif: fileWithExif[] = []
      const batchSize = 100;
      for (let i = 0; i < acceptedFiles.length; i += batchSize) {
        const fileBatch = acceptedFiles.slice(i, i + batchSize);
        filesWithExif = [...filesWithExif, ...(await processFileBatch(fileBatch))]
      }
      uploaderAction.chageIsReading(false)
      uploaderAction.appendFiles(filesWithExif);
    }
  }, []);

  const processFileBatch = async (fileBatch:File[]):Promise<fileWithExif[]> => {
      const acceptedFilesWithExif: fileWithExif[] = await Promise.all(
        fileBatch.map(async (file) => {
          try {
           
            const exifData = await ExifReader.load(file);
            return {
              file: file,
              exifData: exifData,
            };
          } catch (exifError) {
            return {
              file: file,
              exifData: undefined,
            }
          }
        })
      );
      return acceptedFilesWithExif;
  }
  useEffect(() => {
    // console.log("TestingUploader useeffect choose files: ", state.filesDropped);
    if(state.filesDropped) {
      if (state.choosenFiles.invalidEXIFFiles.length > 0 && state.choosenFiles.invalidEXIFFiles.length > 0 && !state.isReading) {
        setshowPopUp(true);
        setMessage(
          `${state.choosenFiles.invalidEXIFFiles.length} file(s) do not have exif data. These file(s) will not be uploaded.
          ${state.choosenFiles.duplicateFiles.length} duplicate file(s) found. They will be skipped.`
        );
      } else if (state.choosenFiles.invalidEXIFFiles.length > 0 && !state.isReading) {
        setshowPopUp(true);
        setMessage(
          `${state.choosenFiles.invalidEXIFFiles.length} file(s) do not have exif data. These file(s) will not be uploaded.`
        );
      } else if (state.choosenFiles.duplicateFiles.length > 0 && !state.isReading) {
        setshowPopUp(true);
        setMessage(
          `${state.choosenFiles.duplicateFiles.length} duplicate file(s) found. They will be skipped.`
        );
      }
    }
  }, [state.choosenFiles.invalidEXIFFiles.length, state.choosenFiles.duplicateFiles.length]);

  useEffect(() => {
    if (state.isAppendingCapture && state.selectedJob) {
      let captureId = getCaptureIdFromModelOrString(state.selectedJob.captures[0])
      if(!state.rawImagesMap[captureId]) {
        console.log("TestingUploader: inside useEffect isAppendingCapture ", state.selectedJob, state.rawImagesMap[getCaptureIdFromModelOrString(state.selectedJob.captures[0])])
        uploaderAction.setIsLoading(true);
        getRawImages(state.selectedJob.project as string, captureId)?.then((response) => {
          uploaderAction.setIsLoading(false);
          console.log("TestingUploader: getRawImages of selected job ", response.data.result)
          uploaderAction.setRawImagesMap({
            ...state.rawImagesMap,
            [captureId as string]: response.data.result
          })
        })
      }
    }
  }, [state.isAppendingCapture, state.selectedJob])

  return (
    <React.Fragment>
      <div className="flex flex-col justify-center items-center">
        <div>
          <ChooseUploaderFile onDrop={onDrop} />
        </div>
        <div>
          <FileListing selectedFile={state.choosenFiles.validFiles.map((e) => e.file)} isSizeRequired={true} />
        </div>
      </div>
      <PopupComponent
        open={showPopUp}
        setShowPopUp={setshowPopUp}
        isImageThere={true}
        imageSrc={Warning}
        modalTitle={"Warning"}
        modalmessage={message}
        primaryButtonLabel={"Skip Files and Continue"}
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
