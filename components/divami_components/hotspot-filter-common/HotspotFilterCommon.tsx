import React, { useState } from "react";
import {
  ButtonsContainer,
  DatePickerContainer,
  DatePickersContainer,
  ElementDivCardContainer,
  ElementDivCardDateContainer,
  FilterCardContainer,
  FilterCommonBody,
  FilterCommonHeader,
  FilterFooter,
  FormElementContainer,
  HeaderContainer,
  HeaderLeftSection,
  HeaderLeftSectionText,
  HeaderRightSection,
  HeaderRightSectionResetIcon,
  HeaderRightSectionResetText,
  HorizontalLine,
  HotspotFilterCommonMain,
  TitleContainer,
  RefreshIcon,
  CloseIcon,
} from "./HotspotFilterStyled";
import CustomLabel from "../custom-label/CustomLabel";

import newRefreshIcon from "../../../public/divami_icons/newRefreshIcon.svg";
import NotificationNewIcon from "../../../public/divami_icons/NotificationNewIcon.svg";
import HotspotFilterFormWrapper from "./HotspotFilterWrapper";
import { DATE_PICKER_DATA } from "../create-issue/body/Constants";
import CustomButton from "../custom-button/CustomButton";
import { styled } from "@mui/system";
import Image from "next/image";

interface IProps {
  onClose: any;
}

const HotspotFilterCommon: React.FC<IProps> = ({ onClose }) => {
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

  const selectPriority = {
    id: "taskPriority",
    type: "select",
    defaultValue: "",
    placeHolder: "Select",
    // label: "Select task priority",
    isLarge: false,
    isError: false,
    isReq: true,
    isflex: false,
    isReadOnly: false,
    // formLabel: "Select task priority",
    options: [
      {
        label: "Plastic",
        value: "plastic",
        selected: false,
      },
      {
        label: "Metalic",
        value: "metalic",
        selected: false,
      },
    ],
  };
  const [assignee, setAssignees] = useState([assignees]);
  const [selectPrior, setSelectPrior] = useState([selectPriority]);

  const [startDate, setStartData] = useState(DATE_PICKER_DATA);
  const [dueDate, setDueData] = useState(DATE_PICKER_DATA);
  const formHandler = (event: any) => {
    console.log("sdf");
    if (event === "Cancel") {
      handleClose();
    } else {
      //   onFilterApply();
      handleClose();
    }
  };
  const handleClose = () => {
    onClose(true);
  };

  return (
    <HotspotFilterCommonMain>
      <FilterCommonHeader>
        <HeaderContainer>
          <TitleContainer>
            <HeaderLeftSection>
              <HeaderLeftSectionText>Filters</HeaderLeftSectionText>
            </HeaderLeftSection>
            <HeaderRightSection>
              <HeaderRightSectionResetIcon>
                <RefreshIcon
                  src={newRefreshIcon}
                  alt="reset"
                  onClick={() => {
                    // onReset();
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
                src={NotificationNewIcon}
                alt={"close icon"}
              />
            </HeaderRightSection>
          </TitleContainer>
        </HeaderContainer>
      </FilterCommonHeader>
      <FilterCommonBody>
        <FilterCardContainer>
          <FormElementContainer>
            <CustomLabel label={"Progress Rate"} />
            <HotspotFilterFormWrapper
              config={selectPrior}
              setFormConfig={setSelectPrior}
            />
          </FormElementContainer>

          <ElementDivCardContainer>
            <FormElementContainer>
              <CustomLabel label={"Took By"} />
              <HotspotFilterFormWrapper
                config={assignee}
                setFormConfig={setAssignees}
              />
            </FormElementContainer>
          </ElementDivCardContainer>

          <ElementDivCardContainer>
            <FormElementContainer>
              <CustomLabel label={"Scan Took on "} />
              <HorizontalLine></HorizontalLine>
            </FormElementContainer>
          </ElementDivCardContainer>

          <ElementDivCardDateContainer>
            <FormElementContainer>
              <DatePickersContainer>
                <DatePickerContainer>
                  <div>
                    <CustomLabel label={"Start date"} />
                    <HotspotFilterFormWrapper
                      config={startDate}
                      setFormConfig={setStartData}
                    />
                  </div>
                </DatePickerContainer>
                <div>
                  <CustomLabel label={"Due date"} />
                  <HotspotFilterFormWrapper
                    config={dueDate}
                    setFormConfig={setDueData}
                  />
                </div>
              </DatePickersContainer>
            </FormElementContainer>
          </ElementDivCardDateContainer>
        </FilterCardContainer>
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
            label="Apply"
            formHandler={formHandler}
          />
        </ButtonsContainer>
      </FilterFooter>
    </HotspotFilterCommonMain>
  );
};

export default HotspotFilterCommon;
