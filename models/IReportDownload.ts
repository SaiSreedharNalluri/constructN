import { ISnapshot } from "./ISnapshot";
import { IStructure } from "./IStructure";
import { IContext } from "./ITools";

export interface IReportData {
    screenshot: string;
    miniMapscreenshot: string;
    type: string;
    context: string;
    structure?: IStructure;
    snapshot?: ISnapshot;
    project?: string;
    logedInUser:string
  }