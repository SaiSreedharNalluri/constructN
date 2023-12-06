import { IGCP, LONGLATType, UTMType } from "../../models/IGCP";
import { IJobs } from "../../models/IJobs";
import { IProjectUserList, IProjects } from "../../models/IProjects";
import { RawImage } from "../../models/IRawImages";
import { ChildrenEntity, IStructure } from "../../models/IStructure";
import { IUploadFile } from "../../models/IUploader";
import { UploaderFinishState, captureRawImageMap, fileWithExif } from "./state";

export enum UploaderActionType {
    startNewUpload,
    GoBack,
    Next,
    Upload,
    UpdateDate,
    setIsLoading,
    setshowMessage,
    setIsAppendingCapture,
    setProject,
    setStructure,
    appendFiles,
    skipGCP,
    setGCPType,
    setGCPList,
    setExtractedFileValue,
    setIsNextEnabled,
    changeUploadinitiate,
    setCaptureJobs,
    setRawImagesMap,
    appendToRawImagesMap,
    chageIsReading,
    setSelectedJob,
    setCurrentUploadFiles,
    updateWorkerStatus,
    removeWorker,
    refreshJobs,
    setErrorCount,
    setResetUploaderState,
    setUploadCompletionState
}

export interface refreshJobs {
    type: UploaderActionType.refreshJobs;
}

export interface startNewUpload {
    type: UploaderActionType.startNewUpload;
}

export interface goBack {
  type: UploaderActionType.GoBack;
}

export interface next {
  type: UploaderActionType.Next;
}

export interface upload {
  type: UploaderActionType.Upload;
}

export interface setUploadCompletionState {
    type: UploaderActionType.setUploadCompletionState,
    payload:{ status: UploaderFinishState}
}

export interface setIsAppendingCapture {
    type: UploaderActionType.setIsAppendingCapture,
    payload:{ isAppendingCapture: boolean}
}

export interface skipGCP {
    type: UploaderActionType.skipGCP;
  }

export interface UpdateDate {
    type: UploaderActionType.UpdateDate,
    payload:{ date: Date |null}
}

export interface setIsLoading {
    type: UploaderActionType.setIsLoading;
    payload: { isLoading: boolean };
}

export interface setshowMessage {
  type: UploaderActionType.setshowMessage;
  payload: { showMessage: boolean };
}

export interface setProject {
    type: UploaderActionType.setProject
    payload:{project:IProjects}
}

export interface setStructure {
  type: UploaderActionType.setStructure
  payload:{structure:IStructure}
}

export interface setExtractedFileValue {
  type: UploaderActionType.setExtractedFileValue
  payload:{extractedFileValue:any}
}

export interface setIsNextEnabled{
  type:UploaderActionType.setIsNextEnabled
  payload:{IsNextEnabled:boolean};
}

export interface appendFiles {
  type: UploaderActionType.appendFiles;
  payload: { files: fileWithExif[] };
}

export interface changeUploadinitiate {
  type: UploaderActionType.changeUploadinitiate
  payload:{ uploadinitiate: boolean }
}

export interface setGCPType{
    type:UploaderActionType.setGCPType;
    payload:{type: UTMType | LONGLATType};
}

export interface setGCPList{
  type:UploaderActionType.setGCPList;
  payload:{list: IGCP, type: UTMType | LONGLATType};
}

export interface setCaptureJobs {
    type: UploaderActionType.setCaptureJobs
    payload: {jobs: IJobs[]}
}

export interface setRawImagesMap {
    type: UploaderActionType.setRawImagesMap
    payload: {rawImages: captureRawImageMap}
}

export interface appendToRawImagesMap {
    type: UploaderActionType.appendToRawImagesMap
    payload: {rawImages: captureRawImageMap}
}

export interface chageIsReading {
  type: UploaderActionType.chageIsReading
  payload:{ isReading: boolean }
}

export interface setSelectedJob {
    type: UploaderActionType.setSelectedJob
    payload: {job: IJobs | undefined}
}

export interface setCurrentUploadFiles {
    type: UploaderActionType.setCurrentUploadFiles
    payload: {uploadFiles: IUploadFile<RawImage>[] | undefined}
}

export interface updateWorkerStatus {
    type: UploaderActionType.updateWorkerStatus
    payload: {workerFileList: IUploadFile<RawImage>[]}
}

export interface removeWoker {
    type: UploaderActionType.removeWorker
    payload: {captureId: string}
}

export interface setErrorCount{
  type:UploaderActionType.setErrorCount,
  payload:{errorCount:number}
}

export interface setResetUploaderState{
  type: UploaderActionType.setResetUploaderState
 
}

