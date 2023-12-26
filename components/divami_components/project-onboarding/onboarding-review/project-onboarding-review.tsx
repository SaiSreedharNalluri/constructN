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
  function generateGridRow(label:string, values:any) {    
    return (
      <div className="grid grid-cols-2 gap-4 p-1">
        <div>
          <p className="mb-0 font-semibold">{label}</p>
        </div>
        <div>
        {values.map((value:string, index:number) => (
          <p key={index} className="text-black-500 mb-0">
           {value}
          </p>
        ))}
        </div>
      </div>
    );
  }
  return (

<div className="flex justify-center items-center ">
  <div>
    <div className="col-span-4">
      <div className="shadow-md rounded-md p-4 mb-4 ">
      {generateGridRow("Project Name", [projectDetails.value.name])}
        {generateGridRow("Project Nickname", [projectDetails.value.nickName ? projectDetails.value.nickName : "N/A"])}
        {generateGridRow("Project ID", [projectDetails.value._id])}
        {generateGridRow("Project Address", [
          `${projectDetails.value.address?.line1 ? projectDetails.value.address.line1 : ""}`,
          `${projectDetails.value.address?.city} ,${projectDetails.value.address?.state},${projectDetails.value.address?.country }`,
          `${projectDetails.value.address?.zipcode}`,
        ])}
         {generateGridRow("Floor Plans Uploaded", [])}
         {generateGridRow("No, of maps Uploaded", [])}
         {generateGridRow("Levels without any maps", [])}
         {generateGridRow("BIM Uploaded", [])}
         {generateGridRow("Number of Users", [])}
      </div>
    </div>
  </div>
</div>

  )
}

export default ProjectOnboardingReview