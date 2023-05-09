import React, { useEffect, useState } from "react";
import ResetIcon from "../../../public/divami_icons/reset.svg";
import Checked from "../../../public/divami_icons/checked.svg";
import Indeterminate from "../../../public/divami_icons/indeterminate.svg";
import UnChecked from "../../../public/divami_icons/unchecked.svg";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
import NotificationNewIcon from "../../../public/divami_icons/NotificationNewIcon.svg";
import newRefreshIcon from "../../../public/divami_icons/newRefreshIcon.svg";

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
  FilterFooter,
  FilterCardSecondContainer,
  FilterCardSelectAllTextHeader,
  RefreshIcon,
  CloseIcon,
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
import closeWithCircle from "../../../public/divami_icons/closeWithCircle.svg";

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
  setIssueFilterState: any;
  checkIsFilter: any;
}

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
  setIssueFilterState,
}) => {
  useEffect(() => {}, [
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
    setIssueFilterState,
  ]);

  const Filters = [
    {
      title: "Type",
      selectAllStatus: "F",
      options: [
        { optionTitle: "Safety", optionStatus: "F" },
        { optionTitle: "BuildingCode", optionStatus: "F" },
        { optionTitle: "Clash", optionStatus: "F" },
        { optionTitle: "Commissioning", optionStatus: "F" },
        { optionTitle: "Design", optionStatus: "F" },
      ],
    },
    {
      title: "Priority",
      selectAllStatus: "F",
      options: [
        { optionTitle: "Low", optionStatus: "F" },
        { optionTitle: "Medium", optionStatus: "F" },
        { optionTitle: "High", optionStatus: "F" },
      ],
    },
    {
      title: "Status",
      selectAllStatus: "F",
      options: [
        { optionTitle: "In Progress", optionStatus: "F" },
        { optionTitle: "Blocked", optionStatus: "F" },
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
    listOfEntries: [],
    selectedName: issueFilterState?.filterData?.assigneesData?.user || null,
    label: "Select Name or Team",
  };
  const [assignee, setAssignees] = useState([assignees]);
  // const handleClose = () => {
  //   onClose(true);
  // };

  const onFilterApply = () => {
    let data: any = {};
    data.issueTypeData = [];
    data.issuePriorityData = [];
    data.issueStatusData = [];

    data.assigneesData = assignee[0]?.selectedName;

    FilterState.forEach((item: any) => {
      if (item.title == "Type") {
        const x = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        x.forEach((element: any) => {
          data.issueTypeData.push(element.optionTitle);
        });
      } else if (item.title == "Priority") {
        const z = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        z.forEach((element: any) => {
          data.issuePriorityData.push(element.optionTitle);
        });
      } else if (item.title == "Status") {
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

    const { issuePriorityData, issueStatusData, issueTypeData, ...restObj } =
      data;
    const isArrEmpty: Boolean =
      issuePriorityData?.length === 0 &&
      issueStatusData?.length === 0 &&
      issueTypeData?.length === 0;
    const isEmpty = Object.values(restObj).every((x) => x === null || x === "");

    if (isArrEmpty && isEmpty) {
      onReset();
      handleClose();
    } else {
      handleOnFilter(data);
    }
  };
  const formHandler = (event: any) => {
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
        }
      });
      getIssuesPriority(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskPriority(
            response.result.filter(
              (item: any) =>
                item === "High" || item === "Low" || item === "Medium"
            )
          );
        }
      });
      getProjectUsers(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setProjectUsers(response.result);
          }
        })
        .catch();
      getIssuesStatus(router.query.projectId as string).then((response) => {
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
        if (item.title === "Type") {
          let selectAllStatus = "F";
          if (issueFilterState.isFilterApplied) {
            if (
              item.options?.length ===
              issueFilterState.filterData.issueTypeData?.length
            ) {
              selectAllStatus = "T";
            } else if (issueFilterState.filterData?.issueTypeData?.length) {
              selectAllStatus = "I";
            }
          }
          return {
            ...item,
            selectAllStatus: selectAllStatus,
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
        if (item.title === "Priority") {
          let selectAllStatus = "F";
          if (issueFilterState.isFilterApplied) {
            if (
              item.options?.length ===
              issueFilterState.filterData.issuePriorityData?.length
            ) {
              selectAllStatus = "T";
            } else if (issueFilterState.filterData?.issuePriorityData?.length) {
              selectAllStatus = "I";
            }
          }
          return {
            ...item,
            selectAllStatus: selectAllStatus,
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
        if (item.title === "Status") {
          let selectAllStatus = "F";
          if (issueFilterState.isFilterApplied) {
            if (
              item.options?.length ===
              issueFilterState.filterData.issueStatusData?.length
            ) {
              selectAllStatus = "T";
            } else if (issueFilterState.filterData?.issueStatusData?.length) {
              selectAllStatus = "I";
            }
          }
          return {
            ...item,
            selectAllStatus: selectAllStatus,
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

  return (
    <FilterCommonMain>
      <FilterCommonHeader>
        <HeaderContainer>
          <TitleContainer>
            <HeaderLeftSection>
              <HeaderLeftSectionText data-testid="filter-title">
                Filters
              </HeaderLeftSectionText>
            </HeaderLeftSection>
            <HeaderRightSection>
              <HeaderRightSectionResetIcon>
                <RefreshIcon
                  src={newRefreshIcon}
                  alt="reset"
                  onClick={() => {
                    onReset();
                  }}
                  data-testid="filter-refresh"
                />
                {/* <Image
                  src={ResetIcon}
                  alt="reset"
                  onClick={() => {
                    onReset();
                  }}
                /> */}
              </HeaderRightSectionResetIcon>
              <HeaderRightSectionResetText>Reset</HeaderRightSectionResetText>
              {/* <Image src={closeIcon} alt="reset"   onClick={() => {
              handleClose();
              }} /> */}
              <CloseIcon
                onClick={() => {
                  handleClose();
                }}
                src={closeWithCircle}
                alt={"close icon"}
                data-testid="filter-close"
              />
            </HeaderRightSection>
          </TitleContainer>
        </HeaderContainer>
      </FilterCommonHeader>
      <FilterCommonBody>
        {FilterState?.map((each: any, index: any) => {
          console.log("each", each);

          return each.title === "Issue Type" ? (
            <FilterCardContainer key={index}>
              <FilterCardTitle>
                {/* <FilterCardTitleText>{each?.title}</FilterCardTitleText> */}
              </FilterCardTitle>
              <FilterCardSelectAll>
                {each?.selectAllStatus === "T" ? (
                  <FilterCardSelectAllSpan>
                    <Image
                      onClick={() => {
                        handleAllSelection(each, index);
                      }}
                      src={Checked}
                      alt="checked checkbox"
                      data-testid="filter-select-all"
                    />
                    <FilterCardSelectAllTextHeader>
                      {each.title}
                    </FilterCardSelectAllTextHeader>
                  </FilterCardSelectAllSpan>
                ) : each?.selectAllStatus === "F" ? (
                  <FilterCardSelectAllSpan>
                    <Image
                      onClick={() => {
                        handleAllSelection(each, index);
                      }}
                      src={UnChecked}
                      alt="unchecked checkbox"
                      data-testid="filter-select-all"
                    />
                    <FilterCardSelectAllTextHeader>
                      {each.title}
                    </FilterCardSelectAllTextHeader>
                  </FilterCardSelectAllSpan>
                ) : each?.selectAllStatus === "I" ? (
                  <FilterCardSelectAllSpan>
                    <Image
                      onClick={() => {
                        handleAllSelection(each, index);
                      }}
                      src={Indeterminate}
                      alt="reset"
                      data-testid="filter-select-all"
                    />
                    <FilterCardSelectAllTextHeader>
                      {each.title}
                    </FilterCardSelectAllTextHeader>
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
                            alt="checked checkbox"
                            data-testid="filter-select-each"
                          />
                        ) : item?.optionStatus === "F" ? (
                          <Image
                            onClick={() => {
                              handleOptionSelection(item, index);
                            }}
                            src={UnChecked}
                            alt="unchecked checkbox"
                            data-testid="filter-select-each"
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
          ) : (
            <FilterCardSecondContainer key={index}>
              <FilterCardTitle>
                {/* <FilterCardTitleText>{each?.title} hii</FilterCardTitleText> */}
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
                    <FilterCardSelectAllTextHeader>
                      {each?.title}
                    </FilterCardSelectAllTextHeader>
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
                    <FilterCardSelectAllTextHeader>
                      {each?.title}
                    </FilterCardSelectAllTextHeader>
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
                    <FilterCardSelectAllTextHeader>
                      {each?.title}
                    </FilterCardSelectAllTextHeader>
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
            </FilterCardSecondContainer>
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
                <CustomLabel label={"Start date"} />
                <IssueFilterFormWrapper
                  config={startDate}
                  setFormConfig={setStartData}
                />
              </div>
            </DatePickerContainer>
            <div>
              <CustomLabel label={"Due date"} />
              <IssueFilterFormWrapper
                config={dueDate}
                setFormConfig={setDueData}
              />
            </div>
          </DatePickersContainer>
        </FormElementContainer>
      </FilterCommonBody>

      <FilterFooter>
        <ButtonsContainer>
          <CustomButton
            type="outlined"
            label="Cancel"
            formHandler={formHandler}
            dataTestid="filter-cancel"
          />
          <CustomButton
            type="contained"
            label="Apply"
            formHandler={formHandler}
            dataTestid="filter-apply"
          />
        </ButtonsContainer>
      </FilterFooter>
    </FilterCommonMain>
  );
};

export default FilterCommon;
