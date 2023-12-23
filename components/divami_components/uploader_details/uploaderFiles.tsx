import React, { useCallback, useEffect, useRef, useState } from "react";
import ChooseUploaderFile from "../uploaderFIle/chooseUploaderFile";
import FileListing from "../fileListing/fileListing";
import ExifReader from "exifreader";
import PopupComponent from "../../popupComponent/PopupComponent";
import Warning from "../../../public/divami_icons/Warning_Icon.svg";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { fileWithExif } from "../../../state/uploaderState/state";
import { getCaptureIdFromModelOrString } from "../../../utils/utils";
import { getRawImages } from "../../../services/captureManagement";
import { UploaderModalPrimaryButton, UploaderModalTitle } from "../../../models/IUploader";
const UploaderFiles = () => {
  const { state, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [showPopUp, setshowPopUp] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [primaryButtonLabel,setPrimaryButtonLabel] = useState(UploaderModalPrimaryButton.skipFilesAndContinue)
  const [modalTitle,setModalTitle] =useState(UploaderModalTitle.warning)
  let refProcessing = useRef(false);
  let validFileCount = useRef(state.choosenFiles.validFiles.length)
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log("TestingUploader accepted files", acceptedFiles)
   if (acceptedFiles) {
    uploaderAction.chageIsReading(true)
      const batchSize = 100;
      if(acceptedFiles.length > 1500) {
        if(validFileCount.current > 0) {
          setMessage(`You have exceeded the maximum upload limit of 1500 files.You may upload 
          additional ${1500-validFileCount.current} files or reach out to
          support@constructn.ai for larger uploads.`)
          setPrimaryButtonLabel(UploaderModalPrimaryButton.ok)
          setModalTitle(UploaderModalTitle.uploadFileLimit)
          uploaderAction.chageIsReading(false)
          setshowPopUp(true)
          return

        } else {
          setMessage(`You have exceeded the maximum upload limit of 1500 files.`)
          setPrimaryButtonLabel(UploaderModalPrimaryButton.ok)
          setModalTitle(UploaderModalTitle.uploadFileLimit)
          setshowPopUp(true)
          uploaderAction.chageIsReading(false)
          return
        }
      } else if (acceptedFiles.length < 1500) {
        if((validFileCount.current + acceptedFiles.length) > 1500) {
          setMessage(`You have exceeded the maximum upload limit of 1500 files.You may upload 
                      additional ${1500-validFileCount.current} files or reach out to
                      support@constructn.ai for larger uploads.`)
          setPrimaryButtonLabel(UploaderModalPrimaryButton.ok)
          setModalTitle(UploaderModalTitle.uploadFileLimit)
          uploaderAction.chageIsReading(false)
          setshowPopUp(true)
          return
        }
      }
      for (let i = 0; i < acceptedFiles.length ; i += batchSize) {
        if (refProcessing.current !== true) {
          break;
        }
        const fileBatch = acceptedFiles.slice(i, i + batchSize);
        uploaderAction.appendFiles(await processFileBatch(fileBatch));
      }
      uploaderAction.chageIsReading(false)
     }
  }, [refProcessing.current]);
   useEffect(()=>{
    refProcessing.current = true
    return()=>{
      refProcessing.current = false
    }
   },[])
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
      setPrimaryButtonLabel(UploaderModalPrimaryButton.skipFilesAndContinue)
      setModalTitle(UploaderModalTitle.warning)
    }
  }, [state.choosenFiles.invalidEXIFFiles, state.choosenFiles.duplicateFiles]);

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
  useEffect(()=>{
  validFileCount.current = state.choosenFiles.validFiles.length;
  },[state.choosenFiles.validFiles.length])
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
        modalTitle={modalTitle}
        modalmessage={message}
        primaryButtonLabel={primaryButtonLabel}
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
