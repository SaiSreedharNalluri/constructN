import React from 'react'
import { IOnboardingProps } from '../projectOnboarding'
import { effect } from '@preact/signals-react'

const ProjectOnboardingReview = ({ step, action }: IOnboardingProps) => {

  effect(() => {
    console.log('Action inside Review', 'Step:', step.peek(), 'Action:', action?.value)
    switch(action!.value) {
      case 'Back-4':
        step.value = 3
        break
      case 'Next-4':
        step.value = 5
        break
      default:
        break
    }
  })

  return (
    <div>
        <div>Review Screen</div>
    </div>
  )
}

export default ProjectOnboardingReview