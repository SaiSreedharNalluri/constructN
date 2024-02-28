import React, { useEffect, useState } from 'react';
import { Radio, Button } from '@mui/material';
import {
  BodyContainer,
  CustomTaskProcoreLinks,
} from '../../../divami_components/issue_detail/IssueDetailStyles';
import ProcoreHeader from '../procoreHeader';
import { filesUpload,linkIssueSubmittal,linkTaskSubmittal, listSubmittal, projectFile, showSubmittalDetails, updateAttachmentsExistSubmittal } from '../../../../services/procore';
import CustomLoader from '../../../divami_components/custom_loader/CustomLoader';
import { CustomToast } from '../../../divami_components/custom-toaster/CustomToast';
import { useAppContext } from '../../../../state/appState/context';
import router from 'next/router';
import axios from 'axios';
import { IToolbarAction } from '../../../../models/ITools';
import PopupComponent from '../../../popupComponent/PopupComponent';
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


  const { state: appState} = useAppContext();
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const [oldDescription, setOldDescription]=useState<string>("")
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const procoreCompanyId=procoreProjectDetails?.procore?.companyId;
  const sequenceNumber= issue?.sequenceNumber || task?.sequenceNumber

  const handleBack = () => {
    handleInstance("CloseSubmittal");
  };

  const handlePopup=()=>{
  setShowPopup(false)
  handleBack()
}

  const handleRadioChange = (rfinumber: number) => {
    setSelectedItem(rfinumber);
    
  };
  const fileUploads = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const filesToUpload = [generatedpdf, screenshot, ...(attachment || [])];
            const uploadResponses = [];
    
            for (const file of filesToUpload) {
                const filename = file?.name;
                const contentType = file?.type;
    
                const formattedData = {
                    "response_filename": filename,
                    "response_content_type": contentType,
                };
    
                if (generatedpdf && screenshot) {
                    const response = await filesUpload(procoreProjectId, formattedData);
                    uploadResponses.push(response);
                }
            }
    
            const prostoreFileIds:number[] = [];
    
            for (const response of uploadResponses) {
                if (response) {
                    const id = response.uuid;
                    const index = uploadResponses.indexOf(response);
                    const filename = filesToUpload[index]?.name;
                    const url = response.url;
                    const key = response.fields['key'];
                    const contentType = response.fields['Content-Type'];
                    const contentDisposition = response.fields['Content-Disposition'];
                    const policy = response.fields['policy'];
                    const credential = response.fields['x-amz-credential'];
                    const algorithm = response.fields['x-amz-algorithm'];
                    const date = response.fields['x-amz-date'];
                    const signature = response.fields['x-amz-signature'];
    
                    const formData = new FormData();
    
                    formData.append(`key`, key);
                    formData.append(`Content-Type`, contentType);
                    formData.append(`Content-Disposition`, contentDisposition);
                    formData.append(`policy`, policy);
                    formData.append(`x-amz-credential`, credential);
                    formData.append(`x-amz-algorithm`, algorithm);
                    formData.append(`x-amz-date`, date);
                    formData.append(`x-amz-signature`, signature);
                    formData.append(`file`, filesToUpload[index]);
    
                    const uploadResponse = await axios.post(url, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
    
                    const formdata = new FormData();
                    formdata.append(`file[upload_uuid]`, id);
                    formdata.append(`file[name]`, filename);
    
                    const projectFileResponse = await projectFile(procoreProjectId, formdata);
                    if (projectFileResponse) {
                        const fileVersions = projectFileResponse.file_versions;
    
                        if (fileVersions && fileVersions.length > 0) {
                            const prostoreFileId = fileVersions[0].prostore_file.id;
                            prostoreFileIds.push(prostoreFileId);
                        } else {
                            console.log('No file versions found in the response.');
                        }
                    }
                }
            }
    
            resolve(prostoreFileIds); 
        } catch (error) {
            reject(error); 
        }
    });
};


const handleLink = async () => {
  try {
    setLoading(true)
    const description =await showSubmittalDetails(selectedItem,procoreProjectId)
 
      const prostoreFileIds:any = await fileUploads();

      const formData= new FormData()
      const selectedSubmittal= submittalData.find((item: any) => item.id === selectedItem);
      const submittalNumber = selectedSubmittal.number;
      if (description && description.attachments && description.attachments.length > 0) {
        description.attachments.forEach((attachment: any) => {
          formData.append(`submittal[prostore_file_ids][]`, attachment.id);
        });
      }
      if (prostoreFileIds && prostoreFileIds.length > 0) {
          for (let i = 0; i < prostoreFileIds.length; i++) {
              formData.append(`submittal[prostore_file_ids][]`, prostoreFileIds[i]);
          }
      }
  
      formData.append(`submittal[number]`, submittalNumber)
    
      formData.append(`submittal[description]`, `${description?.rich_text_description}<a href="${weburl()}"> (#${sequenceNumber} View in ConstructN)</a>`)
      
     

      const response = await updateAttachmentsExistSubmittal(procoreProjectId, selectedItem, formData);
      if (response) {
          CustomToast("submittal linked successfully", 'success');
          handleCloseProcore();
      }
      
      if (issue) {
          const linkResponse = await linkIssueSubmittal(issue.project, issue._id, selectedItem);
          if (linkResponse) {
            let IntegrationObj: IToolbarAction = { type: "RecProcoreIssue", data: linkResponse };
            toolClicked && toolClicked(IntegrationObj)
            getIssues && getIssues(issue.structure)
          }
      } else {
          const linkResponse = await linkTaskSubmittal(task.project, task._id, selectedItem);
          if (linkResponse) {
            let IntegrationObj: IToolbarAction = { type: "RecProcoreTask", data: linkResponse };
            toolClicked && toolClicked(IntegrationObj)
            getTasks && getTasks(task.structure)
          }
      }
  
      
  } catch (error) {
    handleCloseProcore()
      CustomToast("Linking Submittal failed", 'error');
  }
  setLoading(false)
};



  useEffect(() => {
    setLoading(true)
    listSubmittal(procoreProjectId)
    .then((response) => {
      if (response?.data && response?.data.length > 0) {
        setSubmittalData(response?.data);
      } else {
        setShowPopup(true)

      }
      setLoading(false);
    })
    .catch((error) => {

      if(error?.response?.status === 403){
        setShowPopup(false)

        CustomToast(error?.response.data.errors,'error')
        handleBack()
        // setLoading(false)
      }
      if(error.response.status === 400){
        CustomToast(error.response.errors,'error')
      }
      setLoading(false)
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
                color='warning'
                 size='small'
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
        {showPopup?(<PopupComponent 
        modalTitle={'Warning'} 
        modalmessage={'There Is No Submittal Do You Want To Create It?'}
         primaryButtonLabel={'Yes'} 
         SecondaryButtonlabel={'Cancel'}
         secondaryCallback={handlePopup}
          setShowPopUp={setShowPopup}
           open={true}
           callBackvalue={() => {
           setShowPopup(false)
           handleInstance("Link_new_submittal");
          }}></PopupComponent>):(<div></div>)}
        
      </CustomTaskProcoreLinks>
    </>
  );
};

export default LinkExistingSubmittal;
