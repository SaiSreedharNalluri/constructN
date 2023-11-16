import { GCPType, IGCP, LONGLATType, UTMType } from "../../models/IGCP";
import { IJobs } from "../../models/IJobs";
import { IProjects } from "../../models/IProjects";
import { RawImage } from "../../models/IRawImages";
import { ChildrenEntity, IStructure } from "../../models/IStructure";
import { getInitialGCPList } from "../../utils/utils";

export type uploadImage = { file: File } & RawImage
export type fileWithExif = { file: File } & { exifData: ExifReader.Tags }

export interface choosenFileObject {
    validFiles: uploadImage[]
    invalidEXIFFiles: File[]
    duplicateFiles: uploadImage[]
}

export interface captureRawImageMap {
    [key:string]: RawImage[],
}

export interface UploaderState {
    step: number;
    date?: Date | null;
    stepNames: string[];
    showMessage: boolean;
    project?: IProjects;
    structure?:IStructure;
    extractedFileValue:any;
    isNextEnabled:boolean;
    stepperSideFileList:boolean,
    choosenFiles: choosenFileObject,
    skipGCP: boolean,
    gcpType: UTMType | LONGLATType, 
    gcpList: IGCP,
    uploadinitiate:boolean,
    pendingUploadJobs: IJobs[],
    pendingProcessJobs: IJobs[],
    processCompleteJobs: IJobs[],
    rawImagesMap: captureRawImageMap,
    isReading:boolean,
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
    extractedFileValue:[],
    stepperSideFileList:true,
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
    pendingProcessJobs: [],
    pendingUploadJobs: [],
    processCompleteJobs: [],
    rawImagesMap: {},
    isReading:false
};

