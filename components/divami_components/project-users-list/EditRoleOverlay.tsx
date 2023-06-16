import CustomButton from "../custom-button/CustomButton";
import FormWrapper from "../form-wrapper/FormWrapper";
import {
  TitleContainer,
  HeaderLeftSection,
  HeaderLeftSectionText,
  HeaderRightSection,
  CloseIcon,
  ButtonsContainer,
  FilterCommonHeader,
} from "../hotspot-filter-common/HotspotFilterStyled";
import { StyledFilterText } from "../project-listing/ProjectListingStyles";
import {
  EditRoleContainer,
  EditRoleHeader,
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

export const EditRoleOverlay = ({ onClose, userData }: any) => {
  const handleClose = () => {
    onClose();
  };
  const formHandler = () => {};
  return (
    <FilterCommonMain>
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
          <UserAvatarImage src={userData?.avatar} alt=""></UserAvatarImage>
          <UserInfoContainer>
            <UserName>{userData?.fullName}</UserName>
            <UserEmail>{userData?.email}</UserEmail>
          </UserInfoContainer>
        </UserAvatarContainer>

        <AssignedLabel>Assigned On</AssignedLabel>
        <AssignedValue>
          {moment(userData.updatedAt).format("DD MMM YYYY")}
        </AssignedValue>
      </EditRoleBody>

      <EditRoleFooter>
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
      </EditRoleFooter>
    </FilterCommonMain>
  );
};
