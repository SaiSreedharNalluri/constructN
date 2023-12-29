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