export const uploaderContextActions = (dispatch: React.Dispatch<UploaderActions>) => {
    return {
      uploaderAction: {
        startNewUpload: () => {
            dispatch({ type: UploaderActionType.startNewUpload });
          },
        goBack: () => {
          dispatch({ type: UploaderActionType.GoBack });
        },
        refreshJobs: () => {
            dispatch({ type: UploaderActionType.refreshJobs });
          },
        next: () => {
          dispatch({ type: UploaderActionType.Next });
        },
        upload: () => {
          dispatch({ type: UploaderActionType.Upload });
        },
        setIsAppendingCapture: (isAppendingCapture:boolean) => {
            dispatch({ type: UploaderActionType.setIsAppendingCapture, payload:{isAppendingCapture: isAppendingCapture}});
        },
        skipGCP: () => {
            dispatch({ type: UploaderActionType.skipGCP });
        },
        updateDate: (date: Date|null) => {
          dispatch({ type: UploaderActionType.UpdateDate,  payload: {date: date}});
        },
        setIsLoading: (isLoading:boolean) => {
            dispatch({ type: UploaderActionType.setIsLoading, payload:{isLoading: isLoading}});
        },
        setshowMessage: (showMessage:boolean) => {
          dispatch({ type: UploaderActionType.setshowMessage, payload:{showMessage: showMessage}});
        },
        setProject: (project: IProjects) => {
            dispatch({
              type: UploaderActionType.setProject,
              payload: { project: project },
            });
        },
        setStructure: (structure:IStructure) => {
          dispatch({ type: UploaderActionType.setStructure, payload:{structure: structure}});
        },
        appendFiles: (files: fileWithExif[]) => {
          dispatch({
              type: UploaderActionType.appendFiles,
              payload: {files: files}
          })
        },
        setExtractedFileValue: (extractedFileValue:any) => {
          dispatch({ type: UploaderActionType.setExtractedFileValue, payload:{extractedFileValue:extractedFileValue}});
        },
        setIsNextEnabled:(IsNextEnabled:boolean)=>{
          dispatch({type: UploaderActionType.setIsNextEnabled,payload:{IsNextEnabled:IsNextEnabled}})
        },
        changeUploadinitiate:(uploadinitiate:boolean)=>{
          dispatch({type:UploaderActionType.changeUploadinitiate,payload:{uploadinitiate:uploadinitiate}});
        },
        setGCPList:(list:IGCP, type: UTMType | LONGLATType)=>{
          dispatch({type:UploaderActionType.setGCPList, payload:{list:list, type: type}})
        },
        setGCPType:(type: UTMType | LONGLATType)=>{
            dispatch({type:UploaderActionType.setGCPType, payload:{ type: type}})
        },
        setCaptureJobs:(jobs: IJobs[])=>{
            dispatch({type:UploaderActionType.setCaptureJobs, payload:{ jobs: jobs}})
        },
        setRawImagesMap:(rawImages: captureRawImageMap)=>{
            dispatch({type:UploaderActionType.setRawImagesMap, payload:{ rawImages: rawImages}})
        },
        chageIsReading:(isReading:boolean)=>{
          dispatch({type:UploaderActionType.chageIsReading,payload:{isReading:isReading}});
        },
        setSelectedJob:(job: IJobs | undefined)=>{
            dispatch({type:UploaderActionType.setSelectedJob, payload:{ job: job}})
        },
        setCurrentUploadFiles:(uploadFiles: IUploadFile<RawImage>[] | undefined)=>{
            dispatch({type:UploaderActionType.setCurrentUploadFiles, payload:{ uploadFiles: uploadFiles}})
        },
        updateWorkerStatus:(workerFileList: IUploadFile<RawImage>[]) => {
            dispatch({type:UploaderActionType.updateWorkerStatus, payload:{ workerFileList: workerFileList}})
        },
        removeWorker:(captureId: string) => {
            dispatch({type:UploaderActionType.removeWorker, payload:{ captureId: captureId}})
        },
        setErrorCount:(errorCount:number)=>{
          dispatch({type:UploaderActionType.setErrorCount,payload:{errorCount:errorCount}})
        },
        setResetUploaderState:()=>{
          dispatch({type:UploaderActionType.setResetUploaderState})
        },
        setUploadCompletionState:(status: UploaderFinishState)=>{
            dispatch({type:UploaderActionType.setUploadCompletionState, payload: {status: status}})
          },

      }
    }
}

export type UploaderActions =
  | startNewUpload
  | goBack
  | next
  | upload
  | UpdateDate
  | setIsLoading
  | setshowMessage
  | setIsAppendingCapture
  | setProject
  | setStructure
  | appendFiles
  | setExtractedFileValue
  | setIsNextEnabled
  | skipGCP
  | changeUploadinitiate
  | setGCPList
  | setGCPType
  | setCaptureJobs
  | setRawImagesMap
  | chageIsReading
  | setSelectedJob
  | setCurrentUploadFiles
  | updateWorkerStatus
  | removeWoker
  | refreshJobs
  | setErrorCount
  | setResetUploaderState
  | setUploadCompletionState
