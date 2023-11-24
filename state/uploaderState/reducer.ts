import { act } from "react-dom/test-utils";
import { GCPType } from "../../models/IGCP";
import { IJobs, JobStatus } from "../../models/IJobs";
import { RawImage, RawImageStatus, location, metaData } from "../../models/IRawImages";
import { getCaptureIdFromModelOrString, getInitialGCPList, getJobIdFromModelOrString } from "../../utils/utils";
import { UploaderActionType, UploaderActions } from "./action";
import { UploaderStep, UploaderState, choosenFileObject, uploadImage, fileWithExif, initialUploaderState } from "./state";
import { UploadFile } from "@mui/icons-material";


export const resetUploaderState = (): UploaderState => {
    return {
      ...initialUploaderState,
    };
  };
export const uploaderReducer = (state: UploaderState, action: UploaderActions): UploaderState => {
    switch (action.type) {
        case UploaderActionType.startNewUpload: 
            return {
                ...state,
                step: UploaderStep.Details,
                structure: undefined,
                date: undefined,
                isNextEnabled: false,
                choosenFiles: {
                    validFiles: [],
                    invalidEXIFFiles: [],
                    duplicateFiles: []
                },
                gcpType: GCPType.LONGLAT,
                gcpList: getInitialGCPList(false), // default is LONGLAT
                skipGCP: false,
                selectedJob: undefined,
                isAppendingCapture: false,
                uploadinitiate:false,
            }
        case UploaderActionType.setUploadCompletionState:
            return {
                ...state,
                completionState: action.payload.status
            }
        case UploaderActionType.refreshJobs:
            return {
                ...state,
                updateJobs: true
            }
        case UploaderActionType.GoBack: 
            let previousStep = state.step - 1
            return {
                ...state,
                step: previousStep,
                skipGCP: false,
                isNextEnabled: isNext(state, previousStep)
            }
        case UploaderActionType.Next: 
        console.log("TestingUploader: in reducer next");
            let nextStep = state.step + 1
            return {
                ...state,
                step: nextStep,
                isNextEnabled: isNext(state, nextStep),
            }
        case UploaderActionType.skipGCP: 
            return {
                ...state,
                step: state.step + 1,
                skipGCP: true,
                isNextEnabled: isNext(state, state.step + 1),
            }
        case UploaderActionType.UpdateDate:
            return {
                ...state,
                date: action.payload.date
            }
        case UploaderActionType.setIsLoading:
            return {
                ...state,
                isLoading:action.payload.isLoading
            }
        case UploaderActionType.setshowMessage:
            return {
                ...state,
                showMessage:action.payload.showMessage
            }
        case UploaderActionType.setProject:
            return {
                ...state,
                project:action.payload.project
            }
        case UploaderActionType.setStructure:
            return {
                ...state,
                structure:action.payload.structure
            }
        case UploaderActionType.setStepperSideFilesList:
            return {
                ...state,
                stepperSideFileList:action.payload.stepperSideFileList
            }
        case UploaderActionType.setIsAppendingCapture:
            return {
                ...state,
                isAppendingCapture:action.payload.isAppendingCapture
            }
        case UploaderActionType.appendFiles:
            let updatedList = getUpdatedFileList(state, action.payload.files);
            return {
                ...state,
                isReading: false,
                choosenFiles: updatedList,
                isNextEnabled: updatedList.validFiles.length > 0
            }
        case UploaderActionType.setExtractedFileValue:
            return{
                ...state,
                extractedFileValue:action.payload.extractedFileValue
            } 
        case UploaderActionType.setIsNextEnabled:
            return{
                ...state,
                isNextEnabled:action.payload.IsNextEnabled
            }
        case UploaderActionType.changeUploadinitiate:
                return {
                    ...state,
                    uploadinitiate:action.payload.uploadinitiate
                }       
        case UploaderActionType.setGCPType:
            return {
                ...state,
                gcpType: action.payload.type,
                gcpList: getInitialGCPList(action.payload.type == GCPType.UTM)
            }
        case UploaderActionType.setGCPList:
            let location = action.payload.list.utmLocation ? action.payload.list.utmLocation : action.payload.list.location ? action.payload.list.location : undefined
            let isNextEnabled=false
            if(location ){
                if(state.errorCount === 0){
                isNextEnabled = location.length >=4 
                }
            }
            return{
                ...state,
                gcpList:action.payload.list,
                gcpType: action.payload.type,
                isNextEnabled: isNextEnabled
            }
        case UploaderActionType.setCaptureJobs:
            
            let pendingUploadJobs: IJobs[] = action.payload.jobs.filter((e) => e.status === JobStatus.pendingUpload);
            let pendingProcessJobs: IJobs[] = action.payload.jobs.filter((e) => e.status === JobStatus.uploaded);
            let isUploadStep = pendingUploadJobs.length > 0 || pendingProcessJobs.length>0

            return {
                ...state,
                pendingUploadJobs: pendingUploadJobs,
                pendingProcessJobs: pendingProcessJobs,
                updateJobs: false
                // step: isUploadStep ? UploaderStep.Upload : UploaderStep.Details
            }
        case UploaderActionType.setRawImagesMap:
            return {
                ...state,
                rawImagesMap: action.payload.rawImages
            }
        case UploaderActionType.chageIsReading:
                return {
                    ...state,
                    isReading:action.payload.isReading
                }       
        case UploaderActionType.setSelectedJob:
            return {
                ...state,
                selectedJob: action.payload.job
            }
        case UploaderActionType.updateWorkerStatus:
            let workers = state.inProgressWorkers
            let captureId = action.payload.workerFileList[0].uploadObject.capture
            let newWorkerStatus = { 
                ...workers,
                [captureId as string]: action.payload.workerFileList
            }
            return {
                ...state,
                inProgressWorkers: newWorkerStatus
            }

        case UploaderActionType.setErrorCount:
            return{
                ...state,
                errorCount:action.payload.errorCount
            } 
        case UploaderActionType.setResetUploaderState:
            return resetUploaderState();
       
        default:
            return state
    }
}

