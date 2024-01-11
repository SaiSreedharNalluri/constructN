import React, { useEffect, useState } from "react";
import { IProjects } from "../../models/IProjects";
import Moment from "moment";
import { Map, Marker } from "react-map-gl";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { IUser } from "../../models/IUser";
import EditProject from "../divami_components/edit-project/EditProject";
import CustomDrawer from "../divami_components/custom-drawer/custom-drawer";
import { CustomToast } from "../divami_components/custom-toaster/CustomToast";
import {
  getProjectDetails,
  updateProjectCover,
  updateProjectInfo,
} from "../../services/project";
import { toast } from "react-toastify";
import ChangeIcon from "./changeIcon";
import { TooltipText } from "../divami_components/side-panel/SidePanelStyles";
import moment from 'moment-timezone';
import CustomLoggerClass from "../divami_components/custom_logger/CustomLoggerClass";
import { MAPBOX } from "../../config/config";
const ProjectDetails: React.FC = () => {
  const customLogger = new CustomLoggerClass();
  let [projectData, setProjectData]:any = useState();
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      getProjectDetails(router.query.projectId as string)
        .then((response) => {
          if (response?.data?.success === true) {
            setProjectData(response?.data?.result);
          }
        })
        .catch();
    }
  }, [router.isReady, router.query.projectId]);
  let [user, setUser] = useState<IUser>();
  const [openProjectEditOpen, setOpenProjectEdit] = useState(false);
  const handleEditOpen = () => {
    setOpenProjectEdit(true);
  };
  const handleEditClose = () => {
    setOpenProjectEdit(false);
  };
  useEffect(() => {
    const userObj: any = getCookie("user");
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.fullName) {
      setUser(user);
    }
  }, []);
