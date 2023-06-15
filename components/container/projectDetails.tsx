import React, { useEffect, useState } from "react";
import { IProjects } from "../../models/IProjects";
import Moment from "moment";
import { Map, Marker } from "react-map-gl";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { IUser } from "../../models/IUser";
import EditProject from "../divami_components/edit-project/EditProject";
import CustomDrawer from "../divami_components/custom-drawer/custom-drawer";
import {
  getProjectDetails,
  updateProjectCover,
  updateProjectInfo,
} from "../../services/project";
import { toast } from "react-toastify";
import ChangeIcon from "./changeIcon";

const ProjectDetails: React.FC = () => {
  let [projectData, setProjectData] = useState<IProjects>();
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
  const latitude: any =
    projectData?.location != undefined ? projectData?.location[0] : 0;
  const longitude: any =
    projectData?.location != undefined ? projectData?.location[1] : 0;
  const utm = projectData?.utm ? projectData?.utm : "NA";
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
      (item: any) => item.id == "utm"
    )[0]?.defaultValue;
    projectInfo.location = [
      formData.filter((item: any) => item.id == "latitude")[0]?.defaultValue,
      formData.filter((item: any) => item.id == "longitude")[0]?.defaultValue,
    ];
    updateProjectInfo(projectInfo, router.query.projectId as string)
      .then((response) => {
        if (response.success === true) {
          handleEditClose();
          toast.success("Project details updated sucessfully");
          setProjectData(response.result);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const handleImageUPload = (e: any) => {
    const formData = new FormData();
    formData.append("file", e.file);
    updateProjectCover(formData, router.query.projectId as string)
      .then((response) => {
        if (response?.success === true) {
          toast.success("Project cover photo updated sucessfully");
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
          toast.error(error?.message);
        }
      });
  };
  return (
    <div className="overflow-x-hidden">
      {projectData ? (
        <div>
          <div className="flex justify-between px-4 py-4">
            <div>
              <h1 className="text-[#101F4C]">Project Details</h1>
            </div>
            <div
              className=" text-[#F1742E] cursor-pointer"
              onClick={() => handleEditOpen()}
            >
              <p>Edit Details</p>
            </div>
          </div>
          {}
          <div className="grid grid-cols-2 divide-x-2 border-2 border-gray-300 mx-4 rounded-md">
            <div className="grid grid-rows-3">
              <div className=" border-b border-black mx-4 py-1">
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
              <div className=" border-b border-[#F1742E]">
                <div className="grid grid-cols-3  px-6  py-4">
                  <div>
                    <p className="text-[#101F4C]">{projectData?.name}</p>
                    <label className="  text-sm text-[#787878]">
                      Project Name
                    </label>
                  </div>
                  <div>
                    <p className="text-[#101F4C]">{projectData?.type}</p>
                    <label className=" text-[#787878] text-sm">
                      Project Type
                    </label>
                  </div>
                  <div className=" text-[#101F4C]">
                    <p className="">{user?.fullName}</p>
                    <label className="  text-sm text-[#787878]">
                      Project Owner
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-3  px-6 ">
                  <div>
                    {" "}
                    <p className="text-[#101F4C]">
                      {Moment(projectData?.createdAt).format("MMM Do YYYY")}
                    </p>
                    <label className="  text-sm text-[#787878]">
                      Created On
                    </label>
                  </div>
                  <div>
                    <p className="text-[#101F4C]">{projectData?.email}</p>
                    <label className=" text-sm text-[#787878]">Email Id</label>
                  </div>
                </div>
              </div>
              <div className="px-4">
                    <label className="  text-sm text-[#787878]">
                      Project Description
                    </label>
                    <p className="text-[#101F4C]">{projectData?.description}</p>
                  </div>
            </div>
            <div className=" grid grid-rows-3">
              <div className="px-4 py-4">
                <div className=" ">Location</div>
                <div className="grid grid-cols-3 py-2">
                  <div>
                    <p className="text-[#101F4C]">{utm}</p>
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

              <div className=" grid row-span-2 border-2 border-[#F1742E]">
                <Map
                  latitude={latitude}
                  longitude={longitude}
                  zoom={10}
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                  mapboxAccessToken={process.env.NEXT_PUBLIC_Map_Token}
                >
                  <Marker latitude={latitude} longitude={longitude}></Marker>
                </Map>
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