const isNext = (state: UploaderState, step: UploaderStep): boolean => {
    switch (step) {
        case UploaderStep.Details:
            return state.date ? state.structure ? true : false : false
        case UploaderStep.ChooseFiles:
            return state.choosenFiles.validFiles.length > 0;
        case UploaderStep.ChooseGCPs:
            let location = state.gcpList.utmLocation ? state.gcpList.utmLocation : state.gcpList.location ? state.gcpList.location : undefined
            return location ? location?.length >= 4 : false
        case UploaderStep.Review:
            return true;
        case UploaderStep.Upload:
            return false;
        default:
            return false;
    }
}

const getUpdatedFileList = (state: UploaderState, files: fileWithExif[],): choosenFileObject => {
    let choosenFiles = state.choosenFiles;
    let invalidEXIFFiles: File[] = [];
    let duplicateEXIFFiles: uploadImage[] = [];
    let validEXIFFiles: uploadImage[] = []
    files.forEach((fileWithExif) => {
        let file = fileWithExif.file
        let deviceId = fileWithExif.exifData?.BodySerialNumber?.description
        let dateTimeOriginal = fileWithExif.exifData?.DateTimeOriginal?.description
        let altitude = fileWithExif.exifData?.GPSAltitude?.description ? parseInt(fileWithExif.exifData?.GPSAltitude?.description) : undefined
        let latitude = fileWithExif.exifData?.GPSLatitude?.description ? parseInt(fileWithExif.exifData?.GPSLatitude?.description) : undefined
        let longitude = fileWithExif.exifData?.GPSLongitude?.description ? parseInt(fileWithExif.exifData?.GPSLongitude?.description) : undefined
        if (deviceId && dateTimeOriginal) {
            let rawImage: RawImage = {
                filename: file.name,
                deviceId: deviceId,
                externalId: deviceId + dateTimeOriginal,
                dateTime: dateTimeOriginal,
                status: RawImageStatus.initiated,
            }
            if(latitude && longitude && altitude) {
                
                let location: location = {
                    type: "point",
                    coordinates: [longitude, latitude],
                    elevation: altitude
                }
                rawImage.location = location
            }
            let metaData:metaData={
                fileSize:file.size
            }
            rawImage.metaData = metaData
            let newUploadImage: uploadImage = {file, ...rawImage}
            let alreadyUploadedFile;
            if(state.isAppendingCapture && state.selectedJob) {
                console.log("TestingUploader in append files reducer: ", state.rawImagesMap, state.selectedJob)
                alreadyUploadedFile = state.rawImagesMap[getCaptureIdFromModelOrString(state.selectedJob.captures[0])].find((image) => {
                    return image.deviceId == deviceId && image.dateTime == dateTimeOriginal && image.status !== RawImageStatus.failedTimedOut
                })
            }
            let duplicateFileInCurrent = validEXIFFiles.find((uploadImages) => {
                return uploadImages.deviceId == deviceId && uploadImages.dateTime == dateTimeOriginal
            })
            let duplicateFile = choosenFiles.validFiles.find((uploadImages) => {
                return uploadImages.deviceId == deviceId && uploadImages.dateTime == dateTimeOriginal
            })
            if (duplicateFile || alreadyUploadedFile || duplicateFileInCurrent) {
                duplicateEXIFFiles.push(newUploadImage)
            } else {
                validEXIFFiles.push(newUploadImage)
            }
        } else {
            invalidEXIFFiles.push(fileWithExif.file)
        }
    })
    return {
        validFiles: validEXIFFiles.concat(...choosenFiles.validFiles),
        invalidEXIFFiles: invalidEXIFFiles.concat(...choosenFiles.invalidEXIFFiles),
        duplicateFiles: duplicateEXIFFiles.concat(...choosenFiles.duplicateFiles)
    }
}




