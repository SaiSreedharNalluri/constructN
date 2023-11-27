import { Router, useRouter } from "next/router";
import React from "react";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { useAppContext } from "../../../state/appState/context";
import { TruncatedString,getPathToRoot } from "../../../utils/utils";
import { TooltipText } from "../side-panel/SidePanelStyles";
import { setTheFormatedDate } from "../../../utils/ViewerDataUtils";
const UploaderReview: React.FC<any> = () => {
  const router = useRouter();
  const { state: appState, appContextAction } = useAppContext();
  const { appAction } = appContextAction;
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const sectionId = uploaderState.structure?._id;

  const date = uploaderState.date ? new Date(uploaderState.date) : null;

  const gethierarchyPath = (): string => {
    if(uploaderState.structure) {
      if(appState.hierarchy) {
        return getPathToRoot(uploaderState.structure?._id, appState.hierarchy[0])
      } else {
        return uploaderState.structure.name
      }
    }
    return ""
  }

 
  return (
    <React.Fragment>
      <div className="flex justify-center items-center mt-[16px]">
        <div >
          <div className="col-span-4">
            <div className="shadow-md rounded-md p-4 mb-4 bg-box-orange">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                <div>
                  <p className="mb-0 font-semibold">Project</p>
                </div>
                <div>
                  <p className="text-black-500 mb-0">
                    :        <TooltipText title={uploaderState.project?.name && uploaderState.project?.name.length > 20 ?uploaderState.project?.name:""} placement="right">
          <span className="text-[#101F4C]"><TruncatedString text={uploaderState.project?.name} maxLength={20} suffixLength={0}></TruncatedString></span> 
          </TooltipText>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                <div>
                  <p className="mb-0 font-semibold">Level Chosen</p>
                </div>
                <div>
                  <p className="text-black-500 mb-0">: {uploaderState.project?.name && uploaderState.project?.name.length > 20 ?uploaderState.project?.name:""} 
                  <TooltipText title={gethierarchyPath() && gethierarchyPath().length > 20 ?gethierarchyPath():""} placement="right">      
          <span className="text-[#101F4C]">
            <TruncatedString text={gethierarchyPath()} maxLength={20} suffixLength={20}></TruncatedString></span> 
        
          </TooltipText>
          </p>

                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                <div>
                  <p className="mb-0 font-semibold">Date</p>
                </div>
                <div>
                  <p className="text-black-500 mb-0">: {setTheFormatedDate(date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                <div>
                  <p className="mb-0 font-semibold">No. of files choosen</p>
                </div>
                <div>
                  <p className="text-black-500 mb-0">: {uploaderState.choosenFiles.validFiles.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                <div>
                  <p className="mb-0 font-semibold">GCP Provided</p>
                </div>
                <div>
                  <p className="text-black-500 mb-0">: {uploaderState.skipGCP ? "No" : "Yes"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                <div>
                  <p className="mb-0 font-semibold">No. of GCPs(if Provided)</p>
                </div>
                <div>
                  <p className="text-black-500 mb-0">: {uploaderState.skipGCP ? 0 : uploaderState.gcpList?.location ? uploaderState.gcpList?.location.length : uploaderState.gcpList?.utmLocation?.length}</p>
                </div>
              </div>
              <div style={{ borderRadius:"0px 8px 8px 0px"}} className=" bg-box-white mt-[10px] shadow-md border-l-4 border-l-[#FF843F]">
                <p  className=" py-[16px] px-[24px] font-sans font-medium not-italic text-base w-fit">
                  Click the &apos; Go Back &apos; button to reach the particular step you
                  want to modify.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default UploaderReview;
