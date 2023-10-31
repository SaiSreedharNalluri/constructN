import { ChildrenEntity, IStructure } from "../../models/IStructure";

export interface UploaderState {
    step: number;
    date?: Date | null;
    stepNames: string[];
    showMessage: boolean;
    structureList: IStructure[] | null;
    sectionDetails: ChildrenEntity[];
    
}

export enum UploaderStep {
    Details = 0,
    ChooseFiles,
    ChooseGCPs,
    Review,
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
    sectionDetails:[],
    
};