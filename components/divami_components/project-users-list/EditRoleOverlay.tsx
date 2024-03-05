import CustomButton from "../custom-button/CustomButton";
import {
  TitleContainer,
  HeaderLeftSection,
  HeaderLeftSectionText,
  HeaderRightSection,
  CloseIcon,
  ButtonsContainer,
  FilterCommonHeader,
} from "../hotspot-filter-common/HotspotFilterStyled";
import {
  EditRoleBody,
  EditRoleFooter,
  UserAvatarContainer,
  UserAvatarImage,
  UserEmail,
  UserInfoContainer,
  UserName,
  AssignedLabel,
  AssignedValue,
} from "./EditRolesStyles";
import closeWithCircle from "../../../public/divami_icons/closeWithCircle.svg";
import {
  FilterCommonMain,
  HeaderContainer,
} from "../task-filter-common/StyledComponent";
import moment from "moment";
import CustomSelect from "../custom-select/CustomSelect";
import { useState } from "react";
import { UserDefaultIcon } from "./ProjectUsersListStyles";
import { setTheFormatedDate } from "../../../utils/ViewerDataUtils";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
export const EditRoleOverlay = ({
  onClose,
  userData,
  roles,
  updateRole,
}: any) => {
  const customLogger = new CustomLoggerClass();
  const handleClose = () => {
    onClose();
  };
  const cancelCallback = () => {
    onClose();
  };

  const applyCallback = () => {
    updateRole(selectedRole, userData);
    customLogger.logInfo(`Change User Role`)
  };

  const [selectedRole, setSelectedRole] = useState(userData?.role || "");
  return (
    <FilterCommonMain isFlex={true}>
      <FilterCommonHeader>
        <HeaderContainer>
          <TitleContainer noPadding>
            <HeaderLeftSection>
              <HeaderLeftSectionText>Edit User Role</HeaderLeftSectionText>
            </HeaderLeftSection>
            <HeaderRightSection>
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
      <EditRoleBody>
        <UserAvatarContainer>
          {userData.avatar ? (
            <UserAvatarImage
              src={userData?.avatar}
              alt=""
              width={58}
              height={58}
            />
          ) : (
            <UserDefaultIcon fromProfile>
              {userData.firstName.charAt(0)?.toUpperCase()}
              {userData.lastName.charAt(0)?.toUpperCase()}
            </UserDefaultIcon>
          )}
          <UserInfoContainer>
            <UserName>{userData?.fullName}</UserName>
            <UserEmail>{userData?.email}</UserEmail>
          </UserInfoContainer>
        </UserAvatarContainer>

        <AssignedLabel>Assigned On</AssignedLabel>
        <AssignedValue>
          {userData.assignedOn ? (setTheFormatedDate(userData.assignedOn)):'-'}
        </AssignedValue>
        <AssignedLabel bottom>Role</AssignedLabel>
        <CustomSelect
          config={{
            options: roles?.length ? roles : [],
            defaultValue: selectedRole,
          }}
          id={"select"}
          setFormConfig={() => {}}
          sx={{ minWidth: 120 }}
          onChangeHandler={(e: any) => {
            setSelectedRole(e.target?.value);
          }}
          isError={false}
          label="Role"
          dataTestId={`inputSelectField`}
        />
      </EditRoleBody>

      <EditRoleFooter>
        <ButtonsContainer nopaddingleftright>
          <CustomButton
            type="outlined"
            label="Cancel"
            formHandler={cancelCallback}
          />

          <CustomButton
            type="contained"
            formHandler={applyCallback}
            label="Apply"
          />
        </ButtonsContainer>
      </EditRoleFooter>
    </FilterCommonMain>
  );
};
