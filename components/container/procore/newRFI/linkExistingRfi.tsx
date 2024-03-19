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
import { useAppContext } from '../../../../state/appState/context';
import { IToolbarAction } from '../../../../models/ITools';
import PopupComponent from '../../../popupComponent/PopupComponent';
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
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const { state: appState} = useAppContext();
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const procoreCompanyId = procoreProjectDetails?.procore?.companyId;
  const sequenceNumber= issue?.sequenceNumber || task?.sequenceNumber
  const handleBack = () => {
    handleInstance('closeRFI');
  };

  const handlePopup=()=>{
    setShowPopup(false)
    handleBack()
  }
  const handleRadioChange = (rfinumber: number) => {
    
    setSelectedItem(rfinumber);
  };
  const existingResponse = ()=>{
    rfiData.map((rfi)=>{
      if(rfi?.id===selectedItem){
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

  const handleLink = async () => {
    if(screenshot !==undefined){
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
     await updateAttachmentsExistRfi(procoreProjectId,selectedItem,formData,procoreCompanyId).then((response)=>{
        if(response){
          CustomToast("RFI linked successfully", 'success');
          handleCloseProcore();
         }
      })
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
   
  }
  catch(error){
    handleCloseProcore()
     CustomToast("Linking RFI failed", 'error');
  }
}else{
    CustomToast('Something went wrong!','error');
  }

  };

  useEffect(() => {
    setLoading(true)
    ListRfi(procoreProjectId,procoreCompanyId)
      .then((response) => {
      if (response.data && response.data.length > 0) {
          setRfiData(response.data);
        } else {
          setShowPopup(true)
         
        }
       
        setLoading(false);
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
                color='warning'
                size='small'
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
        {showPopup?(<PopupComponent 
        modalTitle={'Warning'} 
        modalmessage={'There Is No RFI Do You Want To Create It?'}
         primaryButtonLabel={'Yes'} 
         SecondaryButtonlabel={'Cancel'}
         secondaryCallback={handlePopup}
          setShowPopUp={setShowPopup}
           open={true}
           callBackvalue={() => {
           setShowPopup(false)
          handleInstance("RFI");
          }}></PopupComponent>):(<div></div>)}
      </CustomTaskProcoreLinks>
    </>
  );
};

export default LinkExistingRfi;
