import { RawImage } from "./IRawImages"

export interface IUploadFile<Type> {
    file: File,
    destination: string,
    uploadObject: Type,
    progress: UploadProgress,
    status: UploadStatus
    error?: string
}

export enum UploadStatus {
    inProgress,
    success,
    failed
}

export interface UploadProgress {
    value: number
}

export type UploadType = RawImage

export enum UploaderModalTitle{
    UploadCompleteWithErrors = 'Oops, We Hit a Snag',
    uploadDeleteJob='Confirm Discard',
    warning='Warning',
    uploadFileLimit='File Limit Exceeded'
}
export enum UploaderModalPrimaryButton{
    UploadCompleteWithErrorsPButton='Skip and Process',
    uploadDeleteJobPButton = 'Yes',
    skipFilesAndContinue= 'Skip Files and Continue',
    ok='OK'
}
export enum UploaderModalSecondaryButton{
    UploadCompleteWithErrorsSButton = 'Discard',
    uploadDeleteJobSButton = 'Cancel' 
}
export enum UploaderModalMessage{
    UploadCompleteWithErrorsModalMessage = '',
    uploadDeleteJob=`Are you sure you want to discard ? 
    This action is irreversible, and all data will be lost.`

}