const latitude =projectData?.location?.coordinates[1]  != undefined ? projectData?.location?.coordinates[1] : 0;
const longitude =projectData?.location?.coordinates[0]  != undefined ? projectData?.location?.coordinates[0] : 0;
  const utm = projectData?.utm?.zone ? projectData?.utm?.zone : "NA";
  const handleUpdateProject = (formData: any) => {
    let projectInfo: any = {};
    projectInfo.name = formData.filter(
      (item: any) => item.id == "title"
    )[0]?.defaultValue;
    projectInfo.description = formData.filter(
      (item: any) => item.id == "description"
    )[0]?.defaultValue;
    projectInfo.type = formData.filter(
      (item: any) => item.id == "projectType"
    )[0]?.defaultValue;
    projectInfo.utm = formData.filter(
      (item: any) => item.id == "utm_value"
    )[0]?.defaultValue;
    projectInfo.location = {
      type: "point",
      coordinates: [
        formData.filter((item: any) => item.id == "longitude")[0]?.defaultValue,
        formData.filter((item: any) => item.id == "latitude")[0]?.defaultValue,
      ],
    }; 
    //projectInfo.name = (projectInfo.name as string).substring(0,100);
    updateProjectInfo(projectInfo, router.query.projectId as string)
      .then((response) => {
        if (response.success === true) {
          handleEditClose();
          CustomToast("Project details updated sucessfully","success");
          setProjectData(response.result);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          CustomToast("You don't have access. Contact Admin.","error");
        customLogger.logError(error)
        }
      });
  };
  const handleImageUPload = (e: any) => {
    const formData = new FormData();
    formData.append("file", e.file);
    updateProjectCover(formData, router.query.projectId as string)
      .then((response) => {
        if (response?.success === true) {
          CustomToast("Project cover photo updated sucessfully","success");
          const fileInput = document.getElementById(
            "file-upload"
          ) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = "";
          }

          setProjectData(response.result);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          if(error.message==='Forbidden Access')
          {
            CustomToast("You don't have access. Contact Admin.","error"); 
          }
          else{
            CustomToast(error?.message,"error");
          }
        }
      });
  };
  const TruncatedString = ({ text, maxLength, suffixLength }: any) => {
    let truncatedText = text;

    if (text.length > maxLength) {
      const prefix = text.substring(0, maxLength - suffixLength);
      const suffix = text.substring(text.length - suffixLength);
      truncatedText = prefix + "..." + suffix;
    }

    return truncatedText;
  };
  return (
    <div className="">
      {projectData ? (
        <div>
          <div className="flex justify-between px-4 py-4">
            <div>
              <h1 className="text-[#101F4C] font-normal font-sans text-lg">Project Details</h1>
            </div>
            <div
              className=" text-[#F1742E] cursor-pointer"
              onClick={() => handleEditOpen()}
            >
              <p>Edit Details</p>
            </div>
          </div>
          <div className=" px-4 " >
          <div className="w-full  flex border-2 border-gray-400 rounded-md">
          <div className=" w-1/2">
          <div className=" border-b border-black mx-4 py-2">
                <img
                  alt=""
                  className=" w-3/4 h-20"
                  width={1080}
                  height={1080}
                  src={projectData?.coverPhoto}
                />
                <div>
                  <ChangeIcon handleImageUPload={handleImageUPload} />
                </div>
          </div>
          <div className="py-2">
                <div className="flex gap-8  justify-between px-4  py-2">
                  <div className="w-1/3">
                 <div className="flex ">
          <TooltipText title={projectData?.name} placement="right">
          <span className="text-[#101F4C]">
            <TruncatedString text={projectData?.name} maxLength={20} suffixLength={0}></TruncatedString>
          </span>
        </TooltipText>
      </div>
    <label className="text-sm text-[#787878] ">
      Project Name
    </label>
  </div>
 <div className="w-1/3">
                  <p className="text-[#101F4C] ">{projectData?.type}</p>
                    <label className=" text-[#787878] text-sm">
                      Project Type
                    </label>
                  </div>
                  <div className="  w-1/3">
                    <p className="text-[#101F4C]">{projectData?.company?.name || "NA"}</p>
                    <label className="  text-sm text-[#787878]">
                      Company Name
                    </label>
                  </div>
                </div>
                <div className="flex gap-8  justify-between    py-2 ">
                  <div className="w-1/3 pl-4">
                    <p className="text-[#101F4C]">
                      {Moment(projectData?.createdAt).format("MMM Do YYYY")}
                    </p>
                    <label className="  text-sm text-[#787878]">
                      Created On
                    </label>
                  </div>
                  <div className="w-1/3 ">
                    <p className="text-[#101F4C]">{projectData?.email}</p>
                    <label className=" text-sm text-[#787878]">Email ID</label>
                  </div>
                  <div className="w-1/3 ">
                    <p className="text-[#101F4C]">{projectData?.timeZone?projectData?.timeZone +" " +`(GMT ${moment.tz(projectData?.updatedAt, projectData?.timeZone|| "").format(`Z`)})`:"N/A" }  </p>
                    <label className=" text-sm text-[#787878]">Time Zone</label>
                  </div>
                </div>
          </div>
          <div className="px-4  py-4">
                    <label className="  text-sm w-full h-full text-[#787878]">
                      Project Description
                    </label>
                    <p className="text-[#101F4C]  " style={{
    wordWrap: 'break-word',
    display: '-webkit-box',
    // WebkitLineClamp: 20,
    WebkitBoxOrient: 'vertical',
  }}>{projectData?.description}</p>
                  </div>
           
          </div>
      <div className="border-r border-gray-900 px-1"></div>
         
          <div className="w-1/2 flex flex-col">
              <div className="px-4 py-4">
                <div className=" py-2 text-base font-normal text-[#101F4C]">Location</div>
                <div className="flex justify-between  ">
                <div>
                <TooltipText title={utm===" "?"NOT AVAILABLE":utm} placement="right"> 
                    <p className="text-[#101F4C] " >
                   
                      <TruncatedString text={utm===" "?"NA":utm} maxLength={3}
              suffixLength={0} ></TruncatedString> 
                      
                </p>
                </TooltipText>

                    <label className="text-[#787878]  text-sm">UTM</label>
                  </div>
                  <div>
                    <p className="text-[#101F4C]">{latitude}</p>
                    <label className="text-[#787878]  text-sm">Latitude</label>
                  </div>
                  <div>
                    <p className="text-[#101F4C]">{longitude}</p>
                    <label className=" text-[#787878]  text-sm">
                      Longitude
                    </label>
                  </div>
                </div>
               
               
              </div>
              <div className=" h-full border-2 border-gray-400">
                <Map
                  latitude={latitude}
                  longitude={longitude}
                  zoom={10}
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                  mapboxAccessToken={MAPBOX.token}
                >
                  <Marker latitude={latitude} longitude={longitude}></Marker>
                </Map>
              </div>
          </div>
          </div>
          </div>
          {openProjectEditOpen && (
            <CustomDrawer>
              <EditProject
                handleEditClose={handleEditClose}
                projectData={projectData}
                handleUpdateProject={handleUpdateProject}
              ></EditProject>
            </CustomDrawer>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen w-screen">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
