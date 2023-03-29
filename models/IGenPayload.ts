import { IGenNotifyAppAction, IGenNotifyViewerAction } from "./IGenAction";
import { IGenData } from "./IGenData";

export interface IGenPayload{
    action:IGenNotifyViewerAction | IGenNotifyAppAction,
    data: IGenData
}