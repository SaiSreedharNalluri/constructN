import React, { useEffect, useState } from "react";
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
  FilterCommonMain,
  FilterCommonHeader,
  FilterCommonBody,
  TitleContainer,
  ButtonsContainer,
  FilterFooter,
} from "../../divami_components/task-filter-common/StyledComponent";
import CustomButton from "../custom-button/CustomButton";
import FormWrapper from "../form-wrapper/FormWrapper";
import { projectConfig } from "./FiltersConstants";
import { StyledFilterText } from "./ProjectListingStyles";

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
const ProjectListFilter: React.FC<any> = ({
  taskFilterState,
  onClose,
  handleOnApplyFilter,
  setTaskFilterState,
  setIsFilterApplied,
  setSearchTerm,
}) => {
  const [formState, setFormState] = useState<any>({});
  const [formConfig, setFormConfig] = useState<any>(projectConfig);
  const handleClose = () => {
    onClose(true);
  };

  const onFilterApply = () => {
    let numberOfAppliedFilters = formConfig.some((each: any) =>
      each.fields.some((item: any) => item.defaultValue)
    );

    if (numberOfAppliedFilters) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
    setSearchTerm("");

    const data: any = {
      startDate:
        formConfig
          .find((each: any) => each.id == "dates")
          ?.fields.find((each: any) => each.id == "startDate").defaultValue ||
        "",
      dueDate:
        formConfig
          .find((each: any) => each.id == "dates")
          ?.fields.find((each: any) => each.id == "dueDate").defaultValue || "",
      compareText:
        formConfig
          .find((each: any) => each.id == "numberOfMembersField")
          ?.fields.find((each: any) => each.id == "numberOfMembersSelect")
          .defaultValue || "",
      numOfMem:
        formConfig
          .find((each: any) => each.id == "numberOfMembersField")
          ?.fields.find((each: any) => each.id == "numberOfMembersValue")
          .defaultValue || "",
    };
    handleOnApplyFilter(data);
  };

  const onReset = () => {
    setFormConfig([{...projectConfig[0], fields:[{...projectConfig[0].fields[0], key:2},{...projectConfig[0].fields[1], key:3}]},
      {...projectConfig[1]}]);
    setTaskFilterState({ isFilterApplied: false });
  };

  const formHandler = (event: any) => {
    if (event === "Cancel") {
      handleClose();
    } else {
      handleClose();
      onFilterApply();
    }
  };

  useEffect(() => {
    setFormConfig((prev: any) => {
      return prev.map((each: any) => {
        if (each.id === "dates") {
          return {
            ...each,
            fields: each.fields.map((item: any) => {
              if (item.id === "startDate") {
                return {
                  ...item,
                  defaultValue: taskFilterState.startDate || "",
                };
              } else if (item.id == "dueDate") {
                return {
                  ...item,
                  defaultValue: taskFilterState.dueDate || "",
                };
              }
            }),
          };
        } else if (each.id === "numberOfMembersField") {
          return {
            ...each,
            fields: each.fields.map((item: any) => {
              if (item.id === "numberOfMembersSelect") {
                return {
                  ...item,
                  defaultValue: taskFilterState.compareText || "",
                };
              } else if (item.id == "numberOfMembersValue") {
                return {
                  ...item,
                  defaultValue: taskFilterState.numOfMem || "",
                };
              }
            }),
          };
        }
      });
    });
  }, [taskFilterState]);

  return (
    <FilterCommonMain>
      <FilterCommonHeader>
        <HeaderContainer>
          <TitleContainer>
            <HeaderLeftSection>
              <HeaderLeftSectionText>Filter</HeaderLeftSectionText>
            </HeaderLeftSection>
            <HeaderRightSection>
              <HeaderRightSectionResetIcon
                onClick={() => {
                  onReset();
                }}
              >
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
        <StyledFilterText>Last Updated Date</StyledFilterText>
        <FormWrapper
          config={formConfig}
          setFormConfig={setFormConfig}
          formState={formState}
          setFormState={setFormState}
        />
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

export default ProjectListFilter;
