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
import { useEffect, useState } from "react";
import PopupComponent from "../../popupComponent/PopupComponent";
import { AddUsersEmailPopup } from "../add_users/AddUsersEmailPopup";
import { Drawer } from "@mui/material";
import { AddUsersEmailOverlay } from "../add_users/AddUsersEmailOverlay";
import router from "next/router";
import { getProjectUsers, getUserRoles } from "../../../services/project";

export const EmptyUsersList = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form, setForm] = useState({});
  const [responseData, setResponseData] = useState<any>([]);
  const [roles, setRoles] = useState<string[] | []>([]);

  const [options, setOptions] = useState<any>({
    listOfEntries: [
      {
        label: "",
        value: "",
      },
    ],
  });
  const showEmailOverlay = (formState: any) => {
    setShowAddUser(false);
    setOpenDrawer(true);
    setForm(formState);
  };

  useEffect(() => {
    getProjectUsers(router.query.projectId as string).then((response: any) => {
      if (response.success === true) {
        let rolesArr: string[] = [];
        setResponseData(
          response.result.map((each: any) => {
            return {
              ...each,
              ...each.user,
            };
          })
        );
        const userData = response.result.map((each: any) => {
          return {
            ...each,
            label: each.user.email,
            id: each.user._id,
          };
        });
        setOptions({
          listOfEntries: userData,
        });
      }
    });
    getUserRoles().then((res: any) => {
      const rolesData = res.result.map((each: any) => {
        return {
          label: each,
          value: each,
        };
      });
      setRoles(rolesData);
    });
  }, []);
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
          <CustomButton
            type={"contained"}
            label={"Add User"}
            formHandler={() => {
              setShowAddUser(true);
            }}
          />
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
      {showAddUser ? (
        <PopupComponent
          open={showAddUser}
          hideButtons
          setShowPopUp={setShowAddUser}
          modalTitle={"Add users to the project"}
          modalContent={
            <AddUsersEmailPopup
              showEmailOverlay={showEmailOverlay}
              options={options}
              responseData={responseData}
            />
          }
          modalmessage={""}
          primaryButtonLabel={"Yes"}
          SecondaryButtonlabel={"No"}
          callBackvalue={() => {}}
        />
      ) : (
        <></>
      )}
      <Drawer
        anchor={"right"}
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
      >
        <AddUsersEmailOverlay
          form={form}
          options={options}
          responseData={responseData}
          setOpenDrawer={setOpenDrawer}
          roles={roles}
        />
      </Drawer>
    </EmptyUsersListContainer>
  );
};
