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
} from "../../divami_components/task-filter-common/StyledComponent";
import CustomLabel from "../custom-label/CustomLabel";
import { DATE_PICKER_DATA, SEARCH_CONFIG } from "../create-task/body/Constants";
import CustomButton from "../custom-button/CustomButton";
import TaskFilterFormWrapper from "../task-filter-common/TaskFilterWrapper";
import moment from "moment";

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
const UsersFilter: React.FC<any> = ({
  onClose,
  tableData,
  setTaskFilterState,
  setSearchTableData,
  roles,
  taskFilterState,
  setSearchTerm,
}) => {
  const [startDate, setStartData] = useState(DATE_PICKER_DATA);
  const [dueDate, setDueData] = useState(DATE_PICKER_DATA);

  const Filters = [
    {
      title: "Select a role",
      code: "roleType",
      selectAllStatus: "F",
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
    SetFilterState([
      {
        title: "Select a role",
        code: "roleType",
        selectAllStatus: taskFilterState?.filterData?.roleType?.length
          ? "T"
          : "F",
        options: roles.map((each: any) => {
          return {
            optionTitle: each.label,
            optionStatus: taskFilterState?.filterData?.roleType?.includes(
              each.value
            )
              ? "T"
              : "F",
          };
        }),
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
  }, [roles]);

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
    setSearchTerm("");

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
    let tempOption,
      temp = FilterState;
    if (item?.optionStatus === "T") {
      temp = FilterState?.map((each: any, serial: number) => {
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
    } else {
      temp = FilterState?.map((each: any, serial: number) => {
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
    }
    if (temp[0].options.every((each: any) => each.optionStatus == "T")) {
      SetFilterState(
        temp.map((each: any) => {
          return {
            ...each,
            selectAllStatus: "T",
          };
        })
      );
    } else if (temp[0].options.some((each: any) => each.optionStatus == "T")) {
      SetFilterState(
        temp.map((each: any) => {
          return {
            ...each,
            selectAllStatus: "I",
          };
        })
      );
    } else {
      SetFilterState(
        temp.map((each: any) => {
          return {
            ...each,
            selectAllStatus: "F",
          };
        })
      );
    }
  };

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
    data.fromDate = startDate[0].defaultValue;
    data.toDate = dueDate[0].defaultValue;
    handleOnTaskFilter(data);
  };

  const onReset = () => {
    let temp = FilterState?.map((each: any, serial: number) => {
      return { ...each };
    });
    SetFilterState([
      {
        title: "Select a role",
        code: "roleType",
        selectAllStatus: "F",
        options: roles.map((each: any) => {
          return {
            optionTitle: each.label,
            optionStatus: "F",
          };
        }),
      },
    ]);
    setStartData(DATE_PICKER_DATA);
    setDueData(DATE_PICKER_DATA);

    setTaskFilterState({
      isFilterApplied: false,
      filterData: {},
      numberOfFilters: 0,
    });
    // closeTaskFilterOverlay();
    // handleClose();
  };

  const formHandler = (event: any) => {
    if (event === "Cancel") {
      handleClose();
    } else {
      handleClose();
      onFilterApply();
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
            <HeaderRightSection
              onClick={() => {
                onReset();
              }}
            >
              <HeaderRightSectionResetIcon>
                <RefreshIcon src={newRefreshIcon} alt="reset" />
              </HeaderRightSectionResetIcon>
              <HeaderRightSectionResetText
                onClick={() => {
                  onReset();
                }}
              >
                Reset
              </HeaderRightSectionResetText>

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
            <></>
          );
        })}

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
            label="Cancel"
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

export default UsersFilter;
