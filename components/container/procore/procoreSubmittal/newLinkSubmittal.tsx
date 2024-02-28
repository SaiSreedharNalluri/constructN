import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {CustomTaskProcoreLinks,BodyContainer} from "../../../divami_components/issue_detail/IssueDetailStyles";
import { Field, Form, Formik, FormikProps } from "formik";
import {  Checkbox, Grid, TextField, Tooltip } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { createSubmittal, filesUpload, getSubmittalReceivedFrom, getSubmittalResponsibleContractor, linkIssueSubmittal, linkTaskSubmittal, projectFile } from "../../../../services/procore";
import ProcoreFooter from "../procoreFooter";
import ProcoreHeader from "../procoreHeader";
import * as Yup from 'yup';
import { statusData } from "../../../../utils/Procoreconstants";
import { CustomToast } from "../../../divami_components/custom-toaster/CustomToast";
import { useAppContext } from "../../../../state/appState/context";
import uploaderIcon from "../../../../public/divami_icons/Upload_graphics.svg";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import CustomLoader from "../../../divami_components/custom_loader/CustomLoader";
import axios from "axios";
import { IToolbarAction } from "../../../../models/ITools";
import CustomLabel from "../../../divami_components/custom-label/CustomLabel";
import { AttachedImageDiv } from "../newRFI/linkNewRfi";
import { AttachedImageTitle, DeleteIcon } from "../../issueDetails/IssueDetailStyles";
import { truncateString } from "../../../../pages/projects";
import Delete from "../../../../public/divami_icons/delete.svg";
export const UploaderIcon = styled(Image)({
  cursor: "pointer",
  height: "40px",
  width: "40px",
});
interface IProps{
  handleInstance :any
  rfiManager:any
  receivedForm:any
  responsibleContractor:any
  potentialDistMem:any
  coastCodee:any
  issue:any
  task:any
  handleCloseProcore:any
  specSection:any
  location:any
  getIssues?:(s:string)=>{} | undefined;
  getTasks?:(s:string)=>{} | undefined;
   generatedpdf:any
   screenshot:any
   attachment:any
   weburl:any
   toolClicked?: (toolAction: IToolbarAction) => void;
}
const NewLinkSubmittal  : React.FC<IProps> = ({
    handleInstance,
    rfiManager,
    receivedForm,
    responsibleContractor,
    potentialDistMem,
    coastCodee,
    issue,
    task,
    specSection,
    location,
    handleCloseProcore,
     getIssues,
     getTasks,
     generatedpdf,
     screenshot,
     attachment,
     weburl,
     toolClicked,
    }) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [footerState, setfooterState] = useState(true);
  const [files, setFiles] = useState< File[]>();
  const [isAllFieldsTrue, setIsAllFieldsTrue] = useState(false);
  const [loading, setLoading] = useState(false)
  const formikRef = useRef<FormikProps<any>>(null);
  const { state: appState} = useAppContext();
  const [received, setReceived]=useState([])
  const [responsibleContractorValues, setResponsibleContractorValues]=useState([])
  const [receivedId,setReceivedId]=useState<number|null>(null)
  const [responsibleContractorId, setResponsibleContractorId]=useState<number|null>(null)
  const [dropDownLoading, setDropDownLoading] = useState(false)
  const [showError, setShowError] = useState(false);
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const sequenceNumber= issue?.sequenceNumber || task?.sequenceNumber;

useEffect(()=>{
  console.log("useEffect statred");
  
  setDropDownLoading(true)
  getSubmittalReceivedFrom(procoreProjectId,responsibleContractorId).then((response:any)=>{
    console.log("useEffect api");
    
     if(response){
      setReceived(response)
      setDropDownLoading(false)
  }
  })
  },[responsibleContractorId])

  useEffect(()=>{
    setDropDownLoading(true)
    console.log("useEffect 2nd use");
    getSubmittalResponsibleContractor(procoreProjectId,receivedId).then((response:any)=>{
      console.log("useEffect 2nd api");
      if(response){
        console.log("useEffect 2nd resp",response);
        setResponsibleContractorValues(response)
        setDropDownLoading(false)
      }
    })
  
  },[receivedId])

