import { IGCP } from "../../models/IGCP";
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
    choosenFiles: choosenFileObject;
    skipGCP: boolean
    gcpList?: IGCP;
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
    step: UploaderStep.Details,
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
    skipGCP: false,
};

