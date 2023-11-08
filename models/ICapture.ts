export interface ICapture{
    success:boolean;
    result?:ICaptureDetails[]|null;
};
export interface ICaptureDetails{
    _id:string;
    user:string;
    type:string;  //interior , exterior
    updatedAt:string;
    structure:string;
    project:string;
    mode:string; //phone Image, 360 video, 360 image, drone image
    mediaPath:string;
    jobId:string;
    isMediaUploaded:boolean;
    createdAt:string;
    captureDateTime:string
}