const handleResponsibleContractor =(e:ChangeEvent<HTMLInputElement>)=>{
  console.log("event",e.target.value);
  
    const selectedValue =parseFloat(e.target.value)
    setResponsibleContractorId(isNaN(selectedValue)?null:selectedValue)
  
}

const handleRecievedFrom =(e:ChangeEvent<HTMLInputElement>)=>{
  const selectedValue =parseFloat(e.target.value)
  setReceivedId(isNaN(selectedValue)?null:selectedValue)
  
}

const handleDelete = (indexToRemove:number) => {
  const updatedFiles:any = files?.filter((file, index) => index !== indexToRemove);
  setFiles(updatedFiles); 
};
  const initialValues: {
    title: string;
    specification_section_id: number | null;
    number: string;
    revision: string;
    type: string;
    submittal_package_id: number | null;
    responsible_contractor_id: number | null;
    received_from_id: number | null;
    submittal_manager_id: number | null;
    status_id: number | null;
    submit_by: string;
    received_date: string;
    issue_date: string;
    cost_code_id: number | null;
    location_id: number | null;
    distribution_member_ids: [];
    lead_time: number | null;
    required_on_site_date: string;
    private: boolean;
    description: string;
    attachments:Blob[]
   
  } = {
    title: issue?.title || task.title,
    specification_section_id: null,
    number: "",
    revision: "",
    type: "",
    submittal_package_id: null,
    responsible_contractor_id: null,
    received_from_id: null,
    submittal_manager_id: null,
    status_id: null,
    submit_by: "",
    received_date: "",
    issue_date: "",
    cost_code_id: null,
    location_id: null,
    distribution_member_ids: [],
    lead_time: null,
    required_on_site_date: "",
    private: false,
    attachments:[],
    description: issue?.description || task?.description || "",
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => {
      if (!prevFiles) {
        prevFiles = [];
      }
  
      const updatedFiles = [
        ...prevFiles,
        ...acceptedFiles.map(file => {
          const fileNameParts = file.name.split('.');
          const extension = fileNameParts.pop();
          const originalFileName = fileNameParts.join('.');
          const renamedFileName = `(#${issue?.sequenceNumber || task?.sequenceNumber})${originalFileName}.${extension}`;
          
          return new File([file], renamedFileName, {
            type: file.type
          });
        })
      ];
      return updatedFiles;
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleExternalSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };


  const fileUploads = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const filesToUpload = [generatedpdf, screenshot, ...(attachment || []),...(files || [])];
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

  const handleSubmit = async (formData: {
    title: string;
    specification_section_id: number | null;
    number: string;
    revision: string;
    type: string;
    submittal_package_id: number | null;
    responsible_contractor_id: number | null;
    received_from_id: number | null;
    submittal_manager_id: number | null;
    status_id: number | null;
    submit_by: string;
    received_date: string;
    issue_date: string;
    cost_code_id: number | null;
    location_id: number | null;
    distribution_member_ids: [];
    lead_time: number | null;
    required_on_site_date: string;
    private: boolean;
    description: string;
    attachments:Blob[]
  }) => {
 
try{
  setLoading(true)
  const prostoreFileIds:any =await fileUploads();
    formData.description= formData.description + `<a href=\"${weburl()}\">#${sequenceNumber}( View in ConstructN)</a>`
    formData.received_from_id = receivedId
    formData.responsible_contractor_id = responsibleContractorId
    const formdata = new FormData()
    Object.entries(formData).forEach(([key, value]) => {  
      if(value!==null && value!==undefined && value !=="" && !(Array.isArray(value) && value.length === 0)){
         formdata.append(`submittal[${key}]`, String(value));
      }

       
});

if (prostoreFileIds && prostoreFileIds.length > 0) {
  for (let i = 0; i < prostoreFileIds.length; i++) {
      formdata.append(`submittal[prostore_file_ids][]`, prostoreFileIds[i]);
  }
}
    createSubmittal(formdata,procoreProjectId)
    .then((response) => {
      if (response) {
        if (issue) {
        
        linkIssueSubmittal(issue.project, issue._id, response?.data.id)
          .then((linkResponse) => {
            if (linkResponse) {
              CustomToast("Submittal Created and linked successfully", 'success');
              let IntegrationObj: IToolbarAction = { type: "RecProcoreIssue", data: linkResponse };
              toolClicked && toolClicked(IntegrationObj)
              getIssues && getIssues(issue.structure)
              handleCloseProcore();
            }
          })
          .catch((linkError) => {
            if (linkError) {
              CustomToast("Linking Submittal failed", 'error');
            }
          });
      } else {
        linkTaskSubmittal(task.project, task._id, response?.data.id)
          .then((linkResponse) => {
            if (linkResponse) {
              CustomToast("Submittal Created and linked successfully", 'success');
              let IntegrationObj: IToolbarAction = { type: "RecProcoreTask", data: linkResponse };
              toolClicked && toolClicked(IntegrationObj)
              getTasks && getTasks(task.structure)
              handleCloseProcore();
            }
          })
          .catch((linkError) => {
            if (linkError) {
              CustomToast("Linking Submittal failed", 'error');
            }
          });
      }
    }else{
          handleCloseProcore()
    }})
    .catch((error:any) => {
      if(error.response.status === 403){
        CustomToast(error.response.data.errors,'error')
        handleBack()
        // setLoading(false)
      }
      if(error.response.status === 400){
        CustomToast(error.response.errors,'error')
      }
      if(error.response.status === 422){
        CustomToast('Submittal Creation failed','error')
        handleBack()
      }
    });
  }catch (error) {
    CustomToast("Linking Submittal failed", 'error');
}
setLoading(false)
  };
  const handleBack = () => {
    handleInstance("CloseSubmittal");
  };
  const validationSchema = Yup.object().shape({
    number: Yup.string().trim().required('Number is required'), 
  });
  return (
    <>
     {loading?(<div>
        <CustomLoader></CustomLoader>
      </div>):(<div>
      <CustomTaskProcoreLinks>
        <ProcoreHeader handleInstances={handleBack} heading={"Create New Submittal"}></ProcoreHeader>
        <BodyContainer footerState={footerState}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            innerRef={formikRef}
            validationSchema={validationSchema}
          >
             {({ setFieldValue,errors, touched ,values }) => {
              const allFieldsTrue = Object.values(values).every((value) => {
                if (values.number !== "") {
                  
                  if(receivedId !==null && responsibleContractorValues.length>0 && responsibleContractorId !== null){
                    setShowError(false)
                   
                    return true
                  }
                  else if(values.number !== "" && receivedId===null && responsibleContractorId === null && responsibleContractorValues.length>0) {
                    return true
                  }
                  else if(values.number !== "" && receivedId !==null && responsibleContractorId === null && responsibleContractorValues.length>0) {
                    setShowError(true)
                    return false
                  }
                  else if(values.number !== "" && responsibleContractorId === null && responsibleContractorValues.length === 0) {
                    setShowError(false)
                    return true
                  }
                  else{
                    
                      return true
                  }
                } else {
                  return false;
                }
              });
              setIsAllFieldsTrue(allFieldsTrue)
            
              return(
              <Form>
                <div className=" px-1  overflow-y-auto calc-h84 mt-5">
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                    <CustomLabel label={"Title"}></CustomLabel>
                      <Field
                        fullWidth
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="title"
                        type="text"
                        placeHolder="enter title"
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"* Number"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="number"
                        type="text"
                        pattern="[0-9]+"
                        placeHolder=" number"
                      ></Field>{errors.number && touched.number && (
                        <div className="text-border-yellow w-[182px]">{errors.number}</div>
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                    <CustomLabel label={"Revision"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="revision"
                        type="number"
                        placeHolder=" number"
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Spec Section"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="specification_section_id"
                        as="select"
                        placeHolder="select Type"
                      >
                         <option value="">Select a Spec Section</option>
                         {specSection.length === 0 && (
                          <option value="" disabled>
                             No options available
                             </option>
                           )}
                      </Field>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                    <CustomLabel label={"Submittal Type"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="type"
                        as="select"
                        placeHolder="select Type"
                      ><option value="">Select a Submittal Type</option>
                      
                          <option value="" disabled>
                             No options available
                             </option>
                           </Field>
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Submittal Package"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="submittal_package_id"
                        as="select"
                        placeHolder="select Package"
                      >
                        <option value="">Select a Submittal Package</option>
                       
                          <option value="" disabled>
                             No options available
                             </option>
                          
                      </Field>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                    <CustomLabel label={"Responsible Contractor"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="responsible_contractor_id"
                        as="select"
                        onClick={
                          handleResponsibleContractor}
                      >
                        <option value={undefined} className="text-text-gray">
                          Select a Responsible contractor
                        </option>
                       
                        {responsibleContractorValues.length === 0 && (
                          <option value="" disabled>
                             No options available
                             </option>
                           )}
                        {responsibleContractorValues.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Field>
                      {showError && (
                        <div className="text-border-yellow w-[182px]">{"Select Responsible Contractor"}</div>
                      )}
                      {dropDownLoading && (
                            <CustomLoader></CustomLoader>
                         )}
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Received From"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="received_from_id"
                        as="select"
                        onClick={handleRecievedFrom}
                      >
                        <option value={undefined}  className="text-text-gray">Select a person</option>
                       
                        {received.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Field>
                      {dropDownLoading && (
                             <CustomLoader></CustomLoader>
                         )}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                    <CustomLabel label={"Submittal Manager"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="submittal_manager_id"
                        as="select"
                        onChange={(e: any) =>{
                          const selectedValue =parseFloat(e.target.value);
                          setFieldValue(
                            "submittal_manager_id",isNaN(selectedValue)?"":selectedValue )
                        }}
                      >
                        <option value="" className="text-text-gray">Select a person</option>
                        {rfiManager.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Status"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="status_id"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue("status", e.target.value);
                        }}
                      >
                        <option value="" className="text-text-gray">Select a status</option>
                        {statusData.map((option: any) => (
                        <option
                         className=""
                         key={option.id}
                          value={option.id}
                        >
                      {option.name}
                        </option>
                        ))}

                      </Field>
                      
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                    <CustomLabel label={"Submit By"}></CustomLabel>
                      <input
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        type="date"
                        placeholder="date"
                        name="submit_by"
                        step="1"
                        onChange={(e) => {
                          setFieldValue("submit_by", e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Received Date"}></CustomLabel>
                      <input
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        type="date"
                        placeholder="date"
                        name="received_date"
                        step="1"
                        onChange={(e) => {
                          setFieldValue("received_date", e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                    <CustomLabel label={"Issue Date"}></CustomLabel>
                      <input
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        type="date"
                        placeholder="date"
                        name="issue_date"
                        step="1"
                        onChange={(e) => {
                          setFieldValue("issue_date", e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Cost Code"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="cost_code_id"
                        as="select"
                        onChange={(e: any) => {
                          const selectedValue =parseFloat(e.target.value);
                          setFieldValue(
                            "cost_code_id",isNaN(selectedValue)?"":selectedValue);
                        }}
                      >
                        <option value="">Select a cost code</option>
                        {coastCodee.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.full_code}&nbsp;{option.name}
                          </option>
                        ))}
                        {coastCodee.length === 0 && (
                          <option value="" disabled>
                             No options available
                             </option>
                           )}
                      </Field>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                    <CustomLabel label={"Location"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="location_id"
                        as="select"
                        placeHolder="select Type"
                      >
                        <option value="">Select a Location</option>
                        {location.length === 0 && (
                          <option value="" disabled>
                             No options available
                             </option>
                           )}
                      </Field>
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Distribution Members"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="distribution_member_ids"
                        as="select"
                        onChange={(e: any) => {
                          const selectedValue =parseFloat(e.target.value);
                          setFieldValue("distribution_member_ids", [
                            isNaN(selectedValue)?"":selectedValue
                          ]);
                        }}
                      >
                        <option value="">Select a Person</option>
                        {potentialDistMem.map((option:any) => (
                          <option key={option?.id} value={option?.id as number}>
                            {option?.name}
                          </option>
                        ))}
                      </Field>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                    <CustomLabel label={"Lead Time"}></CustomLabel>

                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="lead_time"
                        type="text"
                        placeHolder="enter Time(days)"
                        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                          if (
                              !/^\d$/.test(event.key) ||
                              (event.currentTarget.value.includes(".") && event.key === ".")
                          ) {
                              event.preventDefault();
                          }
                      }}
                      onChange={(e:any)=>{
                        const selectedValue =parseFloat(e.target.value);
                        setFieldValue(
                          "lead_time",isNaN(selectedValue)?"":selectedValue )
                      }}
                      
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Required On Site Date"}></CustomLabel>
                      <input
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        type="date"
                        placeholder="date"
                        name="required_on_site_date"
                        step="1"
                        onChange={(e) => {
                          setFieldValue("required_on_site_date", e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                    <CustomLabel label={"Private"}></CustomLabel>
                      <Checkbox {...label} name="private"
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFieldValue('private', isChecked);
                    }} />
                    </Grid>
                  </Grid>
                  <Grid container className="pt-[5px]">
                    <Grid item xs={15}>
                    <CustomLabel label={"Description"}></CustomLabel>
                    <Field
                        fullWidth
                        required
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full h-[50px]  p-2 rounded hover:border-grey-500"
                        type="text"
                        name="description"
                        value={values.description}
                        id="outlined-multiline-flexible"
                        color="warning"
                        multiline
                        onChange={(e:any) => {
                          setFieldValue("description", e.target.value);
                        }}
                        maxRows={4}
                      />
                    </Grid>
                  </Grid>
                  <Grid container className="pt-[5px] mb-[20px]">
                  <Grid item xs={15}>
                  <CustomLabel label={"Attachments"}></CustomLabel>
                  <div {...getRootProps()}>
                    <input {...getInputProps()}
                    type="file"
                    name="attachments" />
                    {
                      isDragActive ? (
                        <div className="border-grey focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500"></div>
                      ) : (
                        <div className="flex justify-center border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500">
                          <UploaderIcon
                            src={uploaderIcon}
                            alt="upload"
                          ></UploaderIcon>
                        </div>
                      )
                      // <p>Drop the files here ...</p> :
                      // <p>Drag 'n' drop some files here, or click to select files</p>
                    }
                  </div>
                  </Grid>
                  </Grid>
                  <>
                  {files&&files.length > 0 && (
                        <div>
                         {files.map((file: File, index: number) => {
                                return(
                              <AttachedImageDiv className={`detailsImageDiv`} key={index}>
                              <div className="w-[50%]">
                                <Tooltip title={file?.name?.length > 20 ? file?.name : ""}>
                                  <AttachedImageTitle>{truncateString(file?.name, 20)}</AttachedImageTitle>
                                </Tooltip>
                                </div>
                                <DeleteIcon
                                  src={Delete}
                                  alt={"delete icon"}
                                  onClick={() => {
                                    handleDelete(index)
                                  } } />
                              
                              </AttachedImageDiv>
                               )})}
                          
                        </div>
                      )}
                      </>
                </div>
              </Form>
       )
      }}
      
          </Formik>
        </BodyContainer>
        <ProcoreFooter
        handleInstances={handleBack}
           allFieldsTrue={isAllFieldsTrue}
          handleExternalSubmit={handleExternalSubmit}
        ></ProcoreFooter>
      </CustomTaskProcoreLinks>
      </div>)}
    </>
  );
};

export default NewLinkSubmittal;




