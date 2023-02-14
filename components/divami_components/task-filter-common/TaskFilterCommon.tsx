import React, { useEffect, useState } from "react";
import ResetIcon from "../../../public/divami_icons/reset.svg";
import Checked from "../../../public/divami_icons/checked.svg";
import Indeterminate from "../../../public/divami_icons/indeterminate.svg";
import UnChecked from "../../../public/divami_icons/unchecked.svg";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import Autocomplete from "@mui/material/Autocomplete";

const CustomAutoComplete = styled(Autocomplete)({
  border: "1px solid #36415d",
  borderRadius: "6px",
  "& .MuiAutocomplete-root": {
    width: "398px",
    height: "40px",
  },
  "& .MuiAutocomplete-endAdornment": {
    display: "none",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root.Mui-focused": {
    border: 0,
    display: "none",
    offset: "none",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "0",
    padding: "0",
  },
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: 0,
    ouline: "none",
    offset: 0,
  },
  "& .MuiFormLabel-root.MuiInputLabel-root": {
    display: "none",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    ouline: "none",
  },
  "& .MuiInputAdornment-root": {
    paddingLeft: "15px",
  },
});

import Image from "next/image";
import {
  HeaderContainer,
  HeaderLeftSection,
  HeaderLeftSectionText,
  HeaderRightSection,
  HeaderRightSectionResetIcon,
  HeaderRightSectionResetText,
  HeaderRightSectionCancel,
  FilterCardContainer,
  FilterCardTitle,
  FilterCardTitleText,
  FilterCardSelectAll,
  FilterCardSelectAllSpan,
  FilterCardSelectAllText,
  FilterCardOptions,
  FilterCardOptionContainer,
  FilterCardOptionSpan,
  FilterCommonMain,
  FilterCommonHeader,
  FilterCommonBody,
  FilterCommonFooter,
  TitleContainer,
  FormElementContainer,
  StyledLabel,
  DrawerSearchBar,
  DatePickersContainer,
  DatePickerContainer,
  ButtonsContainer,
} from "./StyledComponent";
import { Issue } from "../../../models/Issue";
import { ITasks } from "../../../models/Itask";
import {
  getTasksList,
  getTasksPriority,
  getTaskStatus,
  getTasksTypes,
} from "../../../services/task";
import { CustomSearchField } from "../select-types/StyledComponents";
import CustomSearch from "../custom-search/CustomSearch";
import { mockData } from "../project-hierarchy/mockData";
import { SearchContainer } from "../project-hierarchy/StyledComponents";
import CustomLabel from "../custom-label/CustomLabel";
import FormWrapper from "../form-wrapper/FormWrapper";
import { DATE_PICKER_DATA, SEARCH_CONFIG } from "../create-task/body/Constants";
import CustomButton from "../custom-button/CustomButton";
import router from "next/router";
import TaskFilterFormWrapper from "./TaskFilterWrapper";

import { IProjectUsers } from "../../../models/IProjects";
import { getProjectUsers } from "../../../services/project";
interface IProps {
  closeOverlay?: () => void;
  visibility?: boolean;
  handleOnFilter: (formData: object) => void;
  handleOnSort?: (sortMethod: string) => void;
  closeFilterOverlay?: () => void;
  deleteTheIssue?: (issueObj: object) => void;
  clickIssueEditSubmit?: (editObj: object, issueObj: object) => void;
  onClose?: any;
  tasksList: any;
  taskType: any;
  taskPriority: any;
  taskStatus: any;
  projectUsers: any;
}

