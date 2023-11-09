import { Router, useRouter } from "next/router";
import React from "react";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { useAppContext } from "../../../state/appState/context";
import { getPathToRoot } from "../../../utils/utils";

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

  const formattedDate = date
    ? `${date.getFullYear()} ${date.toLocaleString("default", {
        month: "short",
      })} ${date.getDate()}`
    : "Date not available";
  return (
    <React.Fragment>
      <div>
        <div className=" ml-6 mt-4 w-1/2">
          <div className="col-span-4">
            <div className="bg-white shadow-md rounded-md p-4 mb-4 bg-box-orange">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                <div>
                  <p className="mb-0 font-semibold">Project</p>
                </div>
                <div>
                  <p className="text-black-500 mb-0">
                    : {uploaderState.project?.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                <div>
                  <p className="mb-0 font-semibold">Level Chosen</p>
                </div>
                <div>
                  <p className="text-black-500 mb-0">: { gethierarchyPath() }
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                <div>
                  <p className="mb-0 font-semibold">Date</p>
                </div>
                <div>
                  <p className="text-black-500 mb-0">: {formattedDate}</p>
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
              <div className="p-4 border border-white-500 bg-box-white rounded-md shadow-md">
                <p className=" h-20px font-sans font-medium not-italic text-base line-height-150%">
                  Click the 'Go Back' button to reach the particular step you
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
