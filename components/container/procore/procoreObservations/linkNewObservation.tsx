import { Field, Form, Formik, FormikProps, useFormikContext } from "formik";
import { Grid, TextField, Checkbox,} from "@mui/material";
import { CustomTaskProcoreLinks, BodyContainer,} from "../../../divami_components/issue_detail/IssueDetailStyles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { priorityData, statusData } from "../../../../utils/Procoreconstants";
import { createObservation, linkIssueObservation,linkTaskObservation } from "../../../../services/procore";
import ProcoreFooter from "../procoreFooter";
import ProcoreHeader from "../procoreHeader";
import * as Yup from 'yup';
import { CustomToast } from "../../../divami_components/custom-toaster/CustomToast";
import { IprocoreActions } from "../../../../models/Iprocore";
import router from "next/router";
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

const LinkNewObservation = (props: any) => {
  const {
    attachment,
    screenshot,
    handleInstance,
    generatedpdf,
    weburl,
    rfiManager,
    potentialDistMem,
    types,
    hazard,
    contributingBehavior,
    contributingCondition,
    issue,
    task,
    handleCloseProcore,
    getIssues,
    getTasks
  } = props;

  const userObj=localStorage.getItem('userCredentials')
  const procoreAssigneeId=()=>{
    if (userObj) {
      const  user = JSON.parse(userObj);
      const metaData = user.metadata.procore  
      return metaData.id
     }
    
    }
    const { state: appState} = useAppContext();
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const initialValues: {
    assignee_id: number | null;
    contributing_behavior_id: number | null;
    contributing_condition_id: number | null;
    description: string;
    due_date: string;
    hazard_id: number | null;
    personal: boolean;
    priority: string;
    specification_section_id: number | null;
    status: string;
    trade_id: number | null;
    type_id: number | null;
    distribution_member_ids: [];
    location_id: number | null;
    name: string;
    number: string;
  } = {
    assignee_id: procoreAssigneeId(),
    contributing_behavior_id: null,
    contributing_condition_id: null,
    description: issue?.description || task?.description||"",
    due_date: "",
    hazard_id: null,
    personal: false,
    priority: "",
    specification_section_id: null,
    status: "",
    trade_id: null,
    type_id: null,
    distribution_member_ids: [],
    location_id: null,
    name: issue?.title|| task.title,
    number: "",
  };
  const [footerState, setfooterState] = useState(true);
  const formikRef = useRef<FormikProps<any>>(null);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [isAllFieldsTrue, setIsAllFieldsTrue] = useState(false);
  const [files, setFiles] = useState<[Blob]>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false)
  const sequenceNumber= issue?.sequenceNumber || task?.sequenceNumber
  const onDrop = useCallback((acceptedFiles: any) => {
      setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const onFileClick = (file: File) => {
    setSelectedFile(file);
  };
 
  const handleExternalSubmit = () => {
    formikRef.current?.submitForm();
  };
  interface observation{
    assignee_id: number | null;
    contributing_behavior_id: number | null;
    contributing_condition_id: number | null;
    description: string;
    due_date: string;
    hazard_id: number | null;
    personal: boolean;
    priority: string;
    specification_section_id: number | null;
    status: string;
    trade_id: number | null;
    type_id: number | null;
    distribution_member_ids: [];
    location_id: number | null;
    name: string;
    number: string;
   }

  const handleSubmit = (observation: observation) => {
    setLoading(true)
    const project_id = procoreProjectId?.toString();
    observation.description = observation.description + `<a href="${weburl()}">#${sequenceNumber}( View in ConstructN)</a>`;
     const formData:any =new FormData() 
    formData.append('project_id', project_id);

        if(files)  
    for (let i = 0; i < files.length; i++) {
      formData.append(`attachments[${files[i].name}]`, files[i] );
    }
    if (attachment && attachment.length > 0) {
      for (let i = 0; i < attachment.length; i++) {
        formData.append(`attachments[${attachment[i].name}]`, attachment[i]);
      }
    }
    formData.append(`attachments[ScreenShot]`,screenshot);
    formData.append(`attachments[${generatedpdf.name}]`, generatedpdf);
    Object.entries(observation).forEach(([key, value]) => {  
                  
               if(value!==null && value!==undefined && value !=="" && !(Array.isArray(value) && value.length === 0)){
              formData.append(`observation[${key}]`, String(value));
               }
                
         });
         console.log('checking for type',formData.get('distribution_member_ids'))
createObservation(formData)
    .then((response) => {
      if (response) {

        setLoading(false)
      }
      if (issue) {
        linkIssueObservation(issue.project, issue._id, response?.data.id)
          .then((linkResponse) => {
            if (linkResponse) {
              CustomToast("Observation Created and linked successfully", 'success');
              getIssues(issue.structure)
              handleCloseProcore();
            }
          })
          .catch((linkError) => {
            if (linkError) {
              CustomToast("Linking observation failed", 'error');
            }
          });
      } else {
        linkTaskObservation(task.project, task._id, response?.data.id)
          .then((linkResponse) => {
            if (linkResponse) {
              CustomToast("Observation Created and linked successfully", 'success');
              getTasks(task.structure)
              handleCloseProcore();
            }
          })
          .catch((linkError) => {
            if (linkError) {
              CustomToast("Linking Observation failed", 'error');
            }
          });
      }
    })
    .catch((error) => {
      if (error) {
        CustomToast("Observation creation failed","error");
      }
    });
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Title is required'),
    type_id: Yup.number().nullable().required('Type is not selected'),
    status: Yup.string().trim().required('status is not selected'),
    description:Yup.string().trim().required('Description is required'),
   
  });
  
  const handleBack = () => {
    let closeNewRFI: IprocoreActions = {
      action: "newCloseObservation",
      status: false,
    };
    handleInstance(closeNewRFI);
  };
  
  return (
    <>
     {loading?(<div>
        <CustomLoader></CustomLoader>
      </div>):(<div>
      <CustomTaskProcoreLinks>
      <ProcoreHeader handleInstances={handleBack} heading={"Create New Observation"}></ProcoreHeader>
        <BodyContainer footerState={footerState}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            innerRef={formikRef}  
            validationSchema={validationSchema}
          >

            {({ setFieldValue,errors, touched ,values }) => {
              const allFieldsTrue =
               Object.values(values).every((value) =>{
                if(values.name!=="" && values.type_id!==null && values.status!=="" && values.description!==""){
                   return false;
                }else{
                  return true;
                }
              }
                )
              setIsAllFieldsTrue(allFieldsTrue)
            
              return(
              <Form>
                <div className="px-1  overflow-y-auto calc-h84 mt-5">
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        TYPE <span className="text-border-yellow text-base text-[11px]"> *</span>
                      </label>
                      <Field
                        required
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="type_id"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue("type_id", parseFloat(e.target.value));
                        }}
                      >
                        <option value="">Select a type</option>

                        {types.map((option: any) => (
                          <option
                            className=""
                            key={option.id}
                            value={option.id}
                          >
                            {option.name}
                          </option>
                        ))}
                      </Field>{errors.type_id && touched.type_id && (
                        <div className="text-border-yellow w-[182px]">{errors.type_id}</div>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        STATUS <span className="text-border-yellow text-base text-[11px]"> *</span>
                      </label>
                      <Field
                        required
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="status"
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
                      </Field>{errors.status && touched.status && (
                        <div className="text-border-yellow w-[182px]">{errors.status}</div>
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    className="pt-[5px]"
                  >
                    <Grid item xs={2}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        TITLE  <span className="text-border-yellow text-base text-[11px]">*</span>
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="name"
                        type="text"
                        placeHolder="Title"
                      ></Field> {errors.name && touched.name && (
                        <div className="text-border-yellow w-[182px]">{errors.name}</div>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        PRIORITY
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="priority"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue("priority", e.target.value);
                        }}
                      >
                        <option value="">Select a Priority</option>
                        {priorityData.map((option: any) => (
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
                        NUMBER(Assigned)
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="number"
                        type="text"
                        placeHolder=" number"
                        onChange={(e: any) => {
                          setFieldValue("number", e.target.value);
                        }}
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        TRADE
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="trade_id"
                        as="select"
                        placeHolder="select Trade"
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
                        LOCATION
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="location_id"
                        as="select"
                        placeHolder="select Location"
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
                        placeHolder="select Spec Section"
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
                        ASSIGNEE
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="assignee_id"
                        as="select"
                        onChange={(e: any) =>{
                          setFieldValue(
                            "assignee_id",
                            parseFloat(e.target.value)
                          )
                        }}
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
                        DISTRIBUTION MEMBER
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
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
                        DUE DATE
                      </label>
                      <input
                        className="border border-solid border-border-black p-2 focus:outline-yellow-500 rounded w-full hover:border-yellow-500"
                        type="date"
                        placeholder="date"
                        name="due_date"
                        step="1"
                        onChange={(e: any) => {
                          setFieldValue("due_date", e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        PRIVATE
                      </label>
                      <Checkbox {...label} name="personal" />
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
                        CONTRIBUTING CONDITION
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="contributing_condition_id"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue(
                            "contributing_condition_id",
                            parseFloat(e.target.value)
                          );
                        }}
                      >
                        <option value="">Select a Conditions</option>
                        {contributingCondition.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={6}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        CONTRIBUTING BEHAVIOR
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="contributing_behavior_id"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue(
                            "contributing_behavior_id",
                            parseFloat(e.target.value)
                          );
                        }}
                      >
                        <option value="">Select a Contributing Behavior</option>
                        {contributingBehavior.map((option: any) => (
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
                        HAZARD
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="hazard_id"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue(
                            "hazard_id",
                            parseFloat(e.target.value)
                          );
                        }}
                      >
                        <option value="">Select a Hazard</option>
                        {hazard.map((option: any) => (
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
                  <Grid container className="pt-[5px]">
                    <Grid item xs={15}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        DESCRIPTION <span className="text-border-yellow text-base text-[11px]"> *</span>
                      </label>
                      <TextField
                        fullWidth
                        required
                        value={values.description}
                        name="description"
                        id="outlined-multiline-flexible"
                        multiline
                        maxRows={4}
                        onChange={(e: any) => {
                          setFieldValue("description", e.target.value);
                        }}
                      />{errors.description && touched.description && (
                        <div className="text-border-yellow w-[182px]">{errors.description}</div>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container className="pt-[5px] mb-[20px]">
                  <Grid item xs={15}>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
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
                                onClick={() => onFileClick(file)}
                              >
                                {file.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  {selectedFile && (
                    <div>
                      <strong>Selected File:</strong> {selectedFile.name}
                      {selectedFile.type.startsWith("image/") && (
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Selected File"
                          className="mt-2 max-w-full"
                        />
                      )}
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
export default LinkNewObservation;
