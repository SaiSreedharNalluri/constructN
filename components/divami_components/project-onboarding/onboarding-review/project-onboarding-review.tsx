import React from 'react'
import { IOnboardingProps } from '../projectOnboarding'
import { Signal, effect, useComputed, useSignal, useSignalEffect } from '@preact/signals-react'
import { getStructureList } from '../../../../services/structure';
import { IStructure } from '../../../../models/IStructure';
import { IDesign } from '../../../../models/IDesign';
import { CustomToast } from '../../custom-toaster/CustomToast';
import router from "next/router";
import { updateProjectInfo } from '../../../../services/project';
import PopupComponent from '../../../popupComponent/PopupComponent';


const contentStyle = {
  width: "fit-content", // Adjust the width of the content
  textAlign: 'left', // Align content text as needed
};

const ProjectOnboardingReview = ({ step, action, projectId, projectDetails, usersCount }: IOnboardingProps) => {

  const bimCount = useSignal(0)
  const drawingsCount = useSignal(0)
  const totalCount = useSignal(0)

  const showPopUp = useSignal(false)

  const renderPopup = useComputed(() => showPopUp.value === true ? <PopupComponent
    open={showPopUp.value}
    setShowPopUp={(state: boolean) => { showPopUp.value = state }}
    modalTitle={"Success"}
    modalmessage={"The project has been successfully created. You can access the project only after the project has been approved. You will receive an email once the project is ready to use."}
    primaryButtonLabel={"Ok"}
    SecondaryButtonlabel={""}
    callBackvalue={() => {
      showPopUp.value = false
      router.push("/projects")
    }}
  /> : <></>)

  useSignalEffect(() => {
    console.log('Action inside review', 'Step:', step.peek(), 'Action:', action?.value, 'Project ID:', projectId.peek())
    switch (action!.value) {
      case 'Back-4':
        step.value = 3
        action!.value = ''
        break
      case 'Next-4':
        updateProjectInfo({status: 'PendingApproval'}, projectId.value = projectDetails.peek()._id ?? '' as string).then((response: any) => {
          showPopUp.value = true
        }).catch((error) => {
          console.error('Error submitting project for review:', error);
          CustomToast('Error submitting project for review', 'error')
          console.log("error");
          if (action) action.value = ''
        });
        break
      default:
        break
    }
  })

  const renderContent = useComputed(() => <><div className="shadow-md rounded-md p-4 mb-4 ">
  {generateGridRow("Project Name", [projectDetails.value.name])}
  {generateGridRow("Project Nickname", [projectDetails.value.nickName ? projectDetails.value.nickName : "N/A"])}
  {generateGridRow("Project ID", [projectDetails.value.metaDetails?.projectId])}
  {generateGridRow("Project Address", [
    `${projectDetails.value.address?.line1 ? projectDetails.value.address.line1 : ""}`,
    `${projectDetails.value.address?.city} ,${projectDetails.value.address?.state},${projectDetails.value.address?.country}`,
    `${projectDetails.value.address?.zipcode}`,
  ])}
  {generateGridRow("Drawings Uploaded", [drawingsCount.value == 0 ? 'NO' : 'YES'])}
  {generateGridRow("No, of Drawings Uploaded", [drawingsCount.value])}
  {generateGridRow("BIM Uploaded", [bimCount.value == 0 ? 'NO' : 'YES'])}
</div></>)

  getStructureList(projectId.value).then(res => {
    if (res.data.success === true) {
      const structures = res.data.result
      let drawings = 0
      let bim = 0
      let total = 0
      structures.forEach((structure: IStructure) => {
        const designs = structure.designs
        designs?.forEach((design: IDesign) => {
          if (design.type == 'Plan Drawings') {
            drawings++
            total++
          }
          else if (design.type == 'BIM') bim++
        })
        console.log(total, bim, drawings)
      })
      bimCount.value = bim
      drawingsCount.value = drawings
      totalCount.value = total
    }
  }).catch(err => console.log(err))


  function generateGridRow(label: string, values: any) {
    return (
      <div className="grid grid-cols-2 gap-4 p-1">
        <div>
          <p className="mb-0 font-semibold">{label}</p>
        </div>
        <div>
          {values.map((value: string, index: number) => (
            <p key={index} className="text-black-500 mb-0">
              {value}
            </p>
          ))}
        </div>
        {renderPopup}
      </div>
    );
  }
  return (
    <><div className="flex justify-center items-center ">
      <div>
        <div className="col-span-4">
          {renderContent}
        </div>
      </div>
    </div></>
  )
}

export default ProjectOnboardingReview