import { GCPType, IGCP } from "../../models/IGCP";
import { IJobs, JobStatus } from "../../models/IJobs";
import { RawImage, RawImageStatus, location, metaData, utmLocation } from "../../models/IRawImages";
import { getCaptureIdFromModelOrString, getInitialGCPList, validateAltitudeOrElevation, validateEasting, validateLatitude, validateLongitude, validateUTMZone, validatingNorthing } from "../../utils/utils";
import { UploaderActionType, UploaderActions } from "./action";
import { UploaderStep, UploaderState, choosenFileObject, uploadImage, fileWithExif, initialUploaderState, UploaderPopups,UploadRange } from "./state";
import { PopupData } from "../../models/Poppup";

export const resetUploaderState = (): UploaderState => {
    return {
      ...initialUploaderState,
    };
  };
export const uploaderReducer = (state: UploaderState, action: UploaderActions): UploaderState => {
    switch (action.type) {
        case UploaderActionType.startNewUpload: 
            let {error: errorCount, duplicate: initDuplicate} = validateGCPList(getInitialGCPList(false))
            return {
                ...state,
                // step:state.step === UploaderStep.Upload  ? UploaderStep.Details : UploaderStep.Upload,
                step: UploaderStep.Details,
                structure: undefined,
                date: undefined,
                isNextEnabled: false,
                choosenFiles: {
                    validFiles: [],
                    invalidEXIFFiles: [],
                    duplicateFiles: [],
                    currentInvalidEXIFFiles: [],
                    currentDuplicateFiles: [],
                },
                filesDropped: false,
                gcpType: GCPType.LONGLAT,
                gcpList: getInitialGCPList(false), // default is LONGLAT
                errorCount: errorCount,
                duplicateInGCP: initDuplicate,
                isGCPInit: true,
                skipGCP: false,
                selectedJob: undefined,
                isAppendingCapture: false,
                currentUploadFiles: [],
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
            let nextStep = state.step + 1
            return {
                ...state,
                step: nextStep,
                isNextEnabled: isNext(state, nextStep),
            }
        case UploaderActionType.Discard:
            return {
                ...state,
                step: UploaderStep.Upload,
                updateJobs: true
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
                isNextEnabled: updatedList.validFiles.length >= UploadRange.Minimum
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
            let {error: newError, duplicate: newDuplicate, length: newLength} = validateGCPList(newGCPList)
            return {
                ...state,
                gcpType: action.payload.type,
                gcpList: newGCPList,
                errorCount: newError,
                duplicateInGCP: newDuplicate,
                isNextEnabled: newError === 0 && newLength >= 4  && (newDuplicate.reduce((prev, cur):boolean => {
                    return prev || cur
                }, false) !== true)
            }
        case UploaderActionType.setGCPList:
            let gcpList: IGCP = { 
                ...action.payload.list,
                base64ImageName: state.gcpList.base64ImageName,
                base64Code: state.gcpList.base64Code,
                description: state.gcpList.description
            }
            let {error, duplicate, length} = validateGCPList(gcpList)
            return{
                ...state,
                isGCPInit: false,
                gcpList: gcpList,
                gcpType: action.payload.type,
                errorCount: error,
                duplicateInGCP: duplicate,
                isNextEnabled: error === 0 && length >= 4  && (duplicate.reduce((prev, cur):boolean => {
                    return prev || cur
                }, false) !== true)
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
        case UploaderActionType.updateJobStatus:
            let jobToUpdate = action.payload.job
            if (jobToUpdate.project == state.project?._id && state.step == UploaderStep.Upload) {
                let captureJobs = state.pendingProcessJobs.concat(state.pendingUploadJobs)
                captureJobs.forEach((job) => {
                  if (job._id === jobToUpdate._id) {
                    job.status = jobToUpdate.status
                  }
                })
                let pendingUploadJobs: IJobs[] = captureJobs.filter((e) => (e.status === JobStatus.pendingUpload || e.status === JobStatus.uploadFailed));
                let pendingProcessJobs: IJobs[] = captureJobs.filter((e) => e.status === JobStatus.uploaded);
                return {
                    ...state,
                    pendingUploadJobs: pendingUploadJobs,
                    pendingProcessJobs: pendingProcessJobs,
                    selectedJob: jobToUpdate.status == JobStatus.uploadFailed ? jobToUpdate : undefined
                }
            }
            return state
        case UploaderActionType.removeWorker:
            if( state.inProgressWorkers) {
                let {[action.payload.captureId]: _, ...workersMap} = state.inProgressWorkers
                return {
                    ...state,
                    inProgressWorkers: workersMap
                }
            }
            return state
        // case UploaderActionType.setErrorCount:
        //     return{
        //         ...state,
        //         errorCount:action.payload.errorCount
        //     } 
        case UploaderActionType.setResetUploaderState:
            return {
                ...state,
                ...resetUploaderState()
            }
        case UploaderActionType.deleteJob:
            return {
                ...state,
                selectedJob: action.payload.job,
                isDelete: true
            }
        case UploaderActionType.retryJobUploading:
            let selectedCaptureId = getCaptureIdFromModelOrString(action.payload.job.captures[0])
            action.payload.job.status = JobStatus.pendingUpload
                return {
                    ...state,
                    selectedJob: action.payload.job,
                    retryUploadFiles: state.inProgressWorkers && state.inProgressWorkers[selectedCaptureId]
                }
        case UploaderActionType.setShowRetry:
                return {
                  ...state,
                    showRetry:action.payload.showRetry
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
    let selectedCaptureId: string | undefined;    
if (state.selectedJob && state.selectedJob.captures && state.selectedJob.captures.length > 0) {
    selectedCaptureId = getCaptureIdFromModelOrString(state.selectedJob.captures[0]);
}
let retryAction = '';
if (typeof selectedCaptureId !== 'undefined' && state.inProgressWorkers && typeof state.inProgressWorkers[selectedCaptureId] !== 'undefined') {
    retryAction = "Retry";
}
    switch (popupType) {
        case UploaderPopups.completedWithError:
            return {
                type: popupType,
                modalTitle: 'Oops, We Hit a Snag',
                modalMessage: message ? message : "Some files failed to upload",
                primaryButtonLabel: 'Skip and Process',
                secondaryButtonlabel: 'Discard',
                thirdButtonLabel:retryAction
            }
        case UploaderPopups.deleteJob:
            return {
                type: popupType,
                modalTitle: 'Confirm Delete',
                modalMessage: `Are you sure you want to Delete ? 
                This action is irreversible, and all data will be lost.`,
                primaryButtonLabel: 'Yes',
                secondaryButtonlabel: 'Cancel',
            }
        case UploaderPopups.discard:
            return {
                type: popupType,
                modalTitle: 'Confirm Discard',
                modalMessage: `All your progress will be lost and cannot be recovered. Are you sure you want to discard?`,
                primaryButtonLabel: 'Yes',
                secondaryButtonlabel: 'No',
            }
    }
}

const validateGCPList = (list: IGCP): {error: number, duplicate: boolean[], length: number} => {
    if(list.location && list.location.length > 0 ) {
        return {
            ...list.location.reduce((errorCount, latLng, index, array):{error: number, duplicate: boolean[]} => {
                let errors = getLongLatValidationErrorCount(latLng)
                errorCount.duplicate[index] = errors == 0 ? checkDuplicateLongLat(index, array) : false
                return {error: errorCount.error += errors , duplicate: errorCount.duplicate}
            }, {error: 0, duplicate: Array<boolean>(list.location.length).fill(false)}), 
            length: list.location.length
        }
    } else if (list.utmLocation && list.utmLocation.length > 0) {
        return {
            ...list.utmLocation.reduce((errorCount, utm, index, array): {error: number, duplicate: boolean[]} => {
                let errors = getUTMValidationErrorCount(utm)
                errorCount.duplicate[index] = errors == 0 ? checkDuplicateUTM(index, array) : false
                return {error: errorCount.error += errors , duplicate: errorCount.duplicate}
            }, {error: 0, duplicate: Array<boolean>(list.utmLocation.length).fill(false)}),
            length: list.utmLocation.length
        }
    }
    return {
        error: 0,
        duplicate: [],
        length: 0
    };
}

const getUTMValidationErrorCount = (utm: utmLocation): number => {
    let errorCount = validateEasting(utm.easting) ? 0 : 1;
    errorCount += validatingNorthing(utm.northing) ? 0 : 1;
    errorCount += utm.zone !== undefined && validateUTMZone(utm.zone) ? 0 : 1;
    errorCount += utm.elevation !== undefined ? validateAltitudeOrElevation(utm.elevation) ?  0 : 1 : 1;
    return errorCount
}

const getLongLatValidationErrorCount = (latLng: location): number => {
    let errorCount = validateLongitude(latLng.coordinates[0]) ? 0 : 1;
    errorCount += validateLatitude(latLng.coordinates[1]) ? 0 : 1;
    errorCount += latLng.elevation !== undefined ? validateAltitudeOrElevation(latLng.elevation) ?  0 : 1 : 1;
    return errorCount
}

const checkDuplicateUTM = (index: number, array: utmLocation[]): boolean => {
    for (let i = 0; i < index; i++) {
        if ((array[i].easting === array[index].easting) &&
        (array[i].northing === array[index].northing) && 
        (array[i].zone === array[index].zone) &&
        (array[i].elevation === array[index].elevation)) {
            return true
        }
    }
    return false
}

const checkDuplicateLongLat = (index: number, array: location[]): boolean => {
    for (let i = 0; i < index; i++) {
        if ((array[i].coordinates[0] === array[index].coordinates[0]) &&
        (array[i].coordinates[1] === array[index].coordinates[1]) && 
        (array[i].elevation === array[index].elevation)) {
            return true
        }
    }
    return false
}

const isNext = (state: UploaderState, step: UploaderStep): boolean => {
    switch (step) {
        case UploaderStep.Details:
            return state.date ? state.structure ? true : false : false
        case UploaderStep.ChooseFiles:
            return state.choosenFiles.validFiles.length >= UploadRange.Minimum;
        case UploaderStep.ChooseGCPs:
            let {error, duplicate, length} = validateGCPList(state.gcpList);
            return error === 0 && length >= 4 && (duplicate.reduce((prev, cur):boolean => {
                return prev || cur
            }, false) !== true)
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
        duplicateFiles: duplicateEXIFFiles.concat(...choosenFiles.duplicateFiles),
        currentDuplicateFiles:duplicateEXIFFiles,
        currentInvalidEXIFFiles:invalidEXIFFiles,
    }
}




