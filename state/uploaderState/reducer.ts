import { RawImage, location } from "../../models/IRawImages";
import { UploaderActionType, UploaderActions } from "./action";
import { UploaderStep, UploaderState, choosenFileObject, uploadImage, fileWithExif } from "./state";

export const uploaderReducer = (state: UploaderState, action: UploaderActions): UploaderState => {
    switch (action.type) {
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
                choosenFiles: updatedList,
                isNextEnabled: updatedList.validFiles.length > 1
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
        default:
            return state
    }
}

const getUpdatedFileList = (state: UploaderState, files: fileWithExif[]): choosenFileObject => {
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
                
                rawImage.longLatCoordinates = [longitude, latitude,altitude]
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




