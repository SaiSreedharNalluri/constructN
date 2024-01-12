import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import addButton from "../../../public/divami_icons/addButton.svg";
import removeButton from "../../../public/divami_icons/removeButton.svg";
import {
  getIssuePriorityList,
  getIssueStatusList,
  getTagsList,
  getTaskPriorityList,
  getTaskStatusList
} from "../../../services/projectConfigApi";
import { CustomTextField } from "../custom-textfield/CustomTextField";
import {
  AddButton,
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
  TextFieldContainer
} from "./ProjectConfigStyles";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
const ProjectConfig = ({
  projectId,
  selectedOption,
  setSelectedOption,
  formValues,
  setFormValues,
  setShowbutton,
}: any) => {
  const customLogger = new CustomLoggerClass();
  const [config, setConfig]: any = React.useState([
    {
      id: "issuePriority",
      title: "Issue Priority",
      isActive: true,
      nextPage: "",
      isError: false,
      errorMessageText: "",
      //   toolTipMsg: "Dashboard & Reports",
    },
    {
      id: "taskPriority",
      title: "Task Priority",

      isActive: false,
      nextPage: "",
      toolTipMsg: "Drawings",
      isError: false,
      errorMessageText: "",
    },

    {
      id: "issueStatus",
      title: "Issue Status",

      isActive: false,
      toolTipMsg: "Schedule",
      isError: false,
      errorMessageText: "",
    },
    {
      id: "taskStatus",
      title: "Task Status",

      isActive: false,
      toolTipMsg: "Users",
      isError: false,
      errorMessageText: "",
    },
    {
      id: "tag",
      title: "Tags",

      isActive: false,
      toolTipMsg: "Users",
      isError: false,
      errorMessageText: "",
    },
  ]);

  const [submittedValues, setSubmittedValues] = useState({});
  // const [selectedOption, setSelectedOption] = useState("Issue Priority");

  // const [formValues, setFormValues]: any = useState({ priority: [] });
  const [priorityArr, setPriorityArr] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorIndex, setErrorIndex] = useState(-1);

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
  const getErrorMessage = (e: any, index: any) => {
    const value = e;

    // Check for empty value
    if (value.trim().length === 0) {
      return "Field(s) cannot be empty";
    } else if (value.trim().length > 14) {
      return "Field cannot exceed 14 characters";
    } else if (!/^(?:[a-zA-Z]+|\d+|[a-zA-Z0-9\s]+)$/.test(value)) {
      return "Field can only contain alphabets or numerics";
    } else {
      return "";
    }
  };
  const handleTextChange = (e: any, id: any, element: any, index: any) => {
    const { value } = e.target;
    const trimmedValue = value.trim();

    // Check for empty value
    if (trimmedValue.trim().length === 0) {
      // setErrorMsg("Field cannot be empty");
      setErrorIndex(index);
    } else if (trimmedValue.trim().length > 30) {
      // setErrorMsg("Field cannot exceed 30 characters");
      return "Field can only contain alphabets or numerics";
    } else {
      // setErrorMsg("");
      setErrorIndex(-1);
    }

    //setErrorMsg(""); // Clear the error if input is not empty

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
    setShowbutton(
      value.trim().length > 0 &&
        value.trim().length <= 14 &&
        /^(?:[a-zA-Z]+|\d+|[a-zA-Z0-9\s]+)$/.test(value)
    );
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

  return (
    <div>
      <ConfigurationBox>
        <SideMenuConfig>
          {config.map((item: any, index: any) => {
            return (
              <MenuOuterOptionContainer isActive={item.isActive} key={index}>
                <MenuOptionContainer
                  key={item.id}
                  isActive={item.isActive}
                  //   className={`item ${
                  //     item.isActive ? "activeProjectConfig" : ""
                  //   }`}
                  className={"project_config_active"}
                  onClick={() =>{ customLogger.logInfo(`${item.title} - View`); handleOptionClick(item.id)}}
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
          <AvailableStateHeader>Available Options</AvailableStateHeader>
          {config.map(
            (option: any) =>
              option.isActive && (
                <div key={option.id}>
                  <form>
                    {formValues?.priority?.map(
                      (element: any, index: number) => {
                        return (
                          <div key={index}>
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
                                errorPriority={getErrorMessage(element, index)}
                              />
                              {/* {error && <span>{error}</span>} */}

                              {hoveredIndex === index && (
                                <>
                                  {formValues.priority.length > 1 ? (
                                    <RemoveButton
                                      onClick={() => handleDeleteField(index)}
                                      errorPriority={getErrorMessage(
                                        element,
                                        index
                                      )}
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
                                    errorPriority={getErrorMessage(
                                      element,
                                      index
                                    )}
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
