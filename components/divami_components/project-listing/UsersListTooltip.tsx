import { useRouter } from "next/router";
import { ShowMore, UsersList, UsersListItem } from "./ProjectListingStyles";

export const UsersListTooltip = ({ list, showMoreText = false }: any) => {
  const router = useRouter();

  return (
    <UsersList>
      {list.map((each: any, index: number) => {
        return (
          <UsersListItem
            key={index}
            hideFirstStyle={index === 0}
            hideLastStyle={index === list.length - 1}
          >
            {each.user?.fullName}
          </UsersListItem>
        );
      })}
      {showMoreText && (
        <ShowMore
          onClick={() => {
            router.push(`/projects/PRJ201897/usersList`);
          }}
        >
          View More Users
        </ShowMore>
      )}
    </UsersList>
  );
};