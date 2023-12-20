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
    // ConfigureProject,
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
        // utm: "",
        description: "", 
        company: "", 
        location: [{
            type: "point",
            coordinates: [0,0], 
            elevation: 0,
        }],
        jobsOpened: 0, 
        measurement:"US",
        address: {
          zipcode: "",
          city: "",
          state: "",
          country: "",
        },
        metaDetails:{
            projectIntend:"",
        },
        //  latitude:0,
        // longitude:0,
        projectNickName:"",
        projectID:0
    },
    step: OnBoardingStep.ProjectDetails ,
    stepNames:[
        "Project Details",
        "Project Hierachy",
        "BIM",
        "Sheets",
        "Add Users",
        // "Configure Project",
        "Review",
    ],
    isNextEnabled:false,
    bimFiles:[],
    isBimNotAvailable:false,
}