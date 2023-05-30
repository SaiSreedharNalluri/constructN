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
  FilterText,
} from "../../divami_components/task-filter-common/StyledComponent";
import { DATE_PICKER_DATA, SEARCH_CONFIG } from "../create-task/body/Constants";
import CustomButton from "../custom-button/CustomButton";
import FormWrapper from "../form-wrapper/FormWrapper";
import { projectConfig } from "./FiltersConstants";

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
  onClose,
  tableData,
  setTaskFilterState,
  setSearchTableData,
}) => {
  const [formState, setFormState] = useState({});
  const [formConfig, setFormConfig] = useState(projectConfig);

  const handleClose = () => {
    onClose(true);
  };

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

  const onFilterApply = () => {
    let data: any = {
      roleType: [],
    };

    handleOnTaskFilter(data);
  };

  const onReset = () => {};

  const formHandler = (event: any) => {
    console.log("sdf");
    if (event === "Cancel") {
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
              <HeaderLeftSectionText>Filter</HeaderLeftSectionText>
            </HeaderLeftSection>
            <HeaderRightSection>
              <HeaderRightSectionResetIcon>
                <RefreshIcon
                  src={newRefreshIcon}
                  alt="reset"
                  onClick={() => {
                    onReset();
                  }}
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
                data-testid="filter-close"
                src={closeWithCircle}
                alt={"close icon"}
              />
            </HeaderRightSection>
          </TitleContainer>
        </HeaderContainer>
      </FilterCommonHeader>
      <FilterCommonBody>
        <FilterText>Last Updated Time</FilterText>
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
