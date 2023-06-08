import { useRouter } from "next/router";
import {
  EmailIcon,
  EmailIconContainer,
  ShowMore,
  UserMonogram,
  UsersList,
  UsersListItem,
} from "./ProjectListingStyles";
import Mail from "../../../public/divami_icons/Mail.svg";
import Image from "next/image";

export const UserInfoTooltip = ({ userData, getFullName }: any) => {
  const router = useRouter();

  return (
    <UsersList>
      <UsersListItem hideFirstStyle={true} hideLastStyle={true}>
        <UserMonogram>
          {getFullName(userData?.user?.firstName, userData?.user?.lastName)}
        </UserMonogram>
        {userData.user?.fullName}
      </UsersListItem>
      <UsersListItem hideFirstStyle={true} hideLastStyle={true}>
        <EmailIconContainer>
          <EmailIcon src={Mail} width={24} height={24} alt="" />
        </EmailIconContainer>
        {userData.user?.email}
      </UsersListItem>
    </UsersList>
  );
};
