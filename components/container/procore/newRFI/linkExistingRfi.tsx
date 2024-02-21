import React, { useEffect, useState } from 'react';
import { Radio, Button } from '@mui/material';
import {
  BodyContainer,
  CustomTaskProcoreLinks,
} from '../../../divami_components/issue_detail/IssueDetailStyles';
import ProcoreHeader from '../procoreHeader';
import { ListRfi, linkIssueRfi,linkTaskRfi, updateAttachmentsExistRfi, } from '../../../../services/procore';
import CustomLoader from '../../../divami_components/custom_loader/CustomLoader';
import { CustomToast } from '../../../divami_components/custom-toaster/CustomToast';
import { IprocoreActions } from '../../../../models/Iprocore';
import { useAppContext } from '../../../../state/appState/context';
import { IToolbarAction } from '../../../../models/ITools';
interface IProps{
  issue:any;
  task:any;
  handleCloseProcore:any;
  getIssues?:(s:string)=>{} | undefined;
  getTasks?:(s:string)=>{} | undefined;
    generatedpdf:any
    weburl:any
    screenshot:any
    attachment:any
    toolClicked?: (toolAction: IToolbarAction) => void;
    handleInstance:any

}
const LinkExistingRfi: React.FC<IProps> = ({
    issue,task,
    handleCloseProcore,
    getIssues,
    getTasks,
    generatedpdf,
    weburl,
    screenshot,
    attachment,
    toolClicked,
    handleInstance
  }) => {
  const [loading, setLoading] = useState(false)
  // const { handleInstance } = props as any;
  const [footerState, SetFooterState] = useState(true);
  const [rfiData, setRfiData] = useState<any[]>([]);
  const [questionBody, setQuestionBody] = useState('');
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
  const existingResponse = ()=>{
    rfiData.map((rfi:any)=>{
      if(rfi.id===selectedItem){
        if (rfi.questions) {
          if (rfi.questions[0]?.body) {
            setQuestionBody(rfi.questions[0].body);
          }
        }
      }
    })
  }
 useEffect(()=>{
  existingResponse()
 },[selectedItem])

  const handleLink = () => {
    
 const formData:any=new FormData()
    formData.append(`rfi[question][body]`,`${questionBody} <a href=\"${weburl()}\"> #${sequenceNumber}( View in ConstructN)</a>`)
   formData.append(`rfi[question][attachments][${generatedpdf.name}]`,generatedpdf);
   if (attachment && attachment.length > 0) {
    for (let i = 0; i < attachment.length; i++) {
      formData.append(`rfi[question][attachments][${attachment[i].name}]`, attachment[i]);
    }
  }
   formData.append(`rfi[question][attachments][ScreenShot]`,screenshot);
    try{
    if (issue) {
     linkIssueRfi(issue.project, issue._id, selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            let IntegrationObj: IToolbarAction = { type: "RecProcoreIssue", data: linkResponse };
            toolClicked && toolClicked(IntegrationObj)
            getIssues && getIssues(issue?.structure)
           }
        })
        } else {
      linkTaskRfi(task.project, task._id, selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            let IntegrationObj: IToolbarAction = { type: "RecProcoreTask", data: linkResponse };
            toolClicked && toolClicked(IntegrationObj)
            getTasks && getTasks(task?.structure)
          }
        })
    }
    updateAttachmentsExistRfi(procoreProjectId,selectedItem,formData).then((response)=>{
      if(response){
        CustomToast("RFI linked successfully", 'success');
        handleCloseProcore();
       }
    })
  }
  catch(error){
     CustomToast("Linking RFI failed", 'error');
  }
  };

  useEffect(() => {
    setLoading(true)
    ListRfi(procoreProjectId)
      .then((response: any) => {
      
        setRfiData(response.data);
       
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching RFI data:', error);
      });
    }, [])
  return (
    <>
      <CustomTaskProcoreLinks>
        <ProcoreHeader handleInstances={handleBack} heading={'Existing RFI'}></ProcoreHeader>
        {loading?(<div>
        <CustomLoader></CustomLoader>
      </div>):(<div>
        <BodyContainer footerState={footerState} className='h-[400px]'>
        <h3><b>Choose Anyone RFI to Link.</b></h3>
          {Array.isArray(rfiData) &&
            rfiData.map((rfi) => (
              <div key={rfi.id} className="rfi-item">
                <Radio
                  checked={selectedItem === rfi.id}
                  onChange={() => handleRadioChange(rfi.id)}
                />
                <label htmlFor={`rfiRadio${rfi.id}`}>
                  {`${rfi.subject} (#${rfi.full_number})`}
                </label>
              </div>
            ))}
         
            
          
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

export default LinkExistingRfi;
