import React from 'react'
import Header from '../header/Header'
import ProjectOnboardingStepper from './onboarding-details/projectOnboardingStepper'
import ProjectOnboardingFooter from './onboarding-details/projectOnboardingFooter'
import ProjectOnboardingForm from './onboarding-details/projectOnboardingForm'
const ProjectOnboarding=()=> {
  return (
    <div className="w-full h-full">
    <Header hideSidePanel  />
    <div className="flex mx-[60px] ">
      <div className="flex flex-col w-full  calc-h">
        <header className=''>
        <div className='mt-[20px]'>
           <ProjectOnboardingStepper></ProjectOnboardingStepper>   
       </div>
        </header>
   
        <div>
        <main className='overflow-y-auto calc-h180 pt-[10px] '>
          <div>
<ProjectOnboardingForm></ProjectOnboardingForm>
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