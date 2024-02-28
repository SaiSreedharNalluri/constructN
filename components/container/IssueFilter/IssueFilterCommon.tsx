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
  HeaderRightSectionCloseIcon,
} from "./IssueStyledComponent";
import { Issue } from "../../../models/Issue";
import { DATE_PICKER_DATA, SEARCH_CONFIG } from "../../divami_components/create-task/body/Constants";
// import Fil from "../form-wrapper/FormWrapper";
import IssueFilterFormWrapper from "../../divami_components/issue-filter-common/IssueFilterWrapper";
import CustomLabel from "../../divami_components/custom-label/CustomLabel";
import { ButtonsContainer } from "./IssueStyledComponent"; 
import CustomButton from "../../divami_components/custom-button/CustomButton";
import router from "next/router";
import { IProjectUsers } from "../../../models/IProjects";
import {
  getIssueTags,
  getIssuesPriority,
  getIssuesStatus,
  getIssuesTypes,
} from "../../../services/issue";
import { getProjectUsers } from "../../../services/project";
import closeWithCircle from "../../../public/divami_icons/closeWithCircle.svg";
import CustomMiniLoader from "../../divami_components/custom_loader/CustomMiniLoader";
import { IFilterProps } from "../issueListing/IssueList"; 
import { IToolbarAction } from "../../../models/ITools";
import { useApiDataContext } from "../../../state/projectConfig/projectConfigContext";

interface IProps {
  closeOverlay: () => void;
  issuesList: Issue[];
  visibility: boolean;
  toolClicked: (toolAction:IToolbarAction) => void;
  handleOnSort: (sortMethod: string) => void;
  closeFilterOverlay: () => void;
  deleteTheIssue: (issueObj: object) => void;
  clickIssueEditSubmit: (editObj: object, issueObj: object) => void;
  onClose: any;
  issueFilterState: any;
  setIssueFilterState: any;
  checkIsFilter: any;
  filterRsp: IFilterProps;
}

