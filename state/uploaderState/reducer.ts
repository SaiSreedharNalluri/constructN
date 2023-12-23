import { act } from "react-dom/test-utils";
import { GCPType, IGCP } from "../../models/IGCP";
import { IJobs, JobStatus } from "../../models/IJobs";
import { RawImage, RawImageStatus, location, metaData, utmLocation } from "../../models/IRawImages";
import { getCaptureIdFromModelOrString, getInitialGCPList, getJobIdFromModelOrString, validateAltitudeOrElevation, validateEasting, validateLatitude, validateLongitude, validateUTMZone, validatingNorthing } from "../../utils/utils";
import { UploaderActionType, UploaderActions } from "./action";
import { UploaderStep, UploaderState, choosenFileObject, uploadImage, fileWithExif, initialUploaderState, UploaderPopups } from "./state";
import { PopupComponentProps } from "../../components/popupComponent/PopupComponent";
import { PopupData } from "../../models/Poppup";

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
                filesDropped: false,
                gcpType: GCPType.LONGLAT,
                gcpList: getInitialGCPList(false), // default is LONGLAT
                errorCount: validateGCPList(getInitialGCPList(false)).error,
                isGCPInit: true,
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
                filesDropped: false,
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
        case UploaderActionType.setIsAppendingCapture:
            return {
                ...state,
                isAppendingCapture:action.payload.isAppendingCapture
            }
        case UploaderActionType.appendFiles:
            let updatedList = getUpdatedFileList(state, action.payload.files);
            return {
                ...state,
                choosenFiles: updatedList,
                filesDropped: true,
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
            let newGCPList: IGCP = {
                ...getInitialGCPList(action.payload.type == GCPType.UTM),
                base64ImageName: state.gcpList.base64ImageName,
                base64Code: state.gcpList.base64Code,
                description: state.gcpList.description
            }
            let {error: newError, length: newLength} = validateGCPList(newGCPList)
            return {
                ...state,
                gcpType: action.payload.type,
                gcpList: newGCPList,
                errorCount: newError,
                isNextEnabled: newError === 0 && newLength >= 4
            }
        case UploaderActionType.setGCPList:
            let gcpList: IGCP = { 
                ...action.payload.list,
                base64ImageName: state.gcpList.base64ImageName,
                base64Code: state.gcpList.base64Code,
                description: state.gcpList.description
            }
            let {error, length} = validateGCPList(gcpList)
            
            return{
                ...state,
                isGCPInit: false,
                gcpList: gcpList,
                gcpType: action.payload.type,
                errorCount: error,
                isNextEnabled: error === 0 && length >= 4
            }
        case UploaderActionType.setGCPBase64:
            let updatedBase64GCP: IGCP = {
                ...state.gcpList, 
                base64Code: action.payload.base64, 
                base64ImageName: action.payload.imageName
            }
            return {
                ...state,
                gcpList: updatedBase64GCP
            }
        case UploaderActionType.setGCPDescription:
            let updatedDescriptionGCP: IGCP = {
                ...state.gcpList, 
                description: action.payload.description
            }
            return {
                ...state,
                gcpList: updatedDescriptionGCP
            }
        case UploaderActionType.setCaptureJobs:
            
            let pendingUploadJobs: IJobs[] = action.payload.jobs.filter((e) => (e.status === JobStatus.pendingUpload || e.status === JobStatus.uploadFailed));
            let pendingProcessJobs: IJobs[] = action.payload.jobs.filter((e) => e.status === JobStatus.uploaded);
            let isUploadStep = pendingUploadJobs.length > 0 || pendingProcessJobs.length>0

            return {
                ...state,
                pendingUploadJobs: pendingUploadJobs,
                pendingProcessJobs: pendingProcessJobs,
                selectedJob: undefined,
                rawImagesMap: {},
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
        case UploaderActionType.setCurrentUploadFiles:
            return {
                ...state,
                currentUploadFiles: action.payload.uploadFiles
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
        case UploaderActionType.removeWorker:
            if( state.inProgressWorkers) {
                let {[action.payload.captureId]: _, ...workersMap} = state.inProgressWorkers
                return {
                    ...state,
                    inProgressWorkers: workersMap
                }
            }
            return state
        case UploaderActionType.setErrorCount:
            return{
                ...state,
                errorCount:action.payload.errorCount
            } 
        case UploaderActionType.setResetUploaderState:
            return resetUploaderState();
        case UploaderActionType.deleteJob:
            return {
                ...state,
                selectedJob: action.payload.job,
                isDelete: true
            }
        case UploaderActionType.setIsShowPopup:
            let popupVisibility = action.payload.popupVisibility
            if (popupVisibility.isShowPopup) {
                let popup = getCurrentPopup(state, popupVisibility.popupType, popupVisibility.message);
                return {
                    ...state,
                    isShowPopup: popupVisibility.isShowPopup,
                    currentPopup: popup
                }
            } else {
                return {
                    ...state,
                    isShowPopup: popupVisibility.isShowPopup,
                    isDelete: false,
                    currentPopup: undefined
                }
            }
        default:
            return state
    }
}

const getCurrentPopup = (state: UploaderState, popupType: UploaderPopups, message?: string): PopupData => {
    switch (popupType) {
        case UploaderPopups.completedWithError:
            return {
                type: popupType,
                modalTitle: 'Oops, We Hit a Snag',
                modalMessage: message ? message : "Some files failed to upload",
                primaryButtonLabel: 'Skip and Process',
                secondaryButtonlabel: 'Discard',
            }
        case UploaderPopups.deleteJob:
            return {
                type: popupType,
                modalTitle: 'Confirm Discard',
                modalMessage: `Are you sure you want to discard ? 
                This action is irreversible, and all data will be lost.`,
                primaryButtonLabel: 'Yes',
                secondaryButtonlabel: 'Cancel',
            }
    }
}

const validateGCPList = (list: IGCP): {error: number, length: number} => {
    if(list.location && list.location.length > 0 ) {
        return {
            error: list.location.reduce((errorCount, latLng): number => {
                return errorCount += getLongLatValidationErrorCount(latLng) // && validateLongitude(latLng.coordinates[0]) && validateLatitude(latLng.coordinates[1]) && latLng.elevation? validateAltitudeOrElevation(latLng.elevation) : false
            }, 0), 
            length: list.location.length
        }
    } else if (list.utmLocation && list.utmLocation.length > 0) {
        return {
            error: list.utmLocation.reduce((errorCount, utm): number => {
                return errorCount += getUTMValidationErrorCount(utm) // && validateEasting(utm.easting) && validatingNorthing(utm.northing) && validateUTMZone(utm.zone) && utm.elevation? validateAltitudeOrElevation(utm.elevation) : false
            }, 0),
            length: list.utmLocation.length
        }
    }
    return {
        error: 0,
        length: 0
    };
}

const getUTMValidationErrorCount = (utm: utmLocation): number => {
    let errorCount = validateEasting(utm.easting) ? 0 : 1;
    errorCount += validatingNorthing(utm.northing) ? 0 : 1;
    errorCount += validateUTMZone(utm.zone) ? 0 : 1;
    errorCount += utm.elevation ? validateAltitudeOrElevation(utm.elevation) ?  0 : 1 : 1;
    return errorCount
}

const getLongLatValidationErrorCount = (latLng: location): number => {
    let errorCount = validateLongitude(latLng.coordinates[0]) ? 0 : 1;
    errorCount += validateLatitude(latLng.coordinates[1]) ? 0 : 1;
    errorCount += latLng.elevation ? validateAltitudeOrElevation(latLng.elevation) ?  0 : 1 : 1;
    return errorCount
}

const isNext = (state: UploaderState, step: UploaderStep): boolean => {
    switch (step) {
        case UploaderStep.Details:
            return state.date ? state.structure ? true : false : false
        case UploaderStep.ChooseFiles:
            return state.choosenFiles.validFiles.length > 0;
        case UploaderStep.ChooseGCPs:
            let {error, length} = validateGCPList(state.gcpList);
            return error === 0 && length >= 4
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
        if (fileWithExif.exifData) {
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




