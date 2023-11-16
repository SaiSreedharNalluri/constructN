import { GCPType } from "../../models/IGCP";
import { IJobs, JobStatus } from "../../models/IJobs";
import { RawImage, location } from "../../models/IRawImages";
import { getInitialGCPList } from "../../utils/utils";
import { UploaderActionType, UploaderActions } from "./action";
import { UploaderStep, UploaderState, choosenFileObject, uploadImage, fileWithExif } from "./state";

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
                uploadinitiate:false,
            }
        case UploaderActionType.GoBack: 
            return {
                ...state,
                step: state.step--,
                skipGCP: false,
                isNextEnabled: true
            }
        case UploaderActionType.Next: 
            return {
                ...state,
                step: state.step++,
                isNextEnabled: false,
            }
        case UploaderActionType.skipGCP: 
            return {
                ...state,
                step: state.step++,
                skipGCP: true,
                isNextEnabled: false,
            }
        case UploaderActionType.UpdateDate:
            return {
                ...state,
                date: action.payload.date
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
            if(location){
                isNextEnabled = location.length >=4 
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
                step: isUploadStep ? UploaderStep.Upload : UploaderStep.Details
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
        default:
            return state
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
                status: "Initiated",
            }
            if(latitude && longitude && altitude) {
                
                let location: location = {
                    type: "point",
                    coordinates: [longitude, latitude],
                    elevation: altitude
                }
                rawImage.location = location
            }
            let newUploadImage: uploadImage = {file, ...rawImage}
            let duplicateFile = choosenFiles.validFiles.find((uploadImages) => {
                return uploadImages.deviceId == deviceId && uploadImages.dateTime == dateTimeOriginal
            })
            if (duplicateFile) {
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




