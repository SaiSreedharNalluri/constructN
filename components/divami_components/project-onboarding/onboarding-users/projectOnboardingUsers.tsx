import React from 'react'
import { ProjectUsersList } from '../../project-users-list/ProjectUsersList'
import { useProjectContext } from '../../../../state/projectState/context';
import { IOnboardingProps } from '../projectOnboarding';
import { effect } from '@preact/signals-react';

const ProjectOnboardingUsers = ({ step, action }: IOnboardingProps) => {
  
  effect(() => {
    console.log('Action inside Users', 'Step:', step.peek(), 'Action:', action?.value)
    switch(action!.value) {
      case 'Back-3':
        step.value = 2
        break
      case 'Next-3':
        step.value = 4
        break
      default:
        break
    }
  })

  return (
    <div> <ProjectUsersList projectId={'PRJ201897'} onBoardScreen="onBoarding"></ProjectUsersList></div>
  )
}

export default ProjectOnboardingUsers