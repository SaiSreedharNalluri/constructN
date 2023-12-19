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
const ProjectOnboarding=()=> {
  const { state:onboardingState} = useProjectContext();
  const renderMainContent = () => {
    switch (onboardingState.step) {
      case OnBoardingStep.ProjectDetails:
        return (
          <ProjectOnboardingForm />
        );
      case OnBoardingStep.ProjectHierachy:
        return (
          <ProjectOnboardingSheets />
        );
      case OnBoardingStep.Sheets:
        return (
          <ProjectOnboardingSheets />
        );
      case OnBoardingStep.BIM:
          return(
            <ProjectOnboardingBIM/>
        );
      case OnBoardingStep.AddUsers:
        return (
          <ProjectOnboardingUsers />
        );

      default:
        return null;
    }
  };
  return (
    <div className="w-full h-full">
    <Header hideSidePanel  />
    <div className="flex">
      <div className="flex flex-col w-full  calc-h">
        <header className=''>
        <div className='mt-[20px]'>
           <ProjectOnboardingStepper></ProjectOnboardingStepper>   
       </div>
        </header>
   
        <div className='pt-[25px]'>
        <main className='overflow-y-auto calc-h235 mx-[60px]  '>
          <div>
          {renderMainContent()}
          </div>
        </main>
        <footer className=" pb-[20px]">
    <ProjectOnboardingFooter></ProjectOnboardingFooter>
        </footer></div>
      </div>
    </div>
    <div >
    </div>
    </div>
  )
}

export default ProjectOnboarding