import React, { useEffect, useState } from 'react';
import ProjectAddress from './inputs/projectAddress';
import ProjectLatLngDetails from './inputs/projectLatLngDetails';
import ProjectNameDetails from './inputs/projectNameDetails';
import ProjectTypeDetails from './inputs/projectTypeDetails';
import { createProject, getProjectDetails, updateProjectCover, updateProjectInfo } from '../../../../services/project';
import { IOnboardingProps } from '../projectOnboarding';
import { effect, useSignal, useSignalEffect } from '@preact/signals-react'
import router from "next/router";
import { useComputed, useSignals } from '@preact/signals-react/runtime';
import { CustomToast } from '../../custom-toaster/CustomToast';


const ProjectOnboardingForm = ({ step, action, projectId, projectDetails }: IOnboardingProps) => {
  const onboardingProjectCoverPhoto = useSignal<File | null>(null);
  const onboardingProjectprojectLogo = useSignal<File | null>(null);
  const isNameValid = useSignal(false);
  const isTypeValid = useSignal(false);
  const isLatLngValid = useSignal(false);
  const isAddressValid = useSignal(false);

  // useSignals()

  const renderContent = useComputed(() =>
    <div className='mx-[10px]'>
      <ProjectNameDetails
        details={projectDetails}
        isNameValid={isNameValid}
      />
      <ProjectTypeDetails
        type={projectDetails}
        isTypeValid={isTypeValid}
      />
      <ProjectLatLngDetails
        latlngDetails={projectDetails}
        isLatLngValid={isLatLngValid}
      />
      <ProjectAddress
        addressDetails={projectDetails}
        isAddressValid={isAddressValid}
        projectCoverPhoto={onboardingProjectCoverPhoto}
        projectLogo={onboardingProjectprojectLogo}
      />
    </div>)

  useSignalEffect(() => {
    switch (action!.value) {
      case 'Back-0':
        router.push("/projects");
        break
      case 'Next-0':
        //  Validate Form
        //  Create Project API
        //  On Complete callback increment        
        if (isLatLngValid.peek() === true && isAddressValid.peek() === true && isTypeValid.peek() === true && isNameValid.peek() === true) {
          const formData = projectDetails
          const formdata: any = new FormData();
          formdata.append('jreq', JSON.stringify(formData.peek()));
          formdata.append('logo', onboardingProjectprojectLogo?.peek());
          formdata.append('coverPhoto', onboardingProjectCoverPhoto?.peek());
          if (projectDetails.peek()._id === undefined) {
            createProject(formdata)
              .then((res) => {
                const result = res.result;
                delete result.users
                projectDetails.value = result
                step.value = 1
                projectId.value = projectDetails.peek()._id ?? ''
              })
              .catch((error) => {
                console.error('Error creating project:', error);
                console.log("error");
              });
          }
          else {
            updateProjectInfo(formdata, projectId.value = projectDetails.peek()._id ?? '' as string).then((response: any) => {
              const result = response.result;
              delete result.users
              projectDetails.value = result
            })
            step.value = 1

          }
        } else {
          CustomToast('Fill all the necessary fields', 'error')
          if (action) action.value = ''
        }
        // projectId.value = 'PRJ061491'
        // step.value = 1

        break
      default:
        break
    }
  })

  return (
    <>{renderContent}</>
  );
};

export default ProjectOnboardingForm;