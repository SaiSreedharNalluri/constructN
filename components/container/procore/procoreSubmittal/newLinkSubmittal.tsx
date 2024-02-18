import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {CustomTaskProcoreLinks,BodyContainer} from "../../../divami_components/issue_detail/IssueDetailStyles";
import { Field, Form, Formik, FormikProps } from "formik";
import {  Checkbox, Grid, TextField } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { createSubmittal, filesUpload, linkIssueSubmittal, linkTaskSubmittal, projectFile } from "../../../../services/procore";
import ProcoreFooter from "../procoreFooter";
import ProcoreHeader from "../procoreHeader";
import * as Yup from 'yup';
import { statusData } from "../../../../utils/Procoreconstants";
import { CustomToast } from "../../../divami_components/custom-toaster/CustomToast";
import { IprocoreActions } from "../../../../models/Iprocore";
import { useAppContext } from "../../../../state/appState/context";
import uploaderIcon from "../../../../public/divami_icons/Upload_graphics.svg";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import CustomLoader from "../../../divami_components/custom_loader/CustomLoader";
import axios from "axios";
import { FirstPageOutlined } from "@mui/icons-material";
import { IToolbarAction } from "../../../../models/ITools";
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
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const sequenceNumber= issue?.sequenceNumber || task?.sequenceNumber;
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
        setLoading(false)
       
      }
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
    })
    .catch((error) => {
      if (error) {
        CustomToast("Submittal creation failed","error");
      }
    });
  }catch (error) {
    CustomToast("Linking Submittal failed", 'error');
}
setLoading(false)
  };
  const handleBack = () => {
    let closeNewRFI: IprocoreActions = {
      action: "newCloseObservation",
      status: false,
    };
    handleInstance(closeNewRFI);
  };
  const validationSchema = Yup.object().shape({
    number: Yup.string().trim().required('Title is required'),
  
   
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
                  return false;
                } else {
                  return true;
                }
              });
              setIsAllFieldsTrue(allFieldsTrue)
            
              return(
              <Form>
                <div className=" overflow-y-auto">
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        TITLE
                      </label>
                      <Field
                        fullWidth
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="title"
                        type="text"
                        placeHolder="enter title"
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        SPEC SECTION
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="specification_section_id"
                        as="select"
                        placeHolder="select Type"
                      ></Field>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        REVISION
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="revision"
                        type="text"
                        placeHolder=" number"
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        NUMBER <span className="text-border-yellow text-base"> *</span>
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
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
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        SUBMITTAL TYPE
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="type"
                        as="select"
                        placeHolder="select Type"
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        SUBMITTAL PACKAGE
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="submittal_package_id"
                        as="select"
                        placeHolder="select Package"
                      ></Field>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        RESPONSIBLE CONTRACTOR
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="responsible_contractor_id"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue(
                            "responsible_contractor_id",
                            parseFloat(e.target.value)
                          );
                        }}
                      >
                        <option value="">
                          Select a Responsible contractor
                        </option>
                        {responsibleContractor.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        RECEIVED FROM
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="received_from_id"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue(
                            "received_from_id",
                            parseFloat(e.target.value)
                          );
                        }}
                      >
                        <option value="">Select a person</option>
                        {receivedForm.map((option: any) => (
                          <option key={option.id} value={option.id}>
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
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        SUBMITTAL MANAGER
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="submittal_manager_id"
                        as="select"
                        onChange={(e: any) =>
                          setFieldValue(
                            "submittal_manager_id",
                            parseFloat(e.target.value)
                          )
                        }
                      >
                        <option value="">Select a person</option>
                        {rfiManager.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        STATUS
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="status_id"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue("status", e.target.value);
                        }}
                      >
                        <option value="">Select a status</option>
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
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        SUBMIT BY
                      </label>
                      <input
                        className="border border-solid border-border-black p-2 focus:outline-yellow-500 rounded w-full hover:border-yellow-500"
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
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        RECEIVED DATE
                      </label>
                      <input
                        className="border border-solid border-border-black p-2 focus:outline-yellow-500 rounded w-full hover:border-yellow-500"
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
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        ISSUE DATE
                      </label>
                      <input
                        className="border border-solid border-border-black p-2 focus:outline-yellow-500 rounded w-full hover:border-yellow-500"
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
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        COST CODE
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="cost_code_id"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue(
                            "cost_code_id",
                            parseFloat(e.target.value)
                          );
                        }}
                      >
                        <option value="">Select a cost code</option>
                        {coastCodee.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.full_code}&nbsp;{option.name}
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
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        LOCATION
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="location_id"
                        as="select"
                        placeHolder="select Type"
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        DISTRIBUTION MEMBER
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="distribution_member_ids"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue("distribution_member_ids", [
                            parseFloat(e.target.value),
                          ]);
                        }}
                      >
                        <option value="">Select a person</option>
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
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        LEAD TIME
                      </label>

                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="lead_time"
                        type="number"
                        placeHolder="enter Time(days)"
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        REQUIRED ON-SITE DATE
                      </label>
                      <input
                        className="border border-solid border-border-black p-2 focus:outline-yellow-500 rounded w-full hover:border-yellow-500"
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
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        PRIVATE
                      </label>
                      <Checkbox {...label} name="private" />
                    </Grid>
                  </Grid>
                  <Grid container className="pt-[5px]">
                    <Grid item xs={15}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        DESCRIPTION
                      </label>
                      <TextField
                        fullWidth
                        required
                        type="text"
                        name="description"
                        value={values.description}
                        id="outlined-multiline-flexible"
                        multiline
                        onChange={(e) => {
                          setFieldValue("description", e.target.value);
                        }}
                        maxRows={4}
                      />
                    </Grid>
                  </Grid>
                  <Grid container className="pt-[5px] mb-[20px]">
                  <Grid item xs={15}>
                  <div {...getRootProps()}>
                    <input {...getInputProps()}
                    type="file"
                    name="attachments" />
                    <label
                      htmlFor="attachments"
                      className="text-gray-700 font-medium text-[11px] mb-1"
                    >
                      Attachments
                    </label>
                    {
                      isDragActive ? (
                        <div className="border-grey focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500"></div>
                      ) : (
                        <div className="flex justify-center border border-soild border-grey-500 focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500">
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
                  {files&&files.length > 0 && (
                        <div>
                          <strong>Uploaded Files:</strong>
                          <ul>
                            {files.map((file: File, index: number) => (
                              <li
                                key={index}
                                style={{ cursor: "pointer" }}
                              >
                                {file.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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




