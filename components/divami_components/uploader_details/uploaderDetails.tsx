import React, { useEffect, useState } from "react";
import { ChildrenEntity, IStructure } from "../../../models/IStructure";
import {
  getStructureHierarchy,
  getStructureList,
} from "../../../services/structure";
import { CustomToast } from "../custom-toaster/CustomToast";
import { useRouter } from "next/router";
import { getSectionsList } from "../../../services/sections";
import { AxiosResponse } from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SectionList from "../../container/sectionList";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { useAppContext } from "../../../state/appState/context";
import { getProjectDetails } from "../../../services/project";
import { IProjects } from "../../../models/IProjects";
import { IJobs } from "../../../models/IJobs";

const UploaderDateDetails: React.FC<any> = () => {
  const { state: appState, appContextAction } = useAppContext();
  const { appAction } = appContextAction;
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const router = useRouter();
  let [state, setState] = useState<ChildrenEntity[] | any[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const maxAllowedDate = new Date();
  const [filteredJob, setFilteredJobs] = useState<any>();

  
  const handleDateChange = (date: any | null) => {
    if (date !== null) {
      uploaderAction.setshowMessage(false);
      uploaderAction.updateDate(date);
      uploaderAction.setIsNextEnabled(true);
    } else {
      uploaderAction.updateDate(null);
      uploaderAction.setshowMessage(true);
      uploaderAction.setIsNextEnabled(false);
    }
  };
  const handleNodeExpand = (data: any) => {
    setExpanded(data);
  };
  useEffect(() => {
    if (router.isReady && router.query?.projectId) {
      getProjectDetails(router?.query?.projectId as string).then((response) => {
        let projectDetails: IProjects = response.data.result;
        // console.log("TestingUploader: project details ", projectDetails)
        uploaderAction.setProject(projectDetails);
      });
      let structureList = appState.structureList;
      if (!structureList) {
        getStructureList(router.query.projectId as string)
          .then((response) => {
            const list = response.data.result;
            appAction.setStructureList(list as IStructure[]);
          })
          .catch((error) => {
            CustomToast("failed to load data", "error");
          });
      }
    }
  }, [router.isReady, router.query.projectId]);

  const getCurrentStructureFromStructureList = (structure: IStructure) => {
    let currentStructure = appState.structureList?.find((e) => {
      if (e?._id === structure._id) {
        return e;
      }
    });
    return currentStructure;
  };
  const getStructureData = (structure: IStructure) => {
    let structureDetails = getCurrentStructureFromStructureList(structure);
    if (structureDetails) {
      // console.log("TestingUploader: structureDetails", structureDetails)
      uploaderAction.setStructure(structureDetails);
    }
  };
  useEffect(() => {
    if (router.isReady) {
      let hierarchy = appState.hierarchy;
      if (hierarchy) {
        setState(hierarchy);
      } else {
        getStructureHierarchy(router.query.projectId as string).then(
          (response) => {
            let hierarchyList: ChildrenEntity[] = response.data.result;
            appAction.setHierarchy(hierarchyList);
            setState(hierarchyList);
          }
        );
      }
    }
  }, [router.isReady, router.query.projectId, router.query.structId]);


  useEffect(() => {
    if (
      uploaderState.pendingUploadJobs &&
      uploaderState.pendingProcessJobs &&
      uploaderState.structure &&
      uploaderState.date
    ) {
      
      // const filteredPendingUploadJobs = uploaderState.pendingUploadJobs.filter((job) => {
      //   return (
      //     (job.structure as IStructure)?._id === uploaderState.structure?._id &&
      //     new Date(job.date).toLocaleDateString() ===
      //       uploaderState?.date?.toLocaleDateString()
      //   );
      // });

      const filteredPendingProcessJobs = uploaderState.pendingProcessJobs.filter((job) => {
        return (
          (job.structure as IStructure)?._id === uploaderState.structure?._id &&
          new Date(job.date).toLocaleDateString() ===
            uploaderState?.date?.toLocaleDateString()
        );
      });

      setFilteredJobs(filteredPendingProcessJobs);
      console.log("filtered", filteredPendingProcessJobs);
    }
  }, [
    uploaderState.pendingProcessJobs,
    uploaderState.pendingUploadJobs,
    uploaderState.structure,
    uploaderState.date,
  ]);

  const formatDate = (dateString: any) => {
    if (typeof dateString === "string") {
      const date = new Date(dateString);

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    }
  };
  return (
    <div className="">
      {uploaderState.showMessage && (
        <div
          className="p-4 border border-white-500 bg-white-100 rounded-md shadow-md"
          style={{
            borderLeft: "none",
            borderTop: "none",
            boxShadow: "0px 5px 5px rgba(0, 0, 0.1, 0.1)",
            maxWidth: "700px",
            margin: "0 60px",
          }}
        >
          <p className="w-997px h-24px font-sans font-semibold not-italic text-base line-height-150%">
            Only images in .jpg, .jpeg with metadata info of GPS co-ordinates
            are accepted at the moment.
          </p>
        </div>
      )}
      <p
        className="p-2 w-997px h-24px font-sans font-normal  not-italic text-lg line-height-150%"
        style={{ margin: "0 60px" }}
      >
        Choose the level for which you want to upload Drone capture data.
      </p>
      <div style={{ display: "flex" }}>
        <div className="flex-1 pr-2" style={{ margin: "0 60px" }}>
          <p className="pt-2 pr-2 pl-2 pb-0 w-94px,h-20px,font-sans not-italic font-semibold text-sm">
            Section Name
          </p>
          <div
            className="w-full border-t border-solid border-border-yellow"
            style={{ height: "1px" }}
          ></div>
          <div className="h-[200px]  overflow-y-auto">
            <div>
              {
                <SectionList
                  getStructureData={getStructureData}
                  handleNodeExpand={handleNodeExpand}
                  expandedNodes={expanded}
                  treeData={state}
                ></SectionList>
              }
            </div>
          </div>
          <div>
            {uploaderState.structure?.name &&
              uploaderState.date &&
              filteredJob &&
              filteredJob.length > 0 && (
                <div className="mt-[40px]  w-fit bg-[#FFECE2] rounded-3xl flex justify-center" style={{boxShadow:"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}}>
                  <div className="pl-[60px] pr-[60px] pt-[24px] pb-[24px]">
                  <h3 style={{fontSize:"16px",fontWeight:"600",fontStyle:"normal",fontFamily:"Open sans",lineHeight:"20px",color:"#101f4c"}}>
                    We already have captures for this date{" "}
                    {uploaderState.date.toLocaleDateString()}. Select one from
                    below or create a <button style={{fontSize:"16px",fontWeight:"700",fontStyle:"normal",fontFamily:"Open sans",lineHeight:"20px",color:"#f1742e"}} onClick={() => uploaderAction.next()
                            }>New Capture</button> 
                  </h3>
                  <div>
                    <table className="w-full mt-[18px]">
                      <thead className="sticky top-0 bg-box-orange border-b border-solid border-[#f1742e]">
                        <tr>
                          <th className="p-1 text-left">
                            Capture Date
                          </th>
                          <th className="p-1 text-left">
                            Uploaded on
                          </th>
                          <th className="p-1 text-left">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJob && filteredJob.length > 0 ? (
                          filteredJob.map((job: IJobs) => (
                            <tr key={job._id} className="m-2 cursor-pointer" onClick={() => {
                                uploaderAction.setSelectedJob(job)
                                uploaderAction.next()
                              }
                            }>
                              <td className="p-1 ">
                                {formatDate(
                                  job.captures && job.captures.length > 0
                                    ? (job.captures[0] as any)?.captureDateTime
                                    : ""
                                )}
                              </td>
                              <td className="p-1 ">
                                {new Date(job.updatedAt).toLocaleString()}
                              </td>
                              <td
                                className="p-1"
                                style={{
                                  fontSize: "medium",
                                  fontStyle: "italic",
                                }}
                              >
                                pending processing
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="p-1 border-b border-solid border-border-yellow"
                            >
                              No captures found for the selected date.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <h3
                    style={{fontSize:"14px", textAlign:"left",marginTop:"18px", fontWeight:"400",fontStyle:"italic",fontFamily:"Open sans",lineHeight:"18px",color:"#000"}}
                  >
                    * we will reprocess the combined dataset as a new capture
                  </h3>
                  </div>
        
                </div>
              )}
          </div>
        </div>

        <div className="flex-1/3 justify-end">
          <h2 className="pt-2 pr-2 pl-2 pb-0 w-94px,h-20px,font-sans not-italic font-semibold text-sm">
            Enter Capture Date for {uploaderState.structure?.name}
          </h2>
          <div
            className="w-full border-t border-solid border-border-yellow"
            style={{ height: "1px" }}
          ></div>
          <div
            className="pt-2"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <DatePicker
              className="ml-2 border border-border-yellow border-solid focus:outline-yellow-500 w-22 p-1 rounded hover:border-yellow-500"
              placeholderText="MM/DD/YYYY"
              selected={uploaderState.date}
              onChange={(date) => handleDateChange(date)}
              disabled={!uploaderState.structure?.name}
              maxDate={maxAllowedDate}
            />
          </div>
          {!uploaderState.structure?.name && (
            <p className="text-red-500 text-sm">
              Please select a structure before setting the date.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploaderDateDetails;
