import { IStructure } from "../../models/IStructure";

export interface UploaderState {
    step: number
    structure?: IStructure
    date?: Date
    stepNames: string[]
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
      ]
}