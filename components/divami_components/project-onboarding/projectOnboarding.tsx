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

  const onboardingStep = useSignal(0)
  const onboardingAction = useSignal('')
  const onboardingProjectId = useSignal('')
  const onboardingStructureId = useSignal('')

  const renderMainContent = () => {

    useSignals()

    switch (onboardingStep.value) {

      case 0:
        return <ProjectOnboardingForm 
          step={onboardingStep} 
          projectId={onboardingProjectId} 
          action={onboardingAction} />

      case 1:
        return <ProjectOnboardingSheets 
        step={onboardingStep} 
        projectId={onboardingProjectId} 
        structureId={onboardingStructureId} 
        action={onboardingAction} />

      case 2:
        return <ProjectOnboardingBIM 
          step={onboardingStep} 
          projectId={onboardingProjectId} 
          structureId={onboardingStructureId} 
          action={onboardingAction} />

      case 3:
        return <ProjectOnboardingUsers 
          step={onboardingStep} 
          projectId={onboardingProjectId} 
          action={onboardingAction} />

      case 4:
        return <ProjectOnboardingReview 
          step={onboardingStep} 
          projectId={onboardingProjectId} 
          action={onboardingAction} />

      default:
        return <></>;
    }
  };

  return (
    <div className="w-full h-full">
      <Header hideSidePanel />
      <div className="flex">
        <div className="flex flex-col w-full  calc-h">
          <header className=''>
            <div className='mt-[20px]'>
              <ProjectOnboardingStepper step={onboardingStep} projectId={onboardingProjectId}></ProjectOnboardingStepper>
            </div>
          </header>

          <div className='pt-[25px]'>
            <main className='overflow-y-auto calc-h235 mx-[60px]  '>
              <div>
                {renderMainContent()}
              </div>
            </main>
            <footer className=" pb-[20px]">
              <ProjectOnboardingFooter step={onboardingStep} projectId={onboardingProjectId} action={onboardingAction} ></ProjectOnboardingFooter>
            </footer></div>
        </div>
      </div>
    </div>
  )
}

export default ProjectOnboarding

