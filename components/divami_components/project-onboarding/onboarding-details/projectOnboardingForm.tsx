import React, { useEffect, useState } from 'react';
import ProjectAddress from './inputs/projectAddress';
import ProjectLatLngDetails from './inputs/projectLatLngDetails';
import ProjectNameDetails from './inputs/projectNameDetails';
import ProjectTypeDetails from './inputs/projectTypeDetails';
import { createProject, getProjectDetails, updateProjectCover, updateProjectInfo } from '../../../../services/project';
import { useProjectContext } from '../../../../state/projectState/context';
import { Button, Grid, OutlinedInput } from '@mui/material';
import { Address, IProjects } from '../../../../models/IProjects';
import { useRouter } from 'next/router';
import { IOnboardingProps } from '../projectOnboarding';
import { effect, useSignal, useSignalEffect } from '@preact/signals-react'
import router from "next/router";


const ProjectOnboardingForm = ({ step, action, projectId,projectDetails }: IOnboardingProps) => {
  // const projectDetails = useSignal<Partial<IProjects>>({});
  
   const isNameValid=useSignal({});
   const isTypeValid=useSignal({});
   const isLatLngValid=useSignal({});
   const isAddressValid=useSignal({});
   console.log(isLatLngValid.peek(),"lat parent");
   console.log(isAddressValid.peek(),"address parent");
   console.log(isTypeValid.peek(),"type parent");
   console.log(isNameValid.peek(),"name parent");
  //  console.log(if( projectId.value) { projectDetails.peek()._id},"meknfenjkinkjnkjnijnkijnkijniunui");

   
  useSignalEffect(() => {
    switch(action!.value) {
      case 'Back-0':
        router.push("/projects");
        break
      case 'Next-0':
        //  Validate Form
        //  Create Project API
        //  On Complete callback increment
        if(isLatLngValid.peek()===true&&isAddressValid.peek()===true&&isTypeValid.peek()===true&&isLatLngValid.peek()===true){          
          const formData = projectDetails
          const formdata:any = new FormData();
          formdata.append('jreq', JSON.stringify(formData.peek())); 
          if(projectDetails.peek()._id===undefined){            
            createProject(formdata)
            .then((res) => {
        projectDetails.value=res.result
        step.value = 1
        if(projectId.value)
              projectId.value = projectDetails.peek()._id ?? ''
            })
            .catch((error) => {
            console.error('Error creating project:', error);
            console.log("error");     
            });
            }
            else{
              updateProjectInfo(formdata, projectId.value = projectDetails.peek()._id ?? '' as string).then((response:any)=>{
                projectDetails.value=response.result 
              })
              step.value=1
             
            }
        }
        // projectId.value = 'PRJ061491'
        // step.value = 1
       
        break
      default:
        break
    }
  })

  return (
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
      />
    </div>
  );
};

export default ProjectOnboardingForm;