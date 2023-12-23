import React from 'react'
import { IOnboardingProps } from '../projectOnboarding'
import { effect } from '@preact/signals-react'


const contentStyle = {
  width: "fit-content", // Adjust the width of the content
  textAlign: 'left', // Align content text as needed
};

const ProjectOnboardingReview = ({ step, action ,projectId, projectDetails}: IOnboardingProps) => {
console.log(projectDetails.value);

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
    <div className="flex justify-center items-center mt-[16px]">
    <div >
      <div className="col-span-4">
        <div className="shadow-md rounded-md p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            <div>
              <p className="mb-0 font-semibold">Project Name :</p>
            </div>
            <div>
            {projectDetails.value.name}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            <div>
              <p className="mb-0 font-semibold"> Project Nickname :</p>
            </div>
            <div>
    
            {projectDetails.value.projectNickName}

            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            <div>
              <p className="mb-0 font-semibold">Project ID :</p>
            </div>
            <div>
            {projectDetails.value.projectNickName}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            <div>
              <p className="mb-0 font-semibold"> Project Address :</p>
            </div>
            <div>
            {projectDetails.value.projectNickName}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            <div>
              <p className="mb-0 font-semibold">Floor Plans Uploaded :</p>
            </div>
            <div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            <div>
              <p className="mb-0 font-semibold">No,of maps uploaded:</p>
            </div>
            <div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            <div>
              <p className="mb-0 font-semibold"> Levek without any maps :</p>
            </div>
            <div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            <div>
              <p className="mb-0 font-semibold">BIM Uploaded:</p>
            </div>
            <div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            <div>
              <p className="mb-0 font-semibold"> Levek without any maps:</p>
            </div>
            <div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            <div>
              <p className="mb-0 font-semibold">  Number of Users Added:</p>
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ProjectOnboardingReview