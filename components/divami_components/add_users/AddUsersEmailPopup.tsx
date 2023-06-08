import { useEffect, useState } from "react";
import FormWrapper from "../form-wrapper/FormWrapper";
import { AddUserConfig } from "../empty-users-list/Constants";
import {
  AddUserEmailContainer,
  BulkImage,
  BulkUserText,
  BulkUserUploadContainer,
  ClickHereText,
  DownloadText,
  LabelContainer,
  OrText,
} from "../empty-users-list/EmptyUsersListStyles";
import bulkIcon from "../../../public/divami_icons/bulkUpload.svg";
import { push } from "mixpanel-browser";
import { AddUsersEmailOverlay } from "./AddUsersEmailOverlay";
import { Drawer } from "@mui/material";
import CustomSearch from "../custom-search/CustomSearch";
import CustomLabel from "../custom-label/CustomLabel";

export const AddUsersEmailPopup = ({
  showEmailOverlay,
  options,
  responseData,
}: any) => {
  const [formConfig, setFormConfig] = useState(AddUserConfig);
  const [formState, setFormState] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <AddUserEmailContainer>
      {/* <FormWrapper
        config={formConfig}
        setFormConfig={setFormConfig}
        formState={formState}
        setFormState={setFormState}
      /> */}
      <LabelContainer>
        <CustomLabel label="Add User By Their Email ID"></CustomLabel>
      </LabelContainer>
      <CustomSearch
        data={options}
        handleSearchResult={(e: any, value: any, id: any) => {
          if (value?.id) {
            const selectedObj = responseData.find(
              (each: any) => each._id === value?.id
            );
            showEmailOverlay(selectedObj);
          }
        }}
        placeholder="Enter Email ID"
      />
      <OrText>OR</OrText>
      <BulkUserUploadContainer>
        <BulkImage width={68} height={68} src={bulkIcon} alt=""></BulkImage>
        <BulkUserText>Bulk Users Upload</BulkUserText>
        <BulkUserText>
          Drag and drop the file or upload from system
        </BulkUserText>
      </BulkUserUploadContainer>
      <ClickHereText>
        Click here to <DownloadText>download</DownloadText> the template
      </ClickHereText>
    </AddUserEmailContainer>
  );
};
