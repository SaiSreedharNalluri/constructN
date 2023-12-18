import { IProjects } from "../../models/IProjects";
import { IUser} from "../../models/IUser";


export type uploadBIMFile ={file:File|null}
export interface OnBoardingProjectState{
    adminDetails:IUser,
    step:number;
    stepNames:string[];
    isNextEnabled:boolean;
    newProjectDetails:IProjects;
    bimFiles:uploadBIMFile[]|null;
    isBimNotAvailable:boolean;
}

export enum OnBoardingStep {
    ProjectDetails =0,
    ProjectHierachy,
    BIM,
    Sheets,
    AddUsers,
    ConfigureProject,
    Review,
}

export const initialOnBoardingProjectState: OnBoardingProjectState={
    adminDetails:{
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        isSupportUser: false,
        verified: false,
        createdAt: "",
        updatedAt: "",
        __v: 0,
        fullName: "",
        age: 0,
        token: "",
        avatar: "",
      
    },
    newProjectDetails:{
        _id: "",
        type: "",
        name: "",
        email: "",
        createdAt: "",
        updatedAt: "",
        coverPhoto: "",
        utm: ""
    },
    step: OnBoardingStep.ProjectDetails ,
    stepNames:[
        "Project Details",
        "Project Hierachy",
        "BIM",
        "Sheets",
        "Add Users",
        "Configure Project",
        "Review",
    ],
    isNextEnabled:false,
    bimFiles:[],
    isBimNotAvailable:false,
}