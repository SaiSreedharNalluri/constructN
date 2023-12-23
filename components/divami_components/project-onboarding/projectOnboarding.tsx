'use client'
import React from 'react'
import Header from '../header/Header'
import ProjectOnboardingStepper from './onboarding-details/projectOnboardingStepper'
import ProjectOnboardingFooter from './onboarding-details/projectOnboardingFooter'
import ProjectOnboardingForm from './onboarding-details/projectOnboardingForm'
import { useProjectContext } from '../../../state/projectState/context'
import { OnBoardingStep } from '../../../state/projectState/state'
import ProjectOnboardingUsers from './onboarding-users/projectOnboardingUsers'
import ProjectOnboardingHierarchy from './onboarding-hierarchy/project-onboarding-hierarchy'
import ProjectOnboardingSheets from './onboarding-sheets/project-onboarding-sheets'
import ProjectOnboardingBIM from './onboarding-bim/projectOnboardingBIM'
import ProjectOnboardingReview from './onboarding-review/project-onboarding-review'
import { useSignal, Signal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'

export type IOnboardingProps = {
  step: Signal<number>
  action?: Signal<string>
  projectId: Signal<string>
  structureId?: Signal<string>
}

const ProjectOnboarding = () => {

  const step = useSignal(0)
  const action = useSignal('')
  const projectId = useSignal('')
  const structureId = useSignal('')

  return (
    <div className="w-full h-full">
      <Header hideSidePanel />
      <div className="flex">
        <div className="flex flex-col w-full  calc-h">
          <header className=''>
            <div className='mt-[20px]'>
              <ProjectOnboardingStepper step={step} projectId={projectId}></ProjectOnboardingStepper>
            </div>
          </header>
 
          <div className='pt-[25px]'>
            <main className='overflow-y-auto calc-h235 mx-[60px]  '>
              <div>
                {renderMainContent({step, action, projectId, structureId})}
              </div>
            </main>
            <footer className=" pb-[20px]">
              <ProjectOnboardingFooter step={step} projectId={projectId} action={action} ></ProjectOnboardingFooter>
            </footer></div>
        </div>
      </div>
    </div>
  )
}

const renderMainContent = ({step, action, projectId, structureId}: IOnboardingProps) => {

  useSignals()

  switch (step.value) {

    case 0:
      return <ProjectOnboardingForm 
        step={step} 
        projectId={projectId} 
        action={action} />

    case 1:
      return <ProjectOnboardingSheets 
      step={step} 
      projectId={projectId} 
      structureId={structureId} 
      action={action} />

    case 2:
      return <ProjectOnboardingBIM 
        step={step} 
        projectId={projectId} 
        structureId={structureId} 
        action={action} />

    case 3:
      return <ProjectOnboardingUsers 
        step={step} 
        projectId={projectId} 
        action={action} />

    case 4:
      return <ProjectOnboardingReview 
        step={step} 
        projectId={projectId} 
        action={action} />

    default:
      return <></>;
  }
};


export default ProjectOnboarding

