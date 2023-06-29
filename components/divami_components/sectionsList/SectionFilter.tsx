import React, { useEffect, useState } from "react";
import Checked from "../../../public/divami_icons/checked.svg";
import Indeterminate from "../../../public/divami_icons/indeterminate.svg";
import UnChecked from "../../../public/divami_icons/unchecked.svg";
import { styled } from "@mui/system";
import newRefreshIcon from "../../../public/divami_icons/newRefreshIcon.svg";
import closeWithCircle from "../../../public/divami_icons/closeWithCircle.svg";
import Image from "next/image";
import {
  HeaderContainer,
  HeaderLeftSection,
  HeaderLeftSectionText,
  HeaderRightSection,
  HeaderRightSectionResetIcon,
  HeaderRightSectionResetText,
  FilterCardContainer,
  FilterCardTitle,
  FilterCardSelectAll,
  FilterCardSelectAllSpan,
  FilterCardSelectAllText,
  FilterCardOptions,
  FilterCardOptionContainer,
  FilterCardOptionSpan,
  FilterCommonMain,
  FilterCommonHeader,
  FilterCommonBody,
  TitleContainer,
  FormElementContainer,
  DatePickersContainer,
  DatePickerContainer,
  ButtonsContainer,
  FilterCardSecondContainer,
  FilterFooter,
  FilterCardSelectAllTextHeader,
  FilterHeader,
} from "../../divami_components/task-filter-common/StyledComponent";
import { FilterProgressContainer } from "./SectionsListingStyles";
import CustomLabel from "../custom-label/CustomLabel";
import {
  DATE_PICKER_DATA,
  SEARCH_CONFIG,
  SECTION_FILTER_PROGRESS_CONFIG,
} from "../create-task/body/Constants";
import CustomButton from "../custom-button/CustomButton";
import TaskFilterFormWrapper from "../task-filter-common/TaskFilterWrapper";
import moment from "moment";
import CustomSelect from "../custom-select/CustomSelect";
import { customDropdown } from "./SectionsListingStyles";
import { CustomTextField } from "../custom-textfield/CustomTextField";

const CloseIcon = styled(Image)({
  cursor: "pointer",
  width: "24px",
  height: "24px",
});