const FilterCommon: React.FC<IProps> = ({
  visibility,
  closeOverlay,
  issuesList,
  toolClicked,
  handleOnSort,
  closeFilterOverlay,
  deleteTheIssue,
  clickIssueEditSubmit,
  onClose,
  issueFilterState,
  setIssueFilterState,
  filterRsp,
  
}) => {


  const Filters = [
    {
      title: "Type",
      selectAllStatus: "F",
      options: [
      

      ],
    },
    {
      title: "Priority",
      selectAllStatus: "F",
      options: [
       
      ],
    },
    {
      title: "Status",
      selectAllStatus: "F",
      options: [
      ],
    },
    {
      title: "Tags",
      selectAllStatus: "F",
      options: [
      ],
    },
  ];


  const { initialTypes,initialPriority,initialStatus,initialProjectUsersList,issueTagsList } = useApiDataContext();
  const [FilterState, SetFilterState] = useState<any>(Filters);
  const [optionState, setOptionState] = useState<any>("clash");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [startDate, setStartData] = useState(DATE_PICKER_DATA);
  const [dueDate, setDueData] = useState(DATE_PICKER_DATA);
  const [taskType, setTaskType] = useState<string[]>(initialTypes);
  const [taskPriority, setTaskPriority] = useState<string[]>(initialPriority);
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>(initialProjectUsersList);
  const [taskStatus, setTaskStatus] = useState<string[]>(initialStatus);
  const [tagStatus, setTagStatus] = useState<string[]>(issueTagsList);
  const assignees = {
    id: "assignes",
    type: "search",
    listOfEntries: [],
    selectedName: issueFilterState?.filterData?.assigneesData?.user || null,
    label: "Select Name or Team",
  };
  const [assignee, setAssignees] = useState([assignees]);
  const [loader, setLoader] = useState(false);
  // const handleClose = () => {
  //   onClose(true);
  // };

  const onFilterApply = () => {

    
    let filterCount=0;
    let data: any = {};
    data.issueTypeData = [];
    data.issuePriorityData = [];
    data.issueStatusData = [];
    data.issueTagData = []

    data.assigneesData = assignee[0]?.selectedName;

    FilterState.forEach((item: any) => {
      if (item.title == "Type") {
        const x = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        filterCount+=x.length
        x.forEach((element: any) => {
          data.issueTypeData.push(element.optionTitle);
        });
      } else if (item.title == "Priority") {
        const z = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        filterCount+=z.length;
        z.forEach((element: any) => {
          data.issuePriorityData.push(element.optionTitle);
        });
      } else if (item.title == "Status") {
        const y = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        filterCount+=y.length;
        y.forEach((element: any) => {
          data.issueStatusData.push(element.optionTitle);
        });
      }
      else if (item.title == "Tags"){
        const k = item.options.filter(
          (option: any) => option.optionStatus == "T"
        );
        filterCount+=k.length;
        k.forEach((element: any) => {
          data.issueTagData.push(element.optionTitle);
        });
      }
    });
    data.fromDate = startDate[0].defaultValue;
    data.toDate = dueDate[0].defaultValue;

    const { issuePriorityData, issueStatusData, issueTypeData, issueTagData, ...restObj } =
      data;
    const isArrEmpty: Boolean =
      issuePriorityData?.length === 0 &&
      issueStatusData?.length === 0 &&
      issueTypeData?.length === 0 &&
      issueTagData?.length === 0;
    const isEmpty = Object.values(restObj).every((x) => x === null || x === "");

    let handleIssueFilter : IToolbarAction = { data: data, type: "handleIssueFilter" };
    toolClicked(handleIssueFilter)
    handleClose();
  
    // if(isArrEmpty){ 
    //   console.log(isArrEmpty,"YEAAA");
    //   closeFilterOverlay();
    // }
  };
  const formHandler = (event: any) => {
    if (event === "Cancel") {
      handleClose();
    } else {
      onFilterApply();
    }
  };

  useEffect(() => {
    setLoader(true)
    if (router.isReady) {
    try{ 
      setTaskType(initialTypes)
      setTaskPriority(initialPriority)
      setProjectUsers(initialProjectUsersList)
      setTaskStatus(initialStatus)
      setTagStatus(issueTagsList[0].tagList)
      
      // getIssuesTypes(router.query.projectId as string).then((response) => {
      //   if (response.success === true) {
      //     setTaskType(response.result);
      //   }
      // });
      // getIssuesPriority(router.query.projectId as string).then((response) => {
      //   if (response.success === true) {
      //     setTaskPriority(response.result);
      //   }
      // });
      // getProjectUsers(router.query.projectId as string)
      //   .then((response) => {
      //     if (response.success === true) {
      //       setProjectUsers(response.result);
      //     }
      //   })
      //   .catch();
      // getIssuesStatus(router.query.projectId as string).then((response) => {
      //   if (response.success === true) {
      //     setTaskStatus(response.result);
  
      //   }
      // });
      
      // getIssueTags(router.query.projectId as string).then((response) => {
      //   if (response.success === true) {
      //     let newArr = [...response.result[0].tagList]
      //     //  setTagStatus(response.result[0].tagList);
      //     console.log("result of Api",response.result[0].tagList);
          
      //   }

        setLoader(false)
      // })
    }catch(error){
      setLoader(false)
    }
    }
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
        
        if (item.title === "Tags"){
          let selectAllStatus = "F";
          if (issueFilterState.isFilterApplied) {
            if (
              item.options?.length ===
              issueFilterState.filterData.issueTagData?.length
            ) {
              selectAllStatus = "T";
            } else if (issueFilterState.filterData?.issueTagData?.length) {
              selectAllStatus = "I";
            }
          }
          return {
            ...item,
            selectAllStatus: selectAllStatus,
            options: tagStatus?.map((eachItem: any) => {
              if (issueFilterState.isFilterApplied) {
                if (
                  issueFilterState.filterData.issueTagData.includes(eachItem)
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
    if (issueFilterState?.isFilterApplied) {
    }
    
    // setStartData([
    //   {
    //     ...DATE_PICKER_DATA[0],
    //     defaultValue: issueFilterState?.filterData.fromDate,
    //   },
    // ]);
  }, [taskType, taskStatus, tagStatus, projectUsers, taskPriority,FilterState[0].options]);

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
    if(FilterState.length > 0){
      for (const [i, outerObject] of FilterState.entries()) {
        if(outerObject && outerObject.options){
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
            if (count?.length === 0) {
              return {
                ...each,
                selectAllStatus: "F",
              };
            } else if (count?.length === each.options?.length) {
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
    }
    else{
      
    let handleIssueCloseFilter : IToolbarAction = { data:"", type: "closeFilterOverlay" };
    toolClicked(handleIssueCloseFilter)
    closeFilterOverlay();
    }
  }, [optionState]);

  const handleClose = () => {
    onClose(true);
  };

  const onReset = () => {
    let temp = FilterState?.map((each: any) => {
      return { ...each, selectAllStatus:"F" };
    });
    temp.forEach((element: any) => {
      element?.options?.forEach((obj: any) => {
        obj.optionStatus = "F";
      });
    });
    setStartData(DATE_PICKER_DATA);
    setDueData(DATE_PICKER_DATA);
    setAssignees(assignee);
    SetFilterState(temp);
    if(issueFilterState.numberOfFilters >=1){
    let handleIssueCloseFilter : IToolbarAction = { data:"", type: "closeFilterOverlay" };
    toolClicked(handleIssueCloseFilter)
    }
    // closeFilterOverlay();
  };

  return (
   <>
    <FilterCommonMain>
    {
    loader ?
      <div className="mini-loader-parent">
      <CustomMiniLoader></CustomMiniLoader>
      </div>
      
    :
    <>
       <FilterCommonHeader>
       <HeaderContainer>
         <TitleContainer>
           <HeaderLeftSection>
             <HeaderLeftSectionText data-testid="filter-title">
               Filters
             </HeaderLeftSectionText>
           </HeaderLeftSection>
           <HeaderRightSection>
             <HeaderRightSectionResetIcon className="flex items-center" onClick={() => {
                   onReset();
                 }}>
               <RefreshIcon
                 src={newRefreshIcon}
                 alt="reset"
                 data-testid="filter-refresh"
               />
               <label className="ml-[10px] br-[10px] border-solid bordder-[#d9d9d9] pr-[15px] font-sans font-normal text-[#F1742E]">Reset</label>
             </HeaderRightSectionResetIcon>
            <HeaderRightSectionCloseIcon>
             <CloseIcon
               onClick={() => {
                 handleClose();
               }}
               src={closeWithCircle}
               alt={"close icon"}
               data-testid="filter-close"
             />
             </HeaderRightSectionCloseIcon>
           </HeaderRightSection>
         </TitleContainer>
       </HeaderContainer>
     </FilterCommonHeader>
     <FilterCommonBody>
       {FilterState?.map((each: any, index: any) => {
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
     </>
   }
     
    </FilterCommonMain>
    </>
  );
};

export default FilterCommon;
