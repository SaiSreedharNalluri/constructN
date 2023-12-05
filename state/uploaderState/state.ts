import { CaptureMode, CaptureType } from "../../models/ICapture";
import { GCPType, IGCP, LONGLATType, UTMType } from "../../models/IGCP";
import { IJobs } from "../../models/IJobs";
import { IProjects } from "../../models/IProjects";
import { RawImage } from "../../models/IRawImages";
import { ChildrenEntity, IStructure } from "../../models/IStructure";
import { IUploadFile } from "../../models/IUploader";
import { getInitialGCPList } from "../../utils/utils";

export type uploadImage = { file: File } & RawImage
export type fileWithExif = { file: File } & { exifData: ExifReader.Tags }

export enum UploaderFinishState {
    withError,
    withoutError
}

export interface choosenFileObject {
    validFiles: uploadImage[]
    invalidEXIFFiles: File[]
    duplicateFiles: uploadImage[]
}

export interface captureRawImageMap {
    [key:string]: RawImage[],
}

export interface workerFileMap {
    [key:string]: IUploadFile<RawImage>[],
}


export interface UploaderState {
    step: number;
    date?: Date | null;
    stepNames: string[];
    showMessage: boolean;
    isLoading: boolean,
    project?: IProjects;
    structure?:IStructure;
    updateJobs: boolean;
    extractedFileValue:any;
    isNextEnabled:boolean;
    isAppendingCapture: boolean,
    captureMode: CaptureMode,
    captureType: CaptureType,
    choosenFiles: choosenFileObject,
    filesDropped: boolean,
    skipGCP: boolean,
    gcpType: UTMType | LONGLATType, 
    gcpList: IGCP,
    isGCPInit: boolean,
    uploadinitiate:boolean,
    pendingUploadJobs: IJobs[],
    pendingProcessJobs: IJobs[],
    processCompleteJobs: IJobs[],
    rawImagesMap: captureRawImageMap,
    isReading:boolean,
    selectedJob?: IJobs,
    inProgressWorkers?: workerFileMap,
    completionState?: UploaderFinishState,
    errorCount:number;
}

export enum UploaderStep {
    Details = 0,
    ChooseFiles,
    ChooseGCPs,
    Review,
    Upload
}

export enum UploaderButtonValues{
    GoBack,
    Continue,
    ConfirmImages,
    SkipGCPs,
    ConfrimGCPs,
    Upload
}

export const initialUploaderState: UploaderState = {
    step: UploaderStep.Upload,
    stepNames: [
        "Details",
        "Choose Files",
        "Choose GCPs",
        "Review",
        "Upload",
    ],
    showMessage: true,
    isLoading: false,
    extractedFileValue:[],
    updateJobs: false,
    isNextEnabled: false,
    isAppendingCapture: false,
    choosenFiles: {
        validFiles: [],
        invalidEXIFFiles: [],
        duplicateFiles: []
    },
    filesDropped: false,
    gcpType: GCPType.LONGLAT,
    gcpList: getInitialGCPList(false), // default is LONGLAT
    isGCPInit: true,
    skipGCP: false,
    captureType: CaptureType.exterior,
    captureMode: CaptureMode.droneImage,
    uploadinitiate:false,
    pendingProcessJobs: [],
    pendingUploadJobs: [],
    processCompleteJobs: [],
    rawImagesMap: {},
    isReading:false,
    errorCount:0,
};

