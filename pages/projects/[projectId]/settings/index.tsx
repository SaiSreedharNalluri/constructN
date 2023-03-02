import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../../../components/container/header";
import Treelist from "../../../../components/container/treeList";
import {
  assignProjectUser,
  getProjectDetails,
  getProjectUsers,
  removeProjectUser,
  updateProjectCover,
  updateProjectInfo,
  updateProjectUserRole,
} from "../../../../services/project";
import { IProjects, IProjectUsers } from "../../../../models/IProjects";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import CollapsableMenu from "../../../../components/layout/collapsableMenu";
import "react-tabs/style/react-tabs.css";
import { ChildrenEntity } from "../../../../models/IStructure";
import { AxiosResponse } from "axios";
import { getStructureHierarchy } from "../../../../services/structure";
import ProjectInfo from "../../../../components/container/projectInfo";
import ProjectUserAdd from "../../../../components/container/projectUsersAdd";
import { toast } from "react-toastify";
import {
  addIssuePriorityApi,
  addIssueStatusApi,
  addIssueTypeApi,
  getIssuesPriorityList,
  getIssueStatusList,
  getIssueTypeList,
  removeIssueStatusItemApi,
  removeIssueTypeApi,
  removePriorityTypeApi,
  updateIssuePriorityListApi,
  updateIssueStatusListApi,
  updateIssueTypeListApi,
} from "../../../../services/issue";
// import { updateIssuesPriority } from '../../../../services/issue';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-responsive-modal";
import {
  addTaskStatusApi,
  addTaskTypeListsApi,
  addTaskTypesApi,
  getTaskPriorityList,
  getTaskStatusList,
  getTaskTypeList,
  removeTaskStatusListApi,
  removeTaskTypeListsApi,
  removeTaskTypePriorityApi,
  updateTaskPriorityListApi,
  updateTaskStatusListApi,
  updateTaskTypeListApi,
} from "../../../../services/task";
import {
  addTagsListApi,
  deleteTagsListApi,
  getTagsList,
  updateTagsListApi,
} from "../../../../services/tags";
const Editproject: React.FC = () => {
  const router = useRouter();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  let [state, setState] = useState<ChildrenEntity[]>([]);
  const [selector, setSelector] = useState("");
  let [structureData, setStructureData] = useState<ChildrenEntity>();
  let [projectData, setProjectData] = useState<IProjects>();
  let [issuePriorityList, setIssuePriorityList] = useState<any>();
  let [issueTypeList, setIssueTypeList] = useState<any>();
  // let [issueTypeListId, setIssueTypeListId] = useState<any>();
  let [issueStatusList, setIssueStatusList] = useState<any>();
  let [taskPriorityList, setTaskPriorityList] = useState<any>();
  let [taskTypeList, setTaskTypeList] = useState<any>();
  let [taskStatusList, setTaskStatusList] = useState<any>();
  let [tags, setTags] = useState<any>();
  let [addIssue, setAddIssue] = useState<any>("");
  let [addIssuePriorityType, setAddIssuePriorityType] = useState<any>("");
  let [addTaskType, setAddTaskType] = useState<any>("");
  let [addTaskTypelist, setAddTaskTypeList] = useState<any>("");
  let [addIssueStatuslist, setAddIssueStatusList] = useState<any>("");
  let [addTaskStatuslist, setAddTaskStatusList] = useState<any>("");
  let [addTagslist, setAddTagsList] = useState<any>("");
  const [isActive, setIsActive] = useState("issuePriority");
  const toggle = (e: any) => {
    setIsActive(e.target.id);
  };
  useEffect(() => {
    if (router.isReady) {
      getProjectUsers(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setProjectUsers(response.result);
          }
        })
        .catch();
      getStructureHierarchy(router.query.projectId as string)
        .then((response: AxiosResponse<any>) => {
          setState([...response.data.result]);
          setStructureData(response.data.result[0]);
          setSelector(response.data.result[0]._id);
        })
        .catch((error) => {
          console.log("error", error);
        });
      getProjectDetails(router.query.projectId as string)
        .then((response) => {
          if (response?.data?.success === true) {
            setProjectData(response?.data?.result);
          }
        })
        .catch();
      getIssuesPriorityList(router.query.projectId as string).then(
        (response) => {
          if (response.success === true) {
            setIssuePriorityList(response.result.priorityList.Issue);
          }
        }
      );
      getTaskPriorityList(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskPriorityList(response.result.priorityList.Task);
        }
      });
      getIssueTypeList(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setIssueTypeList(response.result.typeList.Issue);
        }
      });
      getTaskTypeList(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskTypeList(response.result.typeList.Task);
        }
      });
      getIssueStatusList(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setIssueStatusList(response.result.statusList.Issue);
        }
      });
      getTaskStatusList(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskStatusList(response.result.statusList.Task);
        }
      });
      getTagsList(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTags(response.result[0]?.tagList);
        }
      });
    }
  }, [router.isReady, router.query.projectId]);
  const addProjectUser = (userInfo: object) => {
    assignProjectUser(userInfo, router.query.projectId as string)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
          setProjectUsers(response?.result);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const updateProjectData = (projectInfo: any) => {
    if (
      projectInfo.latitude != undefined &&
      projectInfo.longitude != undefined
    ) {
      delete projectInfo.location;
      projectInfo.location = [projectInfo.latitude, projectInfo.longitude];
      delete projectInfo.latitude;
      delete projectInfo.longitude;
    }

    updateProjectInfo(projectInfo, router.query.projectId as string)
      .then((response) => {
        if (response.success === true) {
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
  const deassignProjectUser = (userInfo: string) => {
    removeProjectUser(userInfo, router.query.projectId as string)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
          setProjectUsers(response?.result);
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
  const dragItem: any = useRef();
  const dragOverItem: any = useRef();
  const handleIssueTypeUpdate = (e: any) => {
    let copyListItems = [...issueTypeList];
    const dragItemContent = copyListItems.splice(dragItem.current, 1)[0];
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setIssueTypeList(copyListItems);
    updateIssueTypeListApi(router.query.projectId as string, copyListItems)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const dragItems: any = useRef();
  const dragOverItems: any = useRef();
  const handleTaskTypeUpdate = (e: any) => {
    let copyListItems = [...taskTypeList];
    const dragItemContent = copyListItems.splice(dragItems.current, 1)[0];
    copyListItems.splice(dragOverItems.current, 0, dragItemContent);
    dragItems.current = null;
    dragOverItems.current = null;
    setTaskTypeList(copyListItems);
    updateTaskTypeListApi(router.query.projectId as string, copyListItems)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const dragIssuePriorityRef: any = useRef();
  const dragOverIssuePriorityRef: any = useRef();
  const handleIssuePriorityUpdate = (e: any) => {
    let copyListItems = [...issuePriorityList];
    const dragItemContent = copyListItems.splice(
      dragIssuePriorityRef.current,
      1
    )[0];
    copyListItems.splice(dragOverIssuePriorityRef.current, 0, dragItemContent);
    dragIssuePriorityRef.current = null;
    dragOverIssuePriorityRef.current = null;
    updateIssuePriorityListApi(router.query.projectId as string, copyListItems)
      .then((response) => {
        if (response?.success === true) {
          setIssuePriorityList(response.result.priorityList.Issue);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const dragTaskPriorityRef: any = useRef();
  const dragOverTaskPriorityRef: any = useRef();
  const handleTaskPriorityUpdate = (e: any) => {
    let copyListItems = [...taskPriorityList];
    const dragItemContent = copyListItems.splice(
      dragTaskPriorityRef.current,
      1
    )[0];
    copyListItems.splice(dragOverTaskPriorityRef.current, 0, dragItemContent);
    dragTaskPriorityRef.current = null;
    dragOverTaskPriorityRef.current = null;
    setTaskPriorityList(copyListItems);
    updateTaskPriorityListApi(router.query.projectId as string, copyListItems)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const dragIssueStatusRef: any = useRef();
  const dragOverIssueStatusRef: any = useRef();
  const handleIssueStatusListUpdate = (e: any) => {
    let copyListItems = [...issueStatusList];
    const dragItemContent = copyListItems.splice(
      dragIssueStatusRef.current,
      1
    )[0];
    copyListItems.splice(dragOverIssueStatusRef.current, 0, dragItemContent);
    dragIssueStatusRef.current = null;
    dragOverIssueStatusRef.current = null;
    setIssueStatusList(copyListItems);
    updateIssueStatusListApi(router.query.projectId as string, copyListItems)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const dragTaskStatusRef: any = useRef();
  const dragOverTaskStatusRef: any = useRef();
  const handleTaskStatusListUpdate = (e: any) => {
    let copyListItems = [...taskStatusList];
    const dragItemContent = copyListItems.splice(
      dragTaskStatusRef.current,
      1
    )[0];
    copyListItems.splice(dragOverTaskStatusRef.current, 0, dragItemContent);
    dragTaskStatusRef.current = null;
    dragOverTaskStatusRef.current = null;
    setTaskStatusList(copyListItems);
    updateTaskStatusListApi(router.query.projectId as string, copyListItems)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };

  const dragTagsRef: any = useRef();
  const dragOverTagsRef: any = useRef();
  const handleTagsUpdate = (e: any) => {
    let copyListItems = [...tags];
    const dragItemContent = copyListItems.splice(dragTagsRef.current, 1)[0];
    copyListItems.splice(dragOverTagsRef.current, 0, dragItemContent);
    dragTagsRef.current = null;
    dragOverTagsRef.current = null;
    setTags(copyListItems);
    updateTagsListApi(router.query.projectId as string, copyListItems)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const deleteIssueTypeItem = (e: any, id: any) => {
    e.preventDefault();
    const indexValue = issueTypeList?.filter((item: any, index: any) => {
      return index === id;
    });
    removeIssueTypeApi(router.query.projectId as string, indexValue)
      .then((response) => {
        if (response?.success === true) {
          setIssueTypeList(response.result.typeList.Issue);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  let handleIssueTypeSubmit = (e: any) => {
    e.preventDefault();
    setAddIssue("");
    addIssueTypeApi(router.query.projectId as string, addIssue)
      .then((response) => {
        if (response?.success === true) {
          setIssueTypeList(response.result.typeList.Issue);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  let handleIssuePrioritySubmit = (e: any) => {
    e.preventDefault();
    setAddIssuePriorityType("");
    addIssuePriorityApi(router.query.projectId as string, addIssuePriorityType)
      .then((response) => {
        if (response?.success === true) {
          setIssuePriorityList(response.result.priorityList.Issue);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  let handleTaskPriortySumbit = (e: any) => {
    e.preventDefault();
    setAddTaskType("");
    addTaskTypesApi(router.query.projectId as string, addTaskType)
      .then((response) => {
        if (response?.success === true) {
          setTaskPriorityList(response.result.priorityList.Task);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const deleteIssuePriorityItem = (e: any, id: any) => {
    e.preventDefault();
    const indexValue = issuePriorityList?.filter((item: any, index: any) => {
      return index === id;
    });
    removePriorityTypeApi(router.query.projectId as string, indexValue)
      .then((response) => {
        if (response?.success === true) {
          setIssuePriorityList(response.result.priorityList.Issue);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const deleteTaskPriorityItem = (e: any, id: any) => {
    e.preventDefault();
    const indexValue = taskPriorityList?.filter((item: any, index: any) => {
      return index === id;
    });
    removeTaskTypePriorityApi(router.query.projectId as string, indexValue)
      .then((response) => {
        if (response?.success === true) {
          setTaskPriorityList(response.result.priorityList.Task);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const deleteTaskTypeListItem = (e: any, id: any) => {
    e.preventDefault();
    const indexValue = taskTypeList?.filter((item: any, index: any) => {
      return index === id;
    });
    removeTaskTypeListsApi(router.query.projectId as string, indexValue)
      .then((response) => {
        if (response?.success === true) {
          setTaskTypeList(response.result.typeList.Task);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  let handleTaskTypeListSumbit = (e: any) => {
    e.preventDefault();
    setAddTaskTypeList("");
    addTaskTypeListsApi(router.query.projectId as string, addTaskTypelist)
      .then((response) => {
        if (response.success === true) {
          setTaskTypeList(response.result.typeList.Task);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  let handleIssueStatusListSubmit = (e: any) => {
    e.preventDefault();
    setAddIssueStatusList("");
    addIssueStatusApi(router.query.projectId as string, addIssueStatuslist)
      .then((response) => {
        if (response?.success === true) {
          setIssueStatusList(response.result.statusList.Issue);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  let handleTaskStatusListSubmit = (e: any) => {
    e.preventDefault();
    setAddTaskStatusList("");
    addTaskStatusApi(router.query.projectId as string, addTaskStatuslist)
      .then((response) => {
        if (response?.success === true) {
          setTaskStatusList(response.result.statusList.Task);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };

  let handleTagsListSubmit = (e: any) => {
    e.preventDefault();
    setAddTagsList("");
    addTagsListApi(router.query.projectId as string, addTagslist)
      .then((response) => {
        if (response?.success === true) {
          setTags(response.result.tagList);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const deleteIssueStatusItem = (e: any, id: any) => {
    e.preventDefault();
    const indexValue = issueStatusList?.filter((item: any, index: any) => {
      return index === id;
    });
    removeIssueStatusItemApi(router.query.projectId as string, indexValue)
      .then((response) => {
        if (response?.success === true) {
          setIssueStatusList(response.result.statusList.Issue);
          // toast.info("Issue Status Item is Removed");
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const deleteTaskStatusItem = (e: any, id: any) => {
    e.preventDefault();
    const indexValue = taskStatusList?.filter((item: any, index: any) => {
      return index === id;
    });
    removeTaskStatusListApi(router.query.projectId as string, indexValue)
      .then((response) => {
        if (response?.success === true) {
          setTaskStatusList(response.result.statusList.Task);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const updateUserRole = (upDateObj: any) => {
    updateProjectUserRole(upDateObj, router.query.projectId as string)
      .then((response) => {
        if (response.success === true) {
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };

  const deleteTagsItem = (e: any, id: any) => {
    e.preventDefault();
    const indexValue = tags?.filter((item: any, index: any) => {
      return index === id;
    });
    deleteTagsListApi(router.query.projectId as string, indexValue)
      .then((response) => {
        if (response?.success === true) {
          setTags(response.result.tagList);
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="flex w-full fixed">
        <div>
          <CollapsableMenu onChangeData={() => {}} />
        </div>
        <div className="calc-w  calc-h overflow-y-auto ">
          <Tabs
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}
          >
            <Tabs>
              <TabList>
                <Tab>Project Info</Tab>
                <Tab>User Info</Tab>
                <Tab>Project Structure</Tab>
                <Tab>Type Configration</Tab>
              </TabList>
              <div>
                <TabPanel>
                  {projectData && (
                    <ProjectInfo
                      handleImageUPload={handleImageUPload}
                      projectData={projectData as IProjects}
                      updateProjectData={updateProjectData}
                    />
                  )}
                </TabPanel>
                <TabPanel>
                  <ProjectUserAdd
                    deassignProjectUser={deassignProjectUser}
                    projectUsers={projectUsers}
                    addProjectUser={addProjectUser}
                    updateUserRole={updateUserRole}
                  />
                </TabPanel>
                <TabPanel>
                  <div className="flex ">
                    <div
                      className={` lg:w-1/4 sm:w-1/3 2xl:w-1/5  calc-h78   min-w-fit  overflow-y-auto  overflow-x-hidden bg-gray-200`}
                    >
                      {state.length === 0 ? (
                        "no structures found for this project"
                      ) : (
                        <Treelist
                          treeList={state}
                          initialSelector={selector}
                          getStructureData={(structure: ChildrenEntity) => {
                            setStructureData(structure);
                          }}
                        />
                      )}
                    </div>
                    <div className="ml-6">
                      <h1 className="">Project Details</h1>
                      <div>
                        <span>Id:</span>
                        {structureData?._id}
                        <br />
                        <span>Name:</span>
                        {structureData?.name}
                        <br />
                        <span>Type:</span>
                        {structureData?.type}
                        <br />
                        <span>parent :</span>
                        {structureData?.parent}
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="flex">
                    <div className="w-1/4 ">
                      <ul>
                        <li>
                          <button
                            id="issuePriority"
                            className={
                              isActive === "issuePriority" ? "bg-green-300" : ""
                            }
                            onClick={(e) => {
                              toggle(e);
                            }}
                          >
                            Issue Priortiy
                          </button>
                        </li>
                        <li>
                          <button
                            id="taskPriority"
                            className={
                              isActive === "taskPriority" ? "bg-green-300" : ""
                            }
                            onClick={(e) => {
                              toggle(e);
                            }}
                          >
                            Task Priortiy
                          </button>
                        </li>
                        <li>
                          <button
                            id="issueType"
                            className={
                              isActive === "issueType" ? "bg-green-300" : ""
                            }
                            onClick={(e) => {
                              toggle(e);
                            }}
                          >
                            Issue Type{" "}
                          </button>{" "}
                        </li>
                        <li>
                          <button
                            id="taskType"
                            className={
                              isActive === "taskType" ? "bg-green-300" : ""
                            }
                            onClick={(e) => {
                              toggle(e);
                            }}
                          >
                            Task Type{" "}
                          </button>{" "}
                        </li>
                        <li>
                          <button
                            id="issueStatus"
                            className={
                              isActive === "issueStatus" ? "bg-green-300" : ""
                            }
                            onClick={(e) => {
                              toggle(e);
                            }}
                          >
                            Issue Status{" "}
                          </button>
                        </li>
                        <li>
                          <button
                            id="taskStatus"
                            className={
                              isActive === "taskStatus" ? "bg-green-300" : ""
                            }
                            onClick={(e) => {
                              toggle(e);
                            }}
                          >
                            Issue Status{" "}
                          </button>
                        </li>
                        <li>
                          <button
                            id="tags"
                            className={
                              isActive === "tags" ? "bg-green-300" : ""
                            }
                            onClick={(e) => {
                              toggle(e);
                            }}
                          >
                            Tags List
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="w-3/4">
                      <div
                        className={
                          isActive === "issuePriority"
                            ? `issuePriority`
                            : " hidden"
                        }
                      >
                        <div>
                          <div>
                            <form
                              className="flex gap-2 px-4  "
                              onSubmit={handleIssuePrioritySubmit}
                            >
                              <div className="mt-2 ">
                                <input
                                  type="text"
                                  required
                                  value={addIssuePriorityType}
                                  onChange={(e) =>
                                    setAddIssuePriorityType([e.target.value])
                                  }
                                  placeholder="Enter Issue priority"
                                  className=" border border-gray-600 focus:outline-none w-full text-sm rounded  p-2"
                                ></input>
                              </div>
                              <div className="">
                                <button className="px-2 py-1 mt-2 bg-red-500 hover:bg-red-800   rounded text-gray-200 font-semibold ">
                                  add
                                </button>
                              </div>
                            </form>
                          </div>
                          <div>
                            <div className="px-4  py-2  ">
                              <table className="w-full overflow-y-auto">
                                <thead>
                                  <tr className="bg-gray-200 border-b border-gray-200  uppercase ">
                                    <th className="inline-grid p-2">
                                      Issue Priority
                                    </th>
                                    <th>Delete</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {issuePriorityList?.map(
                                    (item: any, index: any) => {
                                      return (
                                        <tr key={index}>
                                          <td className="border-b border-gray-200">
                                            <div>
                                              <div
                                                key={index}
                                                className=" cursor-move"
                                                draggable
                                                onDragStart={(e: any) =>
                                                  (dragIssuePriorityRef.current =
                                                    index)
                                                }
                                                onDragEnter={(e: any) =>
                                                  (dragOverIssuePriorityRef.current =
                                                    index)
                                                }
                                                onDragEnd={
                                                  handleIssuePriorityUpdate
                                                }
                                                onDragOver={(e) =>
                                                  e.preventDefault()
                                                }
                                              >
                                                <h2 className="p-2"> {item}</h2>
                                              </div>
                                            </div>
                                          </td>
                                          <td className=" border-b text-center border-gray-200">
                                            <div>
                                              <FontAwesomeIcon
                                                onClick={() =>
                                                  deleteIssuePriorityItem(
                                                    event,
                                                    index
                                                  )
                                                }
                                                className="ml-2 cursor-pointer"
                                                icon={faTrashCan}
                                              ></FontAwesomeIcon>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          isActive === "taskPriority"
                            ? `taskPriority`
                            : "  hidden"
                        }
                      >
                        <div>
                          <div className="px-4">
                            <form
                              className="flex gap-x-2 "
                              onSubmit={handleTaskPriortySumbit}
                            >
                              <div className="mt-2 ">
                                <input
                                  placeholder="Enter Task priority"
                                  required
                                  value={addTaskType}
                                  onChange={(e) =>
                                    setAddTaskType([e.target.value])
                                  }
                                  className="border border-gray-600 focus:outline-none  text-sm rounded w-full p-2"
                                ></input>
                              </div>
                              <div className="">
                                <button className="px-2 py-1 mt-2 bg-red-500 hover:bg-red-800  rounded text-gray-200 font-semibold ">
                                  add
                                </button>
                              </div>
                            </form>
                          </div>
                          <div className="px-4 py-2 ">
                            <table className="w-full overflow-y-auto ">
                              <thead>
                                <tr className="bg-gray-200 border-b border-gray-200   uppercase ">
                                  <th className="inline-grid p-2">
                                    Task Priority
                                  </th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {taskPriorityList?.map(
                                  (item: any, index: any) => {
                                    return (
                                      <tr key={index}>
                                        <td className=" border-b border-gray-200">
                                          <div>
                                            <div
                                              key={index}
                                              className=" cursor-move"
                                              draggable
                                              onDragStart={(e: any) =>
                                                (dragTaskPriorityRef.current =
                                                  index)
                                              }
                                              onDragEnter={(e: any) =>
                                                (dragOverTaskPriorityRef.current =
                                                  index)
                                              }
                                              onDragEnd={
                                                handleTaskPriorityUpdate
                                              }
                                              onDragOver={(e) =>
                                                e.preventDefault()
                                              }
                                            >
                                              <h2 className="p-2"> {item}</h2>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="border-b text-center border-gray-200">
                                          <div>
                                            <FontAwesomeIcon
                                              onClick={() =>
                                                deleteTaskPriorityItem(
                                                  event,
                                                  index
                                                )
                                              }
                                              className="cursor-pointer"
                                              icon={faTrashCan}
                                            ></FontAwesomeIcon>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          isActive === "issueType" ? `issueType` : " hidden"
                        }
                      >
                        <div>
                          <div className="  flex  gap-3 px-4 ">
                            <form
                              className="flex gap-x-2"
                              onSubmit={handleIssueTypeSubmit}
                            >
                              <div className="mt-2 ">
                                <input
                                  required
                                  value={addIssue}
                                  onChange={(e) =>
                                    setAddIssue([e.target.value])
                                  }
                                  placeholder="Enter Issue type"
                                  className="border border-gray-600 focus:outline-none w-full  text-sm rounded  p-2"
                                ></input>
                              </div>
                              <div>
                                <button className="px-2 py-1 mt-2 bg-red-500 hover:bg-red-800  rounded text-gray-200 font-semibold ">
                                  add
                                </button>
                              </div>
                            </form>
                          </div>
                          <div className="px-4 py-2  ">
                            <table className="w-full overflow-y-auto">
                              <thead>
                                <tr className="bg-gray-200 border-b border-gray-200  uppercase ">
                                  <th className="inline-grid p-2">
                                    Issue Type
                                  </th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {issueTypeList?.map((item: any, index: any) => {
                                  return (
                                    <tr key={index}>
                                      <td className="border-b border-gray-200">
                                        <div>
                                          <div
                                            key={index}
                                            className=" cursor-move"
                                            draggable
                                            onDragStart={(e: any) =>
                                              (dragItem.current = index)
                                            }
                                            onDragEnter={(e: any) =>
                                              (dragOverItem.current = index)
                                            }
                                            onDragEnd={handleIssueTypeUpdate}
                                            onDragOver={(e) =>
                                              e.preventDefault()
                                            }
                                          >
                                            <h2 className="p-2"> {item}</h2>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="border-b text-center border-gray-200">
                                        <div>
                                          <FontAwesomeIcon
                                            onClick={() =>
                                              deleteIssueTypeItem(event, index)
                                            }
                                            className="cursor-pointer"
                                            icon={faTrashCan}
                                          ></FontAwesomeIcon>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          isActive === "taskType" ? `taskType ` : "  hidden"
                        }
                      >
                        <div>
                          <div className=" px-4 ">
                            <form
                              className="flex gap-x-2"
                              onSubmit={handleTaskTypeListSumbit}
                            >
                              <div className="mt-2 ">
                                <input
                                  required
                                  value={addTaskTypelist}
                                  onChange={(e) =>
                                    setAddTaskTypeList([e.target.value])
                                  }
                                  placeholder="Enter Task type"
                                  className="border border-gray-600 w-full focus:outline-none  text-sm rounded  p-2"
                                ></input>
                              </div>
                              <div>
                                <button className="px-2 py-1 mt-2 bg-red-500 hover:bg-red-800  rounded text-gray-200 font-semibold ">
                                  add
                                </button>
                              </div>
                            </form>
                          </div>
                          <div className="px-4 py-2 ">
                            <table className="w-full overflow-y-auto ">
                              <thead>
                                <tr className="bg-gray-200 border-b border-gray-200  uppercase ">
                                  <th className="inline-grid p-2">Task Type</th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {taskTypeList?.map((item: any, index: any) => {
                                  return (
                                    <tr key={index}>
                                      <td className="border-b border-gray-200">
                                        <div>
                                          <div
                                            key={index}
                                            className=" cursor-move"
                                            draggable
                                            onDragStart={(e: any) =>
                                              (dragItems.current = index)
                                            }
                                            onDragEnter={(e: any) =>
                                              (dragOverItems.current = index)
                                            }
                                            onDragEnd={handleTaskTypeUpdate}
                                            onDragOver={(e) =>
                                              e.preventDefault()
                                            }
                                          >
                                            <h2 className="p-2"> {item}</h2>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="border-b text-center border-gray-200">
                                        <div>
                                          <FontAwesomeIcon
                                            onClick={() =>
                                              deleteTaskTypeListItem(
                                                event,
                                                index
                                              )
                                            }
                                            className="cursor-pointer"
                                            icon={faTrashCan}
                                          ></FontAwesomeIcon>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          isActive === "issueStatus"
                            ? `issueStatus`
                            : "  hidden"
                        }
                      >
                        <div>
                          <div className="px-4">
                            <form
                              className="flex gap-x-2"
                              onSubmit={handleIssueStatusListSubmit}
                            >
                              <div className="mt-2 ">
                                <input
                                  required
                                  value={addIssueStatuslist}
                                  onChange={(e) =>
                                    setAddIssueStatusList([e.target.value])
                                  }
                                  placeholder="Enter Issue Status"
                                  className="border w-full border-gray-600 focus:outline-none  text-sm rounded  p-2"
                                ></input>
                              </div>
                              <div className="">
                                <button className="px-2 py-1 mt-2 bg-red-500 hover:bg-red-800  rounded text-gray-200 font-semibold ">
                                  add
                                </button>
                              </div>
                            </form>
                          </div>
                          <div className="px-4 py-2 ">
                            <table className="w-full overflow-y-auto ">
                              <thead>
                                <tr className="bg-gray-200 border-b border-gray-200  uppercase ">
                                  <th className="inline-grid p-2">
                                    Issue Status
                                  </th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {issueStatusList?.map(
                                  (item: any, index: any) => {
                                    return (
                                      <tr key={index}>
                                        <td className="border-b border-gray-200">
                                          <div>
                                            <div
                                              key={index}
                                              className=" cursor-move"
                                              draggable
                                              onDragStart={(e: any) =>
                                                (dragIssueStatusRef.current =
                                                  index)
                                              }
                                              onDragEnter={(e: any) =>
                                                (dragOverIssueStatusRef.current =
                                                  index)
                                              }
                                              onDragEnd={
                                                handleIssueStatusListUpdate
                                              }
                                              onDragOver={(e) =>
                                                e.preventDefault()
                                              }
                                            >
                                              <h2 className="p-2"> {item}</h2>
                                            </div>
                                          </div>
                                        </td>
                                        <td className=" border-b text-center border-gray-200">
                                          <div>
                                            <FontAwesomeIcon
                                              onClick={() =>
                                                deleteIssueStatusItem(
                                                  event,
                                                  index
                                                )
                                              }
                                              className=" cursor-pointer"
                                              icon={faTrashCan}
                                            ></FontAwesomeIcon>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          isActive === "taskStatus" ? `taskStatus` : "  hidden"
                        }
                      >
                        <div>
                          <div className="px-4">
                            <form
                              className="flex gap-x-2"
                              onSubmit={handleTaskStatusListSubmit}
                            >
                              <div className="mt-2 ">
                                <input
                                  placeholder="Enter Task Status"
                                  required
                                  value={addTaskStatuslist}
                                  onChange={(e) => {
                                    setAddTaskStatusList([e.target.value]);
                                  }}
                                  className="border border-gray-600 focus:outline-none  text-sm  w-full rounded  p-2"
                                ></input>
                              </div>
                              <div>
                                <button className="px-2 py-1 mt-2 bg-red-500 hover:bg-red-800  rounded text-gray-200 font-semibold ">
                                  add
                                </button>
                              </div>
                            </form>
                          </div>
                          <div className="px-4 py-2 ">
                            <table className="w-full overflow-y-auto ">
                              <thead>
                                <tr className="bg-gray-200 border-b border-gray-200  uppercase ">
                                  <th className="inline-grid p-2">
                                    Task Status
                                  </th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {taskStatusList?.map(
                                  (item: any, index: any) => {
                                    return (
                                      <tr key={index}>
                                        <td className="  border-b border-gray-200">
                                          <div>
                                            <div
                                              key={index}
                                              className=" cursor-move"
                                              draggable
                                              onDragStart={(e: any) =>
                                                (dragTaskStatusRef.current =
                                                  index)
                                              }
                                              onDragEnter={(e: any) =>
                                                (dragOverTaskStatusRef.current =
                                                  index)
                                              }
                                              onDragEnd={
                                                handleTaskStatusListUpdate
                                              }
                                              onDragOver={(e) =>
                                                e.preventDefault()
                                              }
                                            >
                                              <h2 className="p-2"> {item}</h2>
                                            </div>
                                          </div>
                                        </td>
                                        <td className=" border-b text-center border-gray-200">
                                          <div>
                                            <FontAwesomeIcon
                                              onClick={(e) =>
                                                deleteTaskStatusItem(
                                                  event,
                                                  index
                                                )
                                              }
                                              className=" cursor-pointer"
                                              icon={faTrashCan}
                                            ></FontAwesomeIcon>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div
                        className={isActive === "tags" ? `tags` : "  hidden"}
                      >
                        <div>
                          <div className="px-4">
                            <form
                              className="flex gap-x-2"
                              onSubmit={handleTagsListSubmit}
                            >
                              <div className="mt-2 ">
                                <input
                                  required
                                  value={addTagslist}
                                  onChange={(e) =>
                                    setAddTagsList([e.target.value])
                                  }
                                  placeholder="Enter Issue Status"
                                  className="border w-full border-gray-600 focus:outline-none  text-sm rounded  p-2"
                                ></input>
                              </div>
                              <div className="">
                                <button className="px-2 py-1 mt-2 bg-red-500 hover:bg-red-800  rounded text-gray-200 font-semibold ">
                                  add
                                </button>
                              </div>
                            </form>
                          </div>
                          <div className="px-4 py-2 ">
                            <table className="w-full overflow-y-auto ">
                              <thead>
                                <tr className="bg-gray-200 border-b border-gray-200  uppercase ">
                                  <th className=" inline-grid p-2">Tags</th>
                                  <th className="">Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tags?.map((item: any, index: any) => {
                                  return (
                                    <tr key={index}>
                                      <td className="  border-b border-gray-200">
                                        <div>
                                          <div
                                            className=" cursor-move"
                                            draggable
                                            onDragStart={(e: any) =>
                                              (dragTagsRef.current = index)
                                            }
                                            onDragEnter={(e: any) =>
                                              (dragOverTagsRef.current = index)
                                            }
                                            onDragEnd={handleTagsUpdate}
                                            onDragOver={(e) =>
                                              e.preventDefault()
                                            }
                                          >
                                            <h2 className="p-2">{item}</h2>
                                          </div>
                                        </div>
                                      </td>
                                      <td className=" border-b  text-center border-gray-200">
                                        <div>
                                          <FontAwesomeIcon
                                            onClick={(e) =>
                                              deleteTagsItem(event, index)
                                            }
                                            className=" cursor-pointer"
                                            icon={faTrashCan}
                                          ></FontAwesomeIcon>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </div>
            </Tabs>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default Editproject;