// const Footer = () => {
//   return <>Footer</>;
// };
const CloseIcon = styled(Image)({
  cursor: "pointer",
});
const TaskFilterCommon: React.FC<any> = ({
  tasksList,
  onClose,
  taskType,
  taskPriority,
  taskStatus,
  projectUsers,
  // taskMenuClicked,
  // currentProject,
  // currentStructure,
  // currentSnapshot,
  // closeTaskFilterOverlay,
  handleOnFilter,
}) => {
  // console.log("tasksListapi", tasksList);
  const [startDate, setStartData] = useState(DATE_PICKER_DATA);
  const [dueDate, setDueData] = useState(DATE_PICKER_DATA);
  const [taskTypes, setTaskType] = useState<[string]>();
  const [taskPrioritys, setTaskPriority] = useState<[string]>();
  const [projectUserss, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [taskStatuss, setTaskStatus] = useState<[string]>();

  const Filters = [
    {
      title: "Issue Type",
      selectAllStatus: "T",
      options: [
        { optionTitle: "safety", optionStatus: "T" },
        { optionTitle: "buildingCode", optionStatus: "T" },
        { optionTitle: "clash", optionStatus: "F" },
        { optionTitle: "commissioning", optionStatus: "T" },
        { optionTitle: "design", optionStatus: "F" },
      ],
    },
    {
      title: "Issue Priority",
      selectAllStatus: "T",
      options: [
        { optionTitle: "Low", optionStatus: "T" },
        { optionTitle: "Medium", optionStatus: "T" },
        { optionTitle: "High", optionStatus: "F" },
      ],
    },
    {
      title: "Issue Status",
      selectAllStatus: "T",
      options: [
        { optionTitle: "In Progress", optionStatus: "T" },
        { optionTitle: "Blocked", optionStatus: "T" },
        { optionTitle: "To-do", optionStatus: "F" },
        { optionTitle: "Completed", optionStatus: "F" },
      ],
    },
  ];

  const assignees = {
    id: "assignes",
    type: "search",
    listOfEntries: [
      { label: "The Shawshank Redemption", year: 1994 },
      { label: "The Godfather", year: 1972 },
      { label: "The Godfather: Part II", year: 1974 },
      { label: "The Dark Knight", year: 2008 },
      { label: "12 Angry Men", year: 1957 },
      { label: "Schindler's List", year: 1993 },
    ],
    selectedName: null,
    label: "Select Name or Team",
  };
  const [assignee, setAssignees] = useState([assignees]);
  const handleClose = () => {
    onClose(true);
  };

  useEffect(() => {
    if (router.isReady) {
      getTasksTypes(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskType(response.result);
        }
      });
      getTasksPriority(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskPriority(response.result);
        }
      });
      getProjectUsers(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setProjectUsers(response.result);
          }
        })
        .catch();
      getTaskStatus(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskStatus(response.result);
        }
      });
    }
    // const filterArray =
    // SetFilterState(filterArray)
  }, []);
  useEffect(() => {
    SetFilterState((prev: any) => {
      return prev.map((item: any) => {
        if (item.title === "Issue Type") {
          return {
            ...item,
            options: taskTypes?.map((eachItem: any) => {
              return {
                ...eachItem,
                optionTitle: eachItem,
                optionStatus: "F",
              };
            }),
          };
        }
        if (item.title === "Issue Priority") {
          return {
            ...item,
            options: taskPrioritys?.map((eachItem: any) => {
              return {
                ...eachItem,
                optionTitle: eachItem,
                optionStatus: "F",
              };
            }),
          };
        }
        if (item.title === "Issue Status") {
          return {
            ...item,
            options: taskStatuss?.map((eachItem: any) => {
              return {
                ...eachItem,
                optionTitle: eachItem,
                optionStatus: "F",
              };
            }),
          };
        }
        return item;
      });
    });
    setAssignees((prev: any) => {
      return prev.map((item: any) => {
        return {
          ...item,
          listOfEntries: projectUserss?.map((eachUser: any) => {
            return {
              ...eachUser,
              label: eachUser?.user?.fullName,
              value: eachUser?.user?._id,
            };
          }),
        };
      });
    });
  }, [taskTypes, taskStatuss, projectUserss, taskPrioritys]);
  if (projectUserss?.length > 0) {
    projectUserss?.map((projectUser: any) => {
      // usersList.push({
      //   _id: projectUser?.user?._id,
      //   name: projectUser?.user?.fullName,
      // });
    });
  }
  const [FilterState, SetFilterState] = useState<any>(Filters);
  const [optionState, setOptionState] = useState<any>("clash");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [treeViewData, setTreeViewData] = useState<any>(mockData);

  // Select All Handling
  const handleAllSelection = (item: any, index: number) => {
    let temp = FilterState.map((item: any, serial: any) => {
      if (serial === index) {
        if (item.selectAllStatus === "T" || item.selectAllStatus === "I") {
          let optionTemp = item.options.map((option: any) => {
            return {
              ...option,
              optionStatus: "F",
            };
          });
          return {
            ...item,
            selectAllStatus: "F",
            options: optionTemp,
          };
        } else {
          let optionTemp = item.options.map((option: any) => {
            return {
              ...option,
              optionStatus: "T",
            };
          });
          return {
            ...item,
            selectAllStatus: "T",
            options: optionTemp,
          };
        }
      }
      return {
        ...item,
      };
    });
    SetFilterState(temp);
    console.log(temp);
  };

  const handleOptionSelection = (item: any, index: any) => {
    let tempOption;
    if (item?.optionStatus === "T") {
      let temp = FilterState?.map((each: any, serial: number) => {
        if (serial === index) {
          tempOption = each?.options?.map((obj: any) => {
            if (obj?.optionTitle === item?.optionTitle) {
              return {
                ...obj,
                optionStatus: "F",
              };
            } else {
              return {
                ...obj,
              };
            }
          });
          return {
            ...each,
            options: tempOption,
          };
        } else {
          return {
            ...each,
          };
        }
      });
      setOptionState(item.optionTitle);
      SetFilterState(temp);
      console.log(temp);
    } else {
      let temp = FilterState?.map((each: any, serial: number) => {
        if (serial === index) {
          tempOption = each?.options?.map((obj: any) => {
            if (obj?.optionTitle === item?.optionTitle) {
              return {
                ...obj,
                optionStatus: "T",
              };
            } else {
              return {
                ...obj,
              };
            }
          });
          return {
            ...each,
            options: tempOption,
          };
        } else {
          return {
            ...each,
          };
        }
      });
      setOptionState(item.optionTitle);
      SetFilterState(temp);
      console.log(temp);
    }
  };

  const onFilterApply = () => {
    console.log(FilterState);
    let data: any = {};
    data.taskType = [];
    data.taskPriority = [];
    data.taskStatus = [];
    data.assigneesData = assignee[0]?.selectedName;
    FilterState.forEach((item: any) => {
      if (item.title == "Issue Type") {
        const x = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        x.forEach((element: any) => {
          data.taskType.push(element.optionTitle);
        });
      } else if (item.title == "Issue Priority") {
        const z = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        z.forEach((element: any) => {
          data.taskPriority.push(element.optionTitle);
        });
      } else if (item.title == "Issue Status") {
        const y = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        y.forEach((element: any) => {
          data.taskStatus.push(element.optionTitle);
        });
      }
    });
    data.fromDate = startDate[0].defaultValue;
    data.toDate = dueDate[0].defaultValue;
    console.log(data);
    handleOnFilter(data);
  };
  useEffect(() => {
    let flag = false;
    for (const [i, outerObject] of FilterState.entries()) {
      for (const innerObject of outerObject.options) {
        if (innerObject.optionTitle === optionState) {
          setSelectedCategoryIndex(i);
          setOptionState(outerObject);
          flag = true;
          break;
        }
      }
      if (flag) {
        break;
      }
    }
    let count;
    let temp = FilterState.map((each: any, index: any) => {
      if (selectedCategoryIndex === index || selectedCategoryIndex === null) {
        count = each?.options?.filter((obj: any) => obj?.optionStatus === "T");
        if (count?.length !== 0 && count?.length !== each?.options?.length) {
          return {
            ...each,
            selectAllStatus: "I",
          };
        } else {
          if (count.length === 0) {
            return {
              ...each,
              selectAllStatus: "F",
            };
          } else if (count.length === each.options?.length) {
            return {
              ...each,
              selectAllStatus: "T",
            };
          }
        }
      } else {
        return {
          ...each,
        };
      }
    });
    SetFilterState(temp);
  }, [optionState]);

  const formHandler = (event: any) => {
    console.log("sdf");
    if (event === "Cancel") {
      handleClose();
    } else {
      onFilterApply();
      handleClose();
    }
  };
  // console.log("tasksList",tasksList)
  return (
    <FilterCommonMain>
      <FilterCommonHeader>
        <HeaderContainer>
          <TitleContainer>
            <HeaderLeftSection>
              <HeaderLeftSectionText>Filters</HeaderLeftSectionText>
            </HeaderLeftSection>
            <HeaderRightSection>
              <HeaderRightSectionResetIcon>
                <Image src={ResetIcon} alt="reset" />
              </HeaderRightSectionResetIcon>
              <HeaderRightSectionResetText>Reset</HeaderRightSectionResetText>
              {/* <Image src={closeIcon} alt="reset" onClick={() => {
              handleClose();
            }}/> */}
              <CloseIcon
                onClick={() => {
                  handleClose();
                }}
                src={closeIcon}
                alt={"close icon"}
              />
            </HeaderRightSection>
          </TitleContainer>
        </HeaderContainer>
      </FilterCommonHeader>
      <FilterCommonBody>
        {FilterState?.map((each: any, index: any) => {
          return (
            <FilterCardContainer key={index}>
              <FilterCardTitle>
                <FilterCardTitleText>{each?.title}</FilterCardTitleText>
              </FilterCardTitle>
              <FilterCardSelectAll>
                {each?.selectAllStatus === "T" ? (
                  <FilterCardSelectAllSpan>
                    <Image
                      onClick={() => {
                        handleAllSelection(each, index);
                      }}
                      src={Checked}
                      alt="reset"
                    />
                    <FilterCardSelectAllText>
                      Select All
                    </FilterCardSelectAllText>
                  </FilterCardSelectAllSpan>
                ) : each?.selectAllStatus === "F" ? (
                  <FilterCardSelectAllSpan>
                    <Image
                      onClick={() => {
                        handleAllSelection(each, index);
                      }}
                      src={UnChecked}
                      alt="reset"
                    />
                    <FilterCardSelectAllText>
                      Select All
                    </FilterCardSelectAllText>
                  </FilterCardSelectAllSpan>
                ) : each?.selectAllStatus === "I" ? (
                  <FilterCardSelectAllSpan>
                    <Image
                      onClick={() => {
                        handleAllSelection(each, index);
                      }}
                      src={Indeterminate}
                      alt="reset"
                    />
                    <FilterCardSelectAllText>
                      Select All
                    </FilterCardSelectAllText>
                  </FilterCardSelectAllSpan>
                ) : (
                  ""
                )}
              </FilterCardSelectAll>
              <FilterCardOptions>
                {each?.options?.map((item: any, index: number) => {
                  return (
                    <FilterCardOptionContainer key={index}>
                      <FilterCardOptionSpan>
                        {item?.optionStatus === "T" ? (
                          <Image
                            onClick={() => {
                              handleOptionSelection(item, index);
                            }}
                            src={Checked}
                            alt="reset"
                          />
                        ) : item?.optionStatus === "F" ? (
                          <Image
                            onClick={() => {
                              handleOptionSelection(item, index);
                            }}
                            src={UnChecked}
                            alt=""
                          />
                        ) : (
                          ""
                        )}

                        <FilterCardSelectAllText>
                          {item?.optionTitle}
                        </FilterCardSelectAllText>
                      </FilterCardOptionSpan>
                    </FilterCardOptionContainer>
                  );
                })}
              </FilterCardOptions>
            </FilterCardContainer>
          );
        })}

        <FormElementContainer>
          <CustomLabel label={"Assigned To"} />
          <TaskFilterFormWrapper
            config={assignee}
            setFormConfig={setAssignees}
          />
        </FormElementContainer>

        <FormElementContainer>
          <DatePickersContainer>
            <DatePickerContainer>
              <div>
                <CustomLabel label={"Start Date"} />
                <TaskFilterFormWrapper
                  config={startDate}
                  setFormConfig={setStartData}
                />
              </div>
            </DatePickerContainer>
            <div>
              <CustomLabel label={"Due Date"} />
              <TaskFilterFormWrapper
                config={dueDate}
                setFormConfig={setDueData}
              />
            </div>
          </DatePickersContainer>
        </FormElementContainer>

        <ButtonsContainer>
          <CustomButton
            type="outlined"
            label="Cancel"
            formHandler={formHandler}
          />
          <CustomButton
            type="contained"
            formHandler={formHandler}
            label="Apply"
          />
        </ButtonsContainer>
      </FilterCommonBody>
    </FilterCommonMain>
  );
};

export default TaskFilterCommon;
// export default Body
