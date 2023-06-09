import React, { useEffect, useState } from "react";
import {
  AddButton,
  AddButtonContainer,
  AddLogo,
  AvailableStateHeader,
  ConfigurationBox,
  MenuOptionContainer,
  MenuOptionSelected,
  MenuOuterOptionContainer,
  ProjectConfigContent,
  RemoveButton,
  RemoveLogo,
  SideMenuConfig,
  TextFieldContainer,
} from "./ProjectConfigStyles";
import { getCookie } from "cookies-next";
import {
  getIssuePriorityList,
  getIssueStatusList,
  getTagsList,
  getTaskPriorityList,
  getTaskStatusList,
  updateIssuePriorityList,
  updateIssueStatusList,
  updateTagList,
  updateTaskPriorityList,
  updateTaskStatusList,
} from "../../../services/projectConfigApi";
import { CustomTextField } from "../custom-textfield/CustomTextField";
import { Button } from "@mui/material";
import removeButton from "../../../public/divami_icons/removeButton.svg";
import addButton from "../../../public/divami_icons/addButton.svg";

const ProjectConfig = ({
  projectId,
  selectedOption,
  setSelectedOption,
  formValues,
  setFormValues,
  setShowbutton,
}: any) => {
  const [config, setConfig]: any = React.useState([
    {
      id: "issuePriority",
      title: "Issue Priority",
      isActive: true,
      nextPage: "",
      //   toolTipMsg: "Dashboard & Reports",
    },
    {
      id: "taskPriority",
      title: "Task Priority",

      isActive: false,
      nextPage: "",
      toolTipMsg: "Drawings",
    },

    {
      id: "issueStatus",
      title: "Issue Status",

      isActive: false,
      toolTipMsg: "Schedule",
    },
    {
      id: "taskStatus",
      title: "Task Status",

      isActive: false,
      toolTipMsg: "Users",
    },
    {
      id: "tag",
      title: "Tag",

      isActive: false,
      toolTipMsg: "Users",
    },
  ]);

  const [submittedValues, setSubmittedValues] = useState({});
  // const [selectedOption, setSelectedOption] = useState("Issue Priority");

  // const [formValues, setFormValues]: any = useState({ priority: [] });
  const [priorityArr, setPriorityArr] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const handleHover = (index: any) => {
    setHoveredIndex(index);
  };

  useEffect(() => {
    const userObj: any = getCookie("user");
  }, []);

  useEffect(() => {
    // Define the dynamic API call based on the selected option
    const fetchPriorityList = async () => {
      try {
        let priorityValues = [];
        if (selectedOption === "issuePriority") {
          const response = await getIssuePriorityList(projectId);
          priorityValues = response.result.priorityList.Issue;
        } else if (selectedOption === "taskPriority") {
          const response = await getTaskPriorityList(projectId);
          priorityValues = response.result.priorityList.Task;
        } else if (selectedOption === "issueStatus") {
          const response = await getIssueStatusList(projectId);
          priorityValues = response.result.statusList.Issue;
        } else if (selectedOption === "taskStatus") {
          const response = await getTaskStatusList(projectId);
          priorityValues = response.result.statusList.Task;
        } else if (selectedOption === "tag") {
          const response = await getTagsList(projectId);
          priorityValues = response.result[0].tagList;
        }

        setFormValues({ priority: priorityValues });
      } catch (error) {
        console.log("error", error);
      }
    };

    if (projectId) {
      fetchPriorityList();
    }
  }, [projectId, selectedOption]);

  // setFormValues({ respTextFields });

  const handleOptionClick = (id: any) => {
    setSelectedOption(id);
    const updatedConfig = config.map((option: any) => ({
      ...option,
      isActive: option.id === id,
    }));
    setConfig(updatedConfig);
  };
  const handleTextChange = (e: any, id: any, element: any, index: any) => {
    const { value } = e.target;

    // Create a copy of the formvalues object
    const updatedFormValues: any = { ...formValues };

    // Create a new array with updated value at the specified index using slice and concatenation
    updatedFormValues.priority = [
      ...updatedFormValues.priority.slice(0, index),
      value,
      ...updatedFormValues.priority.slice(index + 1),
    ];

    // Set the updated formvalues object
    setFormValues(updatedFormValues);

    // Convert the priority list to an array format
    const priorityArray = updatedFormValues.priority[0].split(",");

    // Update the submittedValues state if needed
    const updatedSubmittedValues: any = { ...submittedValues };
    updatedSubmittedValues.priority = priorityArray;
    setSubmittedValues(updatedSubmittedValues);
    // Check if the value is empty or not and set setShowbutton accordingly
    setShowbutton(value.trim().length > 0);
  };

  const handleAddField = (index: any) => {
    const updatedFormValues: any = { ...formValues };
    updatedFormValues.priority.splice(index + 1, 0, "");
    setFormValues(updatedFormValues);
  };

  const handleDeleteField = (index: any) => {
    setShowbutton(true);
    const updatedFormValues: any = { ...formValues };
    updatedFormValues.priority.splice(index, 1);
    setFormValues(updatedFormValues);
  };

  const handleSubmit = async () => {
    try {
      // Call the appropriate API based on the selected option and pass the updated values
      if (selectedOption === "issuePriority") {
        // await pushIssuePriorityList(projectId, formValues.priority);
        await updateIssuePriorityList(projectId, {
          issuePriorityList: [...formValues.priority],
        });
      } else if (selectedOption === "taskPriority") {
        await updateTaskPriorityList(projectId, {
          taskPriorityList: [...formValues.priority],
        });
      } else if (selectedOption === "issueStatus") {
        await updateIssueStatusList(projectId, {
          issueStatusList: [...formValues.priority],
        });
      } else if (selectedOption === "taskStatus") {
        await updateTaskStatusList(projectId, {
          taskStatusList: [...formValues.priority],
        });
      } else if (selectedOption === "tag") {
        await updateTagList(projectId, {
          tagList: [...formValues.priority],
        });
      }
      // else if (selectedOption === "issueStatus") {
      //    await updateIssueStatus(projectId, formValues.priority);
      //  } else if (selectedOption === "taskStatus") {
      //    await updateTaskStatus(projectId, formValues.priority);
      //  } else if (selectedOption === "tag") {
      //    await updateTags(projectId, formValues.priority);
      //  }

      // Update the submitted values state with the current form values
      setSubmittedValues(formValues);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div>
      <ConfigurationBox>
        <SideMenuConfig>
          {config.map((item: any, index: any) => {
            return (
              <MenuOuterOptionContainer isActive={item.isActive}>
                <MenuOptionContainer
                  key={item.id}
                  isActive={item.isActive}
                  //   className={`item ${
                  //     item.isActive ? "activeProjectConfig" : ""
                  //   }`}
                  className={"project_config_active"}
                  onClick={() => handleOptionClick(item.id)}
                >
                  <MenuOptionSelected isActive={item.isActive}>
                    {item.title}
                  </MenuOptionSelected>
                </MenuOptionContainer>
              </MenuOuterOptionContainer>
            );
          })}
        </SideMenuConfig>
        <ProjectConfigContent>
          <AvailableStateHeader>Available States</AvailableStateHeader>
          {config.map(
            (option: any) =>
              option.isActive && (
                <div key={option.id}>
                  <form>
                    {formValues?.priority?.map(
                      (element: any, index: number) => {
                        return (
                          <div>
                            <TextFieldContainer
                              onMouseEnter={() => handleHover(index)}
                              onMouseLeave={() => handleHover(-1)}
                              isHovered={hoveredIndex === index}
                            >
                              {/* <input type="text" name="name" /> */}

                              <CustomTextField
                                hoveredIndex={hoveredIndex}
                                width={"380px"}
                                height={"44px"}
                                backgroundColor={
                                  hoveredIndex === index ? "#FFF5EF" : "white"
                                }
                                marginTop={"20px"}
                                paddingTop={"20px"}
                                marginLeft={"20px"}
                                type={"text"}
                                defaultValue={element}
                                onChange={(e: any) => {
                                  handleTextChange(
                                    e,
                                    option.id,
                                    element,
                                    index
                                  );

                                  // if (data.id === "password" && data.checkPasswordStrength) {
                                  //   checkPassword(data?.defaultValue, data.id, e);
                                  // }
                                }}
                              />

                              {hoveredIndex === index && (
                                <>
                                  {formValues.priority.length > 1 ? (
                                    <RemoveButton
                                      onClick={() => handleDeleteField(index)}
                                    >
                                      <RemoveLogo
                                        src={removeButton}
                                        alt="remove"
                                      />
                                    </RemoveButton>
                                  ) : (
                                    <div style={{ width: "24px" }}></div>
                                  )}

                                  <AddButton
                                    onClick={() => handleAddField(index)}
                                  >
                                    <AddLogo src={addButton} alt="remove" />
                                  </AddButton>
                                </>
                              )}

                              {/* </AddButtonContainer> */}
                            </TextFieldContainer>
                            {index == formValues?.priority?.length - 1 ? (
                              <div
                                style={{ height: "40px", width: "100%" }}
                              ></div>
                            ) : null}
                          </div>
                        );
                      }
                    )}
                  </form>
                </div>
              )
          )}
        </ProjectConfigContent>

        {/* </div> */}
      </ConfigurationBox>
    </div>
  );
};

export default ProjectConfig;