const RefreshIcon = styled(Image)({
  cursor: "pointer",
  width: "18px",
  height: "15px",
});
const SectionFilter: React.FC<any> = ({
  onClose,
  tableData,
  setTaskFilterState,
  setSearchTableData,
  roles,
  taskFilterState,
}) => {
  const [startDate, setStartData] = useState(DATE_PICKER_DATA);
  const [dueDate, setDueData] = useState(DATE_PICKER_DATA);
  const [progressDropdown, setProgressDropdown]: any = useState(
    SECTION_FILTER_PROGRESS_CONFIG
  );
  const [optionState, setOptionState] = useState<any>("clash");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const Filters = [
    {
      title: "All",
      code: "roleType",
      selectAllStatus: "T",
      options: [...taskFilterState.filterData.roleType],
      // options: [
      //   { optionTitle: "System Admin", optionStatus: "F" },
      //   { optionTitle: "VDC Manager", optionStatus: "F" },
      //   { optionTitle: "Field Level Engineer", optionStatus: "F" },
      // ],
    },
  ];

  const handleClose = () => {
    onClose(true);
  };

  const [FilterState, SetFilterState] = useState<any>(Filters);

  useEffect(() => {
    let roleLength = taskFilterState?.filterData?.roleType?.length;
    let selectedRoles = "F";
    if (roleLength === roles.length) {
      selectedRoles = "T";
    } else if (roleLength === 0) {
      selectedRoles = "F";
    } else {
      selectedRoles = "I";
    }

    SetFilterState([
      {
        title: "All",
        code: "roleType",
        selectAllStatus: selectedRoles,
        options: [...taskFilterState?.filterData?.roleType],
      },
    ]);
    setStartData((prev: any) => {
      return prev.map((each: any) => {
        return {
          ...each,
          defaultValue: taskFilterState?.filterData?.fromDate
            ? taskFilterState?.filterData?.fromDate
            : "",
        };
      });
    });
    setDueData((prev: any) => {
      return prev.map((each: any) => {
        return {
          ...each,
          defaultValue: taskFilterState?.filterData?.toDate
            ? taskFilterState?.filterData?.toDate
            : "",
        };
      });
    });
  }, []);

  const handleOnTaskFilter = (formData: any) => {
    
    const result = tableData.filter(
      (item: any) =>
        formData.roleType?.includes(item.role) ||
        (formData.roleType?.length == 0 &&
          (item.updatedAt >= formData.fromDate || !formData.fromDate) &&
          (item.updatedAt <= formData.toDate || !formData.toDate))
    );
    let count = formData?.roleType?.length;

    if (formData?.toDate) {
      count = count + 1;
    }
    if (formData?.fromDate) {
      count = count + 1;
    }

    setSearchTableData(result);

    setTaskFilterState({
      isFilterApplied: true,
      filterData: formData,
      numberOfFilters: count,
    });
  };

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

  const onFilterApply = () => {
    let data: any = {
      roleType: [],
    };
    FilterState.forEach((item: any) => {
      if (item.code == "roleType") {
        const x = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        x.forEach((element: any) => {
          data?.roleType?.push(element.optionTitle);
        });
      }
    });

    data.roleType = [...FilterState[0].options];
    data.fromDate = startDate[0].defaultValue;
    data.toDate = dueDate[0].defaultValue;
    data.progress = {
      operator: progressDropdown[0]?.defaultValue,
      progressValue: progressPercent,
    };
    handleOnTaskFilter(data);
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
    SetFilterState(temp);
    // closeTaskFilterOverlay();
    // handleClose();
    setTaskFilterState({
      isFilterApplied: false,
      filterData: {
        roleType: [
          { optionTitle: "In Progress", optionStatus: "F" },
          { optionTitle: "Not Started", optionStatus: "F" },
          { optionTitle: "Completed", optionStatus: "F" },
          { optionTitle: "On Hold", optionStatus: "F" },
        ],
      },
      numberOfFilters: 0,
    });
  };

  const formHandler = (event: any) => {
    if (event === "Reset") {
      onReset();
      handleClose();
    } else {
      handleClose();
      onFilterApply();
    }
  };

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
                {/* <RefreshIcon
                  src={newRefreshIcon}
                  alt="reset"
                  onClick={() => {
                    onReset();
                  }}
                /> */}
                {/* <Image
                  src={ResetIcon}
                  alt="reset"
                  onClick={() => {
                    onReset();
                  }}
                /> */}
              </HeaderRightSectionResetIcon>
              {/* <HeaderRightSectionResetText>Reset</HeaderRightSectionResetText> */}
              {/* <Image src={closeIcon} alt="reset"   onClick={() => {
              handleClose();
              }} /> */}
              <CloseIcon
                onClick={() => {
                  handleClose();
                }}
                data-testid="filter-close"
                src={closeWithCircle}
                alt={"close icon"}
              />
            </HeaderRightSection>
          </TitleContainer>
        </HeaderContainer>
      </FilterCommonHeader>
      <FilterCommonBody>
        <FilterHeader>Select a State</FilterHeader>
        {FilterState?.map((each: any, index: any) => {
          return each.code === "roleType" ? (
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
                      alt="reset"
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
                      alt="reset"
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
          ) : (
            <FilterCardSecondContainer key={index}>
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
                      alt="reset"
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
                      alt="reset"
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
                    />
                    <FilterCardSelectAllTextHeader>
                      {each.title}
                    </FilterCardSelectAllTextHeader>
                  </FilterCardSelectAllSpan>
                ) : (
                  ""
                )}
              </FilterCardSelectAll>
            </FilterCardSecondContainer>
          );
        })}

        {/*
          Removed as not in API
         <FilterHeader style={{ marginTop: "42px", marginBottom: "20px" }}>
          Pick a Progress Range
        </FilterHeader> */}

        {/*
          Removed as not in API
         <FilterProgressContainer>
          <CustomSelect
            config={progressDropdown[0]}
            data={{
              ...progressDropdown,
              defaultValue: progressDropdown[0]?.options[0],
            }}
            id={"issueType"}
            setFormConfig={setProgressDropdown}
            isError={""}
            label=""
            data-testid="progress-options"
            customClass={customDropdown}
            sx={{ flex: 1 }}
          />
          <CustomTextField
            width="199px"
            type="number"
            placeHolder="Enter Percentage"
            id={"progress-textfield"}
            onChange={(e: any) => setProgressPercent(e.target.value)}
            onBlur={(e: any) => setProgressPercent(e.target.value)}
            //  defaultValue={"Enter Percentage"}
            isError={"false"}
            dataTestId="inputTextField"
            isRequired="false"
            minVal={0}
            maxVal={100}
            showRangeError={false}
            isDisabled={false}
          />
        </FilterProgressContainer> */}

        <FormElementContainer>
          <DatePickersContainer>
            <DatePickerContainer>
              <div>
                <CustomLabel label={"From"} />
                <TaskFilterFormWrapper
                  config={startDate}
                  setFormConfig={setStartData}
                />
              </div>
            </DatePickerContainer>
            <div>
              <CustomLabel label={"To"} />
              <TaskFilterFormWrapper
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
            label="Reset"
            formHandler={formHandler}
          />
          <CustomButton
            type="contained"
            formHandler={formHandler}
            label="Apply"
          />
        </ButtonsContainer>
      </FilterFooter>
    </FilterCommonMain>
  );
};

export default SectionFilter;
