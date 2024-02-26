import React, { useEffect, useState } from 'react';
import { Radio, Button } from '@mui/material';
import {
  BodyContainer,
  CustomTaskProcoreLinks,
} from '../../../divami_components/issue_detail/IssueDetailStyles';
import ProcoreHeader from '../procoreHeader';
import {  linkIssueObservation, linkTaskObservation, listObservation, updateAttachmentsExistObservation } from '../../../../services/procore';
import CustomLoader from '../../../divami_components/custom_loader/CustomLoader';
import { CustomToast } from '../../../divami_components/custom-toaster/CustomToast';
import { useAppContext } from '../../../../state/appState/context';
import { IToolbarAction } from '../../../../models/ITools';
import PopupComponent from '../../../popupComponent/PopupComponent';
interface IProps{
  issue :any
    task:any
    handleCloseProcore:any
    getIssues?:(s:string)=>{} | undefined;
    getTasks?:(s:string)=>{} | undefined;
    generatedpdf:any
    weburl:any
    screenshot:any
    toolClicked?: (toolAction: IToolbarAction) => void;
  attachment:any
  handleInstance:any
}
const LinkExistingObservation: React.FC<IProps> = ({
  issue,
    task,
    handleCloseProcore,
    getIssues,
    getTasks,
    generatedpdf,
    weburl,
    screenshot,
    toolClicked,
  attachment,
  handleInstance
}) => {
  const [loading, setLoading] = useState(false)
  // const { handleInstance } = props as any;
  const [footerState, SetFooterState] = useState(true);
  const [observationData, setObservationData] = useState<any>({});
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const { state: appState} = useAppContext();
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const sequenceNumber= issue?.sequenceNumber || task?.sequenceNumber
  const handleBack = () => {
    handleInstance('CloseObservation');
  };

  const handlePopup=()=>{
      setShowPopup(false)
      handleBack();
  }

  const handleRadioChange = (rfinumber: number) => {
    setSelectedItem(rfinumber);
  };

  const handleLink = async () => {
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
    await  updateAttachmentsExistObservation(selectedItem,formData)
      .then((response)=>{
        if(response){
              CustomToast("Observation linked successfully", 'success');
           handleCloseProcore();
        }
      })
    if (issue) {
      linkIssueObservation(issue.project, issue._id,selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            let IntegrationObj: IToolbarAction = { type: "RecProcoreIssue", data: linkResponse };
            toolClicked && toolClicked(IntegrationObj)
            getIssues && getIssues(issue.structure) 
          }
        })
    } else {
      linkTaskObservation(task.project, task._id, selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            let IntegrationObj: IToolbarAction = { type: "RecProcoreTask", data: linkResponse };
            toolClicked && toolClicked(IntegrationObj)
            getTasks && getTasks(task.structure)
            
          }
        })
    }
   
  }
  catch(error){
    handleCloseProcore();
   CustomToast("Linking Observation failed", 'error');
 }
  };

  useEffect(() => {
    setLoading(true)
    listObservation(procoreProjectId)
      .then((response) => {
      
      //   const sortedObservations = response.data.sort((a: any, b: any) => {
      //     const dateA: Date = new Date(a.updated_at);
      //     const dateB: Date = new Date(b.updated_at);
      //     return dateB.getTime() - dateA.getTime();
      // });
      if(response?.data && response?.data.length > 0){

        const sortedObservations = response?.data.sort((a:any, b:any) => {
          const numA = parseInt(a.number.match(/\d+/)[0], 10); 
          const numB = parseInt(b.number.match(/\d+/)[0], 10);
      
         
          const alphaA = a.number.replace(/\d+/g, '');
          const alphaB = b.number.replace(/\d+/g, ''); 
          
          if (numA !== numB) {
              return numB - numA; 
          } else {
            
              return alphaA.localeCompare(alphaB); 
          }
      });
        setObservationData(sortedObservations);
       
      }else{
      
        setShowPopup(true)

      }setLoading(false)
    })
      .catch((error) => {
        if(error.response.status === 403){
          setShowPopup(false)
          CustomToast(error.response.data.errors,'error')
          handleBack()
          // setLoading(false)
        }
        if(error.response.status === 400){
          CustomToast(error.response.errors,'error')

        }
        setLoading(false)
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
               color='warning'
               size='small'
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
         {showPopup?(<PopupComponent 
        modalTitle={'Warning'} 
        modalmessage={'There Is No Observation Do You Want To Create It?'}
         primaryButtonLabel={'Yes'} 
         SecondaryButtonlabel={'Cancel'}
         secondaryCallback={handlePopup}
          setShowPopUp={setShowPopup}
           open={true}
           callBackvalue={() => {
           setShowPopup(false)
          handleInstance("New_Observation");
          }}></PopupComponent>):(<div></div>)}
        
      </CustomTaskProcoreLinks>
    </>
  );
};

export default LinkExistingObservation;
