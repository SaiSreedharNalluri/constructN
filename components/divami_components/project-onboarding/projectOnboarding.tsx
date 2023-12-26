'use client'
import React, { FC, useEffect } from 'react'
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
import { useComputed, useSignalEffect, useSignals } from '@preact/signals-react/runtime'
import { IProjects } from '../../../models/IProjects'
import { getProjectDetails, updateProjectInfo } from '../../../services/project'
import { useRouter } from 'next/router'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { IStructure } from '../../../models/IStructure'

export type IOnboardingProps = {
  step: Signal<number>
  action?: Signal<string>
  projectId: Signal<string>
  hierarchy?: Signal<IStructure[]>
  projectDetails: Signal<IProjects>
}

const ProjectOnboarding = () => {

  const step = useSignal(0)
  const action = useSignal('')
  const projectId = useSignal('')
  const structureId = useSignal('')
  const hierarchy = useSignal([])
  const projectDetails: any = useSignal({type: 'Residential'})
  const router = useRouter()

  useEffect(() => {
    console.log(router.query.id)
    if (router.isReady && router.query.id) {
      getProjectDetails(router.query.id as string).then((res) => {
        console.log(res, "res");

        projectDetails.value = res.data.result
      })
    }
  }, [router.query])

  // useSignalEffect(() => {
  //   console.log(router.isReady, router.query.id)
  //   if (router.isReady && router.query.id) {
  //     getProjectDetails(router.query.id as string).then((res) => {
  //       console.log(res, "res");

  //       projectDetails.value = res.data.result
  //     })
  //   }
  // })

  const mainContent = useComputed(() => {

    switch (step.value) {

      case 0:
        return <><ProjectOnboardingForm
          step={step}
          projectId={projectId}
          action={action}
          projectDetails={projectDetails} /></>
  
      case 1:
        return <><ProjectOnboardingSheets
          step={step}
          projectId={projectId}
          action={action}
          hierarchy={hierarchy}
          projectDetails={projectDetails} /></>
  
      case 2:
        return <><ProjectOnboardingBIM
          step={step}
          projectId={projectId}
          hierarchy={hierarchy}
          action={action}
          projectDetails={projectDetails} /></>
  
      case 3:
        return <><ProjectOnboardingUsers
          step={step}
          projectId={projectId}
          action={action}
          projectDetails={projectDetails} /></>
  
      case 4:
        return <><ProjectOnboardingReview
          step={step}
          projectId={projectId}
          action={action}
          projectDetails={projectDetails} /></>
  
      default:
        return <></>;
    }
  })

  return (
    <div className="w-full h-full">
      <Header hideSidePanel />
      <div className="flex">
        <div className="flex flex-col w-full  calc-h">
          <header className=''>
            <div className='mt-[20px]'>
              <ProjectOnboardingStepper step={step} projectId={projectId} projectDetails={projectDetails}></ProjectOnboardingStepper>
            </div>
          </header>

          <div className='pt-[25px]'>
            <main className='overflow-y-auto calc-h235 mx-[60px]  '>
              <div>
                {mainContent}
              </div>
            </main>
            <footer className=" pb-[20px]">
              <ProjectOnboardingFooter step={step} projectId={projectId} action={action} projectDetails={projectDetails} ></ProjectOnboardingFooter>
            </footer></div>
        </div>
      </div>
    </div>
  )
}

export default ProjectOnboarding

