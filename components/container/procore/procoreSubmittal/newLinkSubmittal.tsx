import React, { useCallback, useMemo, useRef, useState } from "react";
import {CustomTaskProcoreLinks,BodyContainer} from "../../../divami_components/issue_detail/IssueDetailStyles";
import { Field, Form, Formik, FormikProps } from "formik";
import {  Checkbox, Grid, TextField } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { createSubmittal, linkIssueSubmittal, linkTaskSubmittal } from "../../../../services/procore";
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
export const UploaderIcon = styled(Image)({
  cursor: "pointer",
  height: "40px",
  width: "40px",
});
const NewLinkSubmittal = (props: any) => {
  const {
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
  } = props as any;
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [footerState, setfooterState] = useState(true);
  const [files, setFiles] = useState<[Blob]>();
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
  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleExternalSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };
  const handleSubmit = (formData: {
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
    setLoading(true)

    formData.description= formData.description + `<a href=\"${weburl()}\">#${sequenceNumber}( View in ConstructN)</a>`
    const formdata:any = new FormData()
    Object.entries(formData).forEach(([key, value]) => {  
      if(key === "attachments"){
        if(files)  
        for (let i = 0; i < files.length; i++) {
          formdata.append(`submittal[attachments][${files[i].name}]`, files[i] );
        }
        formdata.append(`submittal[attachments][${generatedpdf.name}]`, generatedpdf)
      }
      if(value!==null && value!==undefined && value !=="" && !(Array.isArray(value) && value.length === 0)){
         formdata.append(`submittal[${key}]`, String(value));
      }
       
});
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
              getIssues(issue.structure)
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
              getTasks(task.structure)
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
                        onChange={(e: any) => {
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
                        onChange={(e: any) => {
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
                        onChange={(e: any) => {
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
                        {potentialDistMem.map((option: any) => (
                          <option key={option.id} value={option.id as number}>
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
                        LEAD TIME
                      </label>

                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="lead_time"
                        type="text"
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
                        onChange={(e: any) => {
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
                        onChange={(e: any) => {
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
                            {files.map((file: any, index: number) => (
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
