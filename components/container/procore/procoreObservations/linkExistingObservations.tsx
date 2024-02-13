import React, { useEffect, useState } from 'react';
import { Radio, Button } from '@mui/material';
import {
  BodyContainer,
  CustomTaskProcoreLinks,
} from '../../../divami_components/issue_detail/IssueDetailStyles';
import ProcoreHeader from '../procoreHeader';
import ProcoreFooter from '../procoreFooter';
import { ListRfi, linkIssueObservation, linkTaskObservation, listObservation, updateAttachmentsExistObservation } from '../../../../services/procore';
import CustomLoader from '../../../divami_components/custom_loader/CustomLoader';
import { CustomToast } from '../../../divami_components/custom-toaster/CustomToast';
import { IprocoreActions } from '../../../../models/Iprocore';
import { useAppContext } from '../../../../state/appState/context';

const LinkExistingObservation = (props: any) => {
  const {issue,
    task,
    handleCloseProcore,
    getIssues,
    getTasks,
    generatedpdf,
    weburl,
    screenshot,
  attachment}=props as any;
  const [loading, setLoading] = useState(false)
  const { handleInstance } = props as any;
  const [footerState, SetFooterState] = useState(true);
  const [observationData, setObservationData] = useState<any>({});
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const { state: appState} = useAppContext();
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const sequenceNumber= issue?.sequenceNumber || task?.sequenceNumber
  const handleBack = () => {
    let closeNewRFI: IprocoreActions = {
      action: 'newCloseObservation',
      status: false,
    };
    handleInstance(closeNewRFI);
  };

  const handleRadioChange = (rfinumber: number) => {
    setSelectedItem(rfinumber);
  };

  const handleLink = () => {
    const selectedObservation:any = observationData.find((item:any) => item.id === selectedItem);
    const observationObject = {
      name: selectedObservation.name,
      type: selectedObservation.type.id
    };
    const project_id = procoreProjectId?.toString();
    const formData:any =new FormData()
    Object.entries(observationObject).forEach(([key,value])=>{
      formData.append(`observation[${key}]`,String(value))
    })
    formData.append('project_id', project_id);
    formData.append(`observation[description]`,`${selectedObservation.description_rich_text}<a href="${weburl()}"> #${sequenceNumber}( View in ConstructN)</a>`)
    if (attachment && attachment.length > 0) {
      for (let i = 0; i < attachment.length; i++) {
        formData.append(`attachments[${attachment[i].name}]`, attachment[i]);
      }
    }
    formData.append(`attachments[${generatedpdf.name}]`, generatedpdf );
    formData.append(`attachments[screenShot]`,screenshot)
    try{
    if (issue) {
     
      linkIssueObservation(issue.project, issue._id,selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {

            getIssues(issue.structure)
          }
        })
    } else {
      linkTaskObservation(task.project, task._id, selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            getTasks(task.structure)
          }
        })
    }
    updateAttachmentsExistObservation(selectedItem,formData)
    .then((response)=>{
      if(response){
            CustomToast("Observation linked successfully", 'success');
         handleCloseProcore();
      }
    })
  }
  catch(error){
    CustomToast("Linking Observation failed", 'error');
 }
  };

  useEffect(() => {
    setLoading(true)
    listObservation(procoreProjectId)
      .then((response: any) => {
      
        
        setObservationData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching Observation data:', error);
      });
     
    }, [])

  return (
    <>
      <CustomTaskProcoreLinks>
        <ProcoreHeader handleInstances={handleBack} heading={'Existing Observation'}></ProcoreHeader>
        {loading?(<div>
        <CustomLoader></CustomLoader>
      </div>):(<div>
        <BodyContainer footerState={footerState} className='h-[400px]'>
           <h3><b>Choose Anyone Observation to Link.</b></h3>
          {observationData && observationData.length > 0 && (
            <ul>
              {observationData.map((item: any) => (
               <div key={item.id} className="rfi-item">
               <Radio
                 checked={selectedItem === item.id}
                 onChange={() => handleRadioChange(item.id)}
               />
               <label htmlFor={`rfiRadio${item.id}`}>
                 {`${item.name} (#${item.number})`}
               </label>
             </div>
              ))}
            </ul>
          )}
         
            
        
        </BodyContainer>
        <Button className={`mt-4 p-2 w-[150px] font-medium py-2 px-4 rounded hover:bg-border-yellow hover:text-box-white ${
        !selectedItem
          ? 'bg-gray-300 text-white'
          : 'bg-border-yellow text-box-white border border-solid border-border-yellow'
      }`} disabled={!selectedItem}  onClick={handleLink}>
              Link
            </Button>
         </div>)}
        
      </CustomTaskProcoreLinks>
    </>
  );
};

export default LinkExistingObservation;
