import React from 'react'
import { ProjectUsersList } from '../../project-users-list/ProjectUsersList'
import { useProjectContext } from '../../../../state/projectState/context';
import { IOnboardingProps } from '../projectOnboarding';
import { useSignalEffect } from '@preact/signals-react';

const ProjectOnboardingUsers = ({ step, action,projectId,usersCount }: IOnboardingProps) => {

  console.log(usersCount?.value)
  
  useSignalEffect(() => {
    console.log('Action inside Users', 'Step:', step.peek(), 'Action:', action?.value)
    switch(action!.value) {
      case 'Back-3':
        step.value = 2
        action!.value = ''
        break
      case 'Next-3':
        step.value = 4
        action!.value = ''
        break
      default:
        break
    }
  })

  return (
    <div> <ProjectUsersList projectId={projectId.value} onBoardScreen="onBoarding" usersCount={usersCount}></ProjectUsersList></div>
  )
}

export default ProjectOnboardingUsers