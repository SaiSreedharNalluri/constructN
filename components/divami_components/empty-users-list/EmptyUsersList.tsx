import {
  AddByEmailText,
  AddSingleUserContainer,
  AddUserImage,
  AddUsersContainer,
  BulkUserContainer,
  DownloadTemplateText,
  EmptyUsersListContainer,
  GoAheadText,
  HeaderLabel,
  NoUsersContainer,
  Divider,
  BulkImageIcon,
} from "./EmptyUsersListStyles";
import UploadBulkIcon from "../../../public/divami_icons/UploadBulkIcon.svg";
import AddUserIcon from "../../../public/divami_icons/AddUserIcon.svg";
import CustomButton from "../custom-button/CustomButton";

export const EmptyUsersList = () => {
  return (
    <EmptyUsersListContainer>
      <HeaderLabel>Manage Users</HeaderLabel>
      <NoUsersContainer>
        <HeaderLabel>No users have been onboarded yet!! </HeaderLabel>
        <GoAheadText>Go ahead and explore the below options.</GoAheadText>
      </NoUsersContainer>
      <AddUsersContainer>
        <AddSingleUserContainer>
          <AddUserImage src={AddUserIcon} alt=""></AddUserImage>
          <AddByEmailText>Add user by email id</AddByEmailText>
          <CustomButton type={"contained"} label={"Add User"} />
        </AddSingleUserContainer>
        <Divider orientation="vertical" theme="light" />
        <BulkUserContainer>
          <BulkImageIcon src={UploadBulkIcon} alt=""></BulkImageIcon>
          <DownloadTemplateText>
            Download the template to upload the user details
          </DownloadTemplateText>
          <CustomButton type={"contained"} label={"Bulk Users Upload"} />
        </BulkUserContainer>
      </AddUsersContainer>
    </EmptyUsersListContainer>
  );
};
