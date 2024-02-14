import React, { useEffect, useState } from 'react';
import { Radio, Button } from '@mui/material';
import {
  BodyContainer,
  CustomTaskProcoreLinks,
} from '../../../divami_components/issue_detail/IssueDetailStyles';
import ProcoreHeader from '../procoreHeader';
import ProcoreFooter from '../procoreFooter';
import { filesUpload,linkIssueSubmittal,linkTaskSubmittal, listSubmittal,  showSubmittalDetails, updateAttachmentsExistSubmittal } from '../../../../services/procore';
import CustomLoader from '../../../divami_components/custom_loader/CustomLoader';
import { CustomToast } from '../../../divami_components/custom-toaster/CustomToast';
import { IprocoreActions } from '../../../../models/Iprocore';
import { useAppContext } from '../../../../state/appState/context';
import router from 'next/router';
import axios from 'axios';
import { IToolbarAction } from '../../../../models/ITools';
interface IProps{
  issue:any
  task:any
  handleCloseProcore:any
  getIssues?:(s:string)=>{} | undefined;
  getTasks?:(s:string)=>{} | undefined;
  generatedpdf:any
  weburl:any
  toolClicked?: (toolAction: IToolbarAction) => void;
  screenshot:any
  handleInstance:any
  attachment:any
}
const LinkExistingSubmittal : React.FC<IProps> = ({
    issue,
    task,
    handleCloseProcore,
    getIssues,
    getTasks
    ,generatedpdf,
    weburl,
    toolClicked,
    screenshot,
    handleInstance,
    attachment
  }) => {
  const [loading, setLoading] = useState(false)
  // const { handleInstance,} = props as any;
  
  const [submittalData,setSubmittalData] = useState<any[]>([]);
  const [footerState, SetFooterState] = useState(true);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [genPDF,setGenPDF] = useState(generatedpdf)

  const { state: appState} = useAppContext();
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const [oldDescription, setOldDescription]=useState<string>()
  const procoreCompanyId=procoreProjectDetails?.procore?.companyId;
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
    showSubmittalDetails(rfinumber,procoreProjectId).then((response:any)=>{
      if(response){
        setOldDescription(response.rich_text_description)
      }
    })
  };
  const [uuid,setUuid] =useState<number[]>([]);
  useEffect (()=>{
    const responseFilename = generatedpdf.name;
    const responseContentType = generatedpdf.type;
    
    const formattedResult = {
        "response_filename": responseFilename,
        "response_content_type": responseContentType,
    };

     filesUpload(procoreProjectId,formattedResult)
     .then((response:any)=>{
       if(response){
         const id=response.uuid;
          const url =response.url;
         const key = response.fields['key'];
const contentType = response.fields['Content-Type'];
const contentDisposition = response.fields['Content-Disposition'];
const policy = response.fields['policy'];
const credential = response.fields['x-amz-credential'];
const algorithm =response.fields['x-amz-algorithm'];
const date =response.fields['x-amz-date'];
const signature =response.fields['x-amz-signature'];
     const formData=new FormData()
  
     formData.append(`key`,key);
     formData.append(`Content-Type`,contentType);
     formData.append(`Content-Disposition`,contentDisposition);
     formData.append(`policy`,policy)
     formData.append(`x-amz-credential`,credential)
     formData.append(`x-amz-algorithm`,algorithm)
     formData.append(`x-amz-date`,date)
     formData.append(`x-amz-signature`,signature);
     formData.append(`file`,generatedpdf)

      
     axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {

      })
      .catch(error => {
        console.error('There was a problem with your Axios request:', error);
      });

         
          setUuid(prevUuid => [...prevUuid, response.uuid]);



       }
     })

  },[])

  const handleLink = () => {
    
     const formData:any = new FormData()
    const selectedSubmittal:any = submittalData.find((item:any)=> item.id === selectedItem);
    const submittalNumber = selectedSubmittal.number;
    
    formData.append(`submittal[number]`,submittalNumber)
    formData.append(`submittal[description]`,`${oldDescription}<a href="${weburl()}"> (${sequenceNumber} View in ConstructN)</a>`)
   // formData.append(`submittal[attachments][${generatedpdf.name}]`, generatedpdf)
    formData.append(`submittal[prostore_file_ids]`,uuid as number[])

    try{
    if (issue) {

      linkIssueSubmittal(issue.project, issue._id,selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            let IntegrationObj: IToolbarAction = { type: "RecProcoreIssue", data: linkResponse };
            toolClicked && toolClicked(IntegrationObj)
            getIssues && getIssues(issue.structure)
          }
        })
    } else {
      linkTaskSubmittal(task.project, task._id, selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            let IntegrationObj: IToolbarAction = { type: "RecProcoreTask", data: linkResponse };
            toolClicked && toolClicked(IntegrationObj)
            getTasks && getTasks(task.structure)
          }
        })
       
    }
    updateAttachmentsExistSubmittal(procoreProjectId,selectedItem,formData)
    .then((response)=>{
        if(response){
          
          CustomToast("submittal linked successfully",'success');
          handleCloseProcore();
        }
    })
  }
    catch(error){
        CustomToast("Linking Submittal failed",'error');
    }
  };


  useEffect(() => {
    setLoading(true)
    listSubmittal(procoreProjectId)
    .then((response: any) => {
      setSubmittalData(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching submittal data:', error);
    });
   
  }, [router.isReady])
  

  return (
    <>
      <CustomTaskProcoreLinks>
        <ProcoreHeader handleInstances={handleBack} heading={'Existing Submittal'}></ProcoreHeader>
        {loading?(<div>
        <CustomLoader></CustomLoader>
      </div>):(<div>
        <BodyContainer footerState={footerState} className='h-[400px]'>
        <h3><b>Choose Anyone Submittal to Link.</b></h3>
          {submittalData && submittalData.length > 0 && (
            <ul>
           { submittalData.map((rfi:any) => (
              <div key={rfi.id} className="rfi-item">
                <Radio
                  checked={selectedItem === rfi.id}
                  onChange={() => handleRadioChange(rfi.id)}
                />
                <label htmlFor={`rfiRadio${rfi.id}`}>
                  {`${rfi.title} (#${rfi.number})`}
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

export default LinkExistingSubmittal;
