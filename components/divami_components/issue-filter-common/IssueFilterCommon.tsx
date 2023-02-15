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
  DatePickersContainer,
  DatePickerContainer,
} from "./IssueStyledComponent";
import { Issue } from "../../../models/Issue";
import { DATE_PICKER_DATA, SEARCH_CONFIG } from "../create-task/body/Constants";
// import Fil from "../form-wrapper/FormWrapper";
import IssueFilterFormWrapper from "./IssueFilterWrapper";
import CustomLabel from "../custom-label/CustomLabel";
import { ButtonsContainer } from "../task-filter-common/StyledComponent";
import CustomButton from "../custom-button/CustomButton";
import router from "next/router";
import { IProjectUsers } from "../../../models/IProjects";
import {
  getIssuesPriority,
  getIssuesStatus,
  getIssuesTypes,
} from "../../../services/issue";
import { getProjectUsers } from "../../../services/project";

interface IProps {
  closeOverlay: () => void;
  issuesList: Issue[];
  visibility: boolean;
  handleOnFilter: (formData: object) => void;
  handleOnSort: (sortMethod: string) => void;
  closeFilterOverlay: () => void;
  deleteTheIssue: (issueObj: object) => void;
  clickIssueEditSubmit: (editObj: object, issueObj: object) => void;
  onClose: any;
  issueFilterState: any;
}

const Footer = () => {
  return <>Footer</>;
};

const FilterCommon: React.FC<IProps> = ({
  visibility,
  closeOverlay,
  issuesList,
  handleOnFilter,
  handleOnSort,
  closeFilterOverlay,
  deleteTheIssue,
  clickIssueEditSubmit,
  onClose,
  issueFilterState,
}) => {
  const Filters = [
    {
      title: "Issue Type",
      selectAllStatus: "T",
      options: [
        { optionTitle: "Safety", optionStatus: "T" },
        { optionTitle: "BuildingCode", optionStatus: "T" },
        { optionTitle: "Clash", optionStatus: "F" },
        { optionTitle: "Commissioning", optionStatus: "T" },
        { optionTitle: "Design", optionStatus: "F" },
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

  const [FilterState, SetFilterState] = useState<any>(Filters);
  const [optionState, setOptionState] = useState<any>("clash");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [startDate, setStartData] = useState(DATE_PICKER_DATA);
  const [dueDate, setDueData] = useState(DATE_PICKER_DATA);
  const [taskType, setTaskType] = useState<[string]>();
  const [taskPriority, setTaskPriority] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [taskStatus, setTaskStatus] = useState<[string]>();
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
  // const handleClose = () => {
  //   onClose(true);
  // };
  const onFilterApply = () => {
    console.log(FilterState);
    let data: any = {};
    data.issueTypeData = [];
    data.issuePriorityData = [];
    data.issueStatusData = [];

    data.assigneesData = assignee[0]?.selectedName;
    FilterState.forEach((item: any) => {
      if (item.title == "Issue Type") {
        const x = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        x.forEach((element: any) => {
          data.issueTypeData.push(element.optionTitle);
        });
      } else if (item.title == "Issue Priority") {
        const z = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        z.forEach((element: any) => {
          data.issuePriorityData.push(element.optionTitle);
        });
      } else if (item.title == "Issue Status") {
        const y = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        y.forEach((element: any) => {
          data.issueStatusData.push(element.optionTitle);
        });
      }
    });
    data.fromDate = startDate[0].defaultValue;
    data.toDate = dueDate[0].defaultValue;
    console.log(data);
    handleOnFilter(data);
  };
  const formHandler = (event: any) => {
    console.log("sdf");
    if (event === "Cancel") {
      handleClose();
    } else {
      onFilterApply();
      handleClose();
    }
  };
  useEffect(() => {
    if (router.isReady) {
      getIssuesTypes(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskType(response.result);
          console.log(taskType);
        }
      });
      getIssuesPriority(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskPriority(response.result);
          console.log(taskPriority);
        }
      });
      getProjectUsers(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setProjectUsers(response.result);
            console.log(projectUsers);
          }
        })
        .catch();
      getIssuesStatus(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskStatus(response.result);
          console.log(taskStatus);
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
            options: taskType?.map((eachItem: any) => {
              if (issueFilterState.isFilterApplied) {
                if (
                  issueFilterState.filterData.issueTypeData.includes(eachItem)
                ) {
                  return {
                    ...eachItem,
                    optionTitle: eachItem,
                    optionStatus: "T",
                  };
                }
              }
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
            options: taskPriority?.map((eachItem: any) => {
              if (issueFilterState.isFilterApplied) {
                if (
                  issueFilterState.filterData.issuePriorityData.includes(
                    eachItem
                  )
                ) {
                  return {
                    ...eachItem,
                    optionTitle: eachItem,
                    optionStatus: "T",
                  };
                }
              }
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
            options: taskStatus?.map((eachItem: any) => {
              if (issueFilterState.isFilterApplied) {
                if (
                  issueFilterState.filterData.issueStatusData.includes(eachItem)
                ) {
                  return {
                    ...eachItem,
                    optionTitle: eachItem,
                    optionStatus: "T",
                  };
                }
              }
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
          listOfEntries: projectUsers?.map((eachUser: any) => {
            return {
              ...eachUser,
              label: eachUser?.user?.fullName,
              value: eachUser?.user?._id,
            };
          }),
        };
      });
    });
    if (issueFilterState.isFilterApplied) {
    }
    setStartData([
      {
        ...DATE_PICKER_DATA[0],
        defaultValue: issueFilterState.filterData.fromDate,
      },
    ]);
  }, [taskType, taskStatus, projectUsers, taskPriority]);
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
    }
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

  const handleClose = () => {
    onClose(true);
  };
  const CloseIcon = styled(Image)({
    cursor: "pointer",
  });
  const onReset = () => {
    let temp = FilterState?.map((each: any, serial: number) => {
      return { ...each };
    });
    temp.forEach((element: any) => {
      element?.options?.forEach((obj: any) => {
        obj.optionStatus = "F";
      });
    });
    setStartData(DATE_PICKER_DATA);
    setDueData(DATE_PICKER_DATA);
    setAssignees([assignees]);
    SetFilterState(temp);
    closeFilterOverlay();
    handleClose();
  };
  // console.log("issuesListfooter",issuesList)
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
                <Image
                  src={ResetIcon}
                  alt="reset"
                  onClick={() => {
                    onReset();
                  }}
                />
              </HeaderRightSectionResetIcon>
              <HeaderRightSectionResetText>Reset</HeaderRightSectionResetText>
              {/* <Image src={closeIcon} alt="reset"   onClick={() => {
              handleClose();
              }} /> */}
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
                {each?.options?.map((item: any, i: number) => {
                  return (
                    <FilterCardOptionContainer key={i}>
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
          <IssueFilterFormWrapper
            config={assignee}
            setFormConfig={setAssignees}
          />
        </FormElementContainer>

        <FormElementContainer>
          <DatePickersContainer>
            <DatePickerContainer>
              <div>
                <CustomLabel label={"Start Date"} />
                <IssueFilterFormWrapper
                  config={startDate}
                  setFormConfig={setStartData}
                />
              </div>
            </DatePickerContainer>
            <div>
              <CustomLabel label={"Due Date"} />
              <IssueFilterFormWrapper
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
            label="Apply"
            formHandler={formHandler}
          />
        </ButtonsContainer>
      </FilterCommonBody>
    </FilterCommonMain>
  );
};

export default FilterCommon;
// export default Body
