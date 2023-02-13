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
}) => {
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

  const [FilterState, SetFilterState] = useState<any>(Filters);
  const [optionState, setOptionState] = useState<any>("clash");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [datePickerData, setDatePickerData] = useState(DATE_PICKER_DATA);


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
                <Image src={ResetIcon} alt="reset" />
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
            <FilterCardContainer>
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
                {each?.options?.map((item: any) => {
                  return (
                    <FilterCardOptionContainer>
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
          <IssueFilterFormWrapper config={SEARCH_CONFIG} setFormConfig={SEARCH_CONFIG} />
        </FormElementContainer>

        <FormElementContainer>
          <DatePickersContainer>
            <DatePickerContainer>
               <div>
              <CustomLabel label={"Start Date"} />
              <IssueFilterFormWrapper
                config={datePickerData}
                setFormConfig={setDatePickerData}
                />
                </div>
            </DatePickerContainer>
            <div>
              <CustomLabel label={"Due Date"} />
              <IssueFilterFormWrapper
                config={datePickerData}
                setFormConfig={setDatePickerData}
              />
            </div>
          </DatePickersContainer>
        </FormElementContainer>

        <ButtonsContainer>
          <CustomButton type="outlined" label="Cancel" />
          <CustomButton type="contained" label="Apply" />
        </ButtonsContainer>
      </FilterCommonBody>
    </FilterCommonMain>
  );
};

export default FilterCommon;
// export default Body
