import React from 'react'
import { ProjectUsersList } from '../../project-users-list/ProjectUsersList'
import { useProjectContext } from '../../../../state/projectState/context';

const ProjectOnboardingUsers = () => {
  const { state:onboardingState} = useProjectContext();

  return (
    <div> <ProjectUsersList projectId={onboardingState.newProjectDetails._id} onBoardScreen="onBoarding"></ProjectUsersList></div>
  )
}

export default ProjectOnboardingUsers