import { useState } from "react";
import { EmptyUsersList } from "../empty-users-list/EmptyUsersList";
import { ProjectUsersList } from "../project-users-list/ProjectUsersList";

export const UsersListing = () => {
  const [showEmptyState, setShowEmptyState] = useState<boolean>(false);
  return (
    <>
      {showEmptyState ? (
        <EmptyUsersList></EmptyUsersList>
      ) : (
        <ProjectUsersList
          setShowEmptyState={setShowEmptyState}
        ></ProjectUsersList>
      )}
    </>
  );
};
