import { RawImage, location } from "../../models/IRawImages";
import { UploaderActionType, UploaderActions } from "./action";
import { UploaderStep, UploaderState, choosenFileObject, uploadImage, fileWithExif } from "./state";

export const uploaderReducer = (state: UploaderState, action: UploaderActions): UploaderState => {
    switch (action.type) {
        case UploaderActionType.GoBack: 
            return {
                ...state,
                step: state.step--
            }
        case UploaderActionType.Next: 
            return {
                ...state,
                step: state.step++
            }
        case UploaderActionType.UpdateDate:
            return {
                ...state,
                date: action.payload.date
            }
        case UploaderActionType.setshowMessage:
            return{
                ...state,
                showMessage:action.payload.showMessage
            }
        case UploaderActionType.setStructureList:
            return{
                ...state,
                structureList:action.payload.structureList
            }
        case UploaderActionType.setSectionDetails:
            return{
                ...state,
                sectionDetails:action.payload.sectionDetails
            }
            case UploaderActionType.setStepperSideFilesList:
            return{
                ...state,
                stepperSideFileList:action.payload.stepperSideFileList
            }
        case UploaderActionType.appendFiles:
            // console.log("ChooseFiles appendFilesReducer: ", action.payload.files)
            let updatedList =  getUpdatedFileList(state, action.payload.files);
            // console.log("ChooseFiles appendFilesReducer after exifReader: ", updatedList)
            return {
                ...state,
                choosenFiles: updatedList
            }
        default:
            return state
    }
}

const getUpdatedFileList = (state: UploaderState, files: fileWithExif[]): choosenFileObject => {
    // console.log("ChooseFiles ExistingFiles: ", state.choosenFiles)
    // console.log("ChooseFiles NewFileToAppend: ", files)

    let choosenFiles = state.choosenFiles;
    let invalidEXIFFiles: File[] = [];
    let duplicateEXIFFiles: uploadImage[] = [];
    let validEXIFFiles: uploadImage[] = []
    files.forEach((fileWithExif) => {
        // console.log("ChooseFiles exifData: ", fileWithExif)
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




