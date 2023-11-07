import { IGCP } from "../../models/IGCP";
import { RawImage } from "../../models/IRawImages";
import { ChildrenEntity, IStructure } from "../../models/IStructure";

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
    structureList: IStructure[] | null;
    sectionDetails:IStructure;
    extractedFileValue:any;
    isNextEnabled:boolean;
    choosenFiles: choosenFileObject;
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
    structureList: [],
    sectionDetails: {} as IStructure,
    extractedFileValue:[],
    isNextEnabled: true,
    choosenFiles: {
        validFiles: [],
        invalidEXIFFiles: [],
        duplicateFiles: []
    },
    
};

