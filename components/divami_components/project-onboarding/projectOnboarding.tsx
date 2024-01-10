'use client'
import React, { FC, useEffect } from 'react'
import Header from '../header/Header'
import ProjectOnboardingStepper from './onboarding-details/projectOnboardingStepper'
import ProjectOnboardingFooter from './onboarding-details/projectOnboardingFooter'
import ProjectOnboardingForm from './onboarding-details/projectOnboardingForm'
import ProjectOnboardingUsers from './onboarding-users/projectOnboardingUsers'
import ProjectOnboardingHierarchy from './onboarding-hierarchy/project-onboarding-hierarchy'
import ProjectOnboardingSheets from './onboarding-sheets/project-onboarding-sheets'
import ProjectOnboardingBIM from './onboarding-bim/projectOnboardingBIM'
import ProjectOnboardingReview from './onboarding-review/project-onboarding-review'
import { useSignal, Signal } from '@preact/signals-react'
import { useComputed } from '@preact/signals-react/runtime'
import { IProjects } from '../../../models/IProjects'
import { getProjectDetails, updateProjectInfo } from '../../../services/project'
import { useRouter } from 'next/router'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { IStructure } from '../../../models/IStructure'
import CustomLoader from '../custom_loader/CustomLoader'

export type IOnboardingProps = {
  step: Signal<number>
  action?: Signal<string>
  projectId: Signal<string>
  hierarchy?: Signal<IStructure[]>
  projectDetails: Signal<IProjects>
  usersCount?: Signal<number>
  showLoader?: Signal<boolean>
  loader?:Signal<boolean>
}

const ProjectOnboarding = () => {

  const step = useSignal(0)
  const usersCount = useSignal(0)
  const action = useSignal('')
  const projectId = useSignal('')
  const structureId = useSignal('')
  const hierarchy = useSignal([])
  const showLoader = useSignal(false)
  const projectDetails: any = useSignal({ type: 'Residential' })
 const loader=useSignal(false)
  const router = useRouter()

  useEffect(() => {
    if (router.isReady && router.query.id) {
      getProjectDetails(router.query.id as string).then((res) => {
        const result = res.data.result;
        delete result.users
        projectDetails.value = result
      })
    }
  }, [router.query])

  const renderLoader = useComputed(() => showLoader.value == true ? <CustomLoader/> : <></>)

  const mainContent = useComputed(() => {

    switch (step.value) {

      case 0:
        return <><ProjectOnboardingForm
          step={step}
          projectId={projectId}
          action={action}
          projectDetails={projectDetails}
          showLoader={showLoader}
        /></>

      case 1:
        return <><ProjectOnboardingSheets
          step={step}
          projectId={projectId}
          action={action}
          hierarchy={hierarchy}
          projectDetails={projectDetails}
          showLoader={showLoader}
          loader={loader}
        /></>

      case 2:
        return <><ProjectOnboardingBIM
          step={step}
          projectId={projectId}
          hierarchy={hierarchy}
          action={action}
          projectDetails={projectDetails}
          showLoader={showLoader}
          loader={loader}
        /></>

      case 3:
        return <><ProjectOnboardingUsers
          step={step}
          projectId={projectId}
          action={action}
          projectDetails={projectDetails}
          usersCount={usersCount}
          showLoader={showLoader}
        /></>

      case 4:
        return <><ProjectOnboardingReview
          step={step}
          projectId={projectId}
          action={action}
          projectDetails={projectDetails}
          usersCount={usersCount}
          showLoader={showLoader}
        /></>

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
      {renderLoader}
    </div>
  )
}

export default ProjectOnboarding

