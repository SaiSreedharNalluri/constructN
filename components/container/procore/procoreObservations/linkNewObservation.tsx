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
import { useAppContext } from "../../../../state/appState/context";
import uploaderIcon from "../../../../public/divami_icons/Upload_graphics.svg";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import CustomLoader from "../../../divami_components/custom_loader/CustomLoader";
import { IToolbarAction } from "../../../../models/ITools";
import CustomLabel from "../../../divami_components/custom-label/CustomLabel";
export const UploaderIcon = styled(Image)({
  cursor: "pointer",
  height: "40px",
  width: "40px",
});
interface IProps{
  attachment :any;
  screenshot:any
  handleInstance:any
  generatedpdf:any
  weburl:any
  rfiManager:any
  potentialDistMem:any
  types:any
  hazard:any
  contributingBehavior:any
  contributingCondition:any
  trade:any
  location:any
  specSection:any
  issue:any
  task:any
  handleCloseProcore:any
  getIssues?:(s:string)=>{} | undefined;
  getTasks?:(s:string)=>{} | undefined;
  toolClicked?: (toolAction: IToolbarAction) => void;
}
const LinkNewObservation : React.FC<IProps> = ({
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
    trade,
    location,
    specSection,
    getIssues,
    getTasks,
    toolClicked
  }) => {

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
  const [loading, setLoading] = useState(false)
  const sequenceNumber= issue?.sequenceNumber || task?.sequenceNumber
  const onDrop = useCallback((acceptedFiles: any) => {
      setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
 
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
    observation.description = observation.description + `<a href=\"${weburl()}\" target="_blank">#${sequenceNumber}( View in ConstructN)</a>`;
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
    formData.append(`attachments[${screenshot.name}]`,screenshot);
    formData.append(`attachments[${generatedpdf.name}]`, generatedpdf);
    Object.entries(observation).forEach(([key, value]) => {  
                  
               if(value!==null && value!==undefined && value !=="" && !(Array.isArray(value) && value.length === 0)){
              formData.append(`observation[${key}]`, String(value));
               }
                
         });
createObservation(formData)
    .then((response) => {
      if (response) {       
           if (issue) {
        linkIssueObservation(issue.project, issue._id, response?.data.id)
          .then((linkResponse) => {
            if (linkResponse) {
              CustomToast("Observation Created and linked successfully", 'success');
              let IntegrationObj: IToolbarAction = { type: "RecProcoreIssue", data: linkResponse };
              toolClicked && toolClicked(IntegrationObj)
              getIssues && getIssues(issue.structure)
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
              let IntegrationObj: IToolbarAction = { type: "RecProcoreTask", data: linkResponse };
              toolClicked && toolClicked(IntegrationObj)
              getTasks && getTasks(task.structure)
              handleCloseProcore();
            }
          })
          .catch((linkError) => {
            if (linkError) {
              CustomToast("Linking Observation failed", 'error');
            }
          });
      }
    }else{
    setLoading(false)
    handleCloseProcore();
    }
}) .catch((error) => {
  if(error.response.status === 403){
    CustomToast(error.response.data.errors,'error')
    handleBack()
    // setLoading(false)
  }
  if(error.response.status === 400){
    CustomToast(error.response.data.errors,'error')
    setLoading(false)
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
    handleInstance("CloseObservation");
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
                    <CustomLabel label={"* Type"}></CustomLabel>
                      <Field
                        required
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="type_id"
                        as="select"
                        onChange={(e:any) => {
                          const selectedValue = parseFloat(e.target.value)
                          setFieldValue("type_id", isNaN(selectedValue) ? "" : selectedValue);
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
                    <CustomLabel label={"* Status"}></CustomLabel>
                      <Field
                        required
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
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
                    <Grid item xs={6}>
                    <CustomLabel label={"* Title"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="name"
                        type="text"
                        placeHolder="Title"
                      ></Field> {errors.name && touched.name && (
                        <div className="text-border-yellow w-[182px]">{errors.name}</div>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Priority"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
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
                    <CustomLabel label={"Number"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="number"
                        type="text"
                        placeHolder=" number"
                        onChange={(e: any) => {
                          setFieldValue("number", e.target.value);
                        }}
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Trade"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="trade_id"
                        as="select"
                        placeHolder="select Trade"
                      >
                        <option>Select Trade</option>
                        {trade.length === 0 && (
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
                        placeHolder="select Location"
                      >
                        <option>Select Location</option>
                        {location.length === 0 && (
                          <option value="" disabled>
                             No options available
                             </option>
                           )}
                      </Field>
                    </Grid>
                    <Grid item xs={6}>
                    <CustomLabel label={"Spec Section"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="specification_section_id"
                        as="select"
                        placeHolder="select Spec Section"
                      >
                        <option>Select Spec Section</option>
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
                    <CustomLabel label={"Assignee"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="assignee_id"
                        as="select"
                        onChange={(e: any) =>{
                          const selectedValue = parseFloat(e.target.value);
                          setFieldValue( "assignee_id",isNaN(selectedValue) ? "" : selectedValue)
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
                    <CustomLabel label={"Distribution Members"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="distribution_member_ids"
                        as="select"
                        onChange={(e: any) => {
                          const selectedValue = parseFloat(e.target.value);
                          setFieldValue("distribution_member_ids", [
                            isNaN(selectedValue) ? "" : selectedValue
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
                    <CustomLabel label={"Due Date"}></CustomLabel>
                      <input
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
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
                    <CustomLabel label={"Private"}></CustomLabel>
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
                    <CustomLabel label={"Contributing Condition"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="contributing_condition_id"
                        as="select"
                        onChange={(e: any) => {
                          const selectedValue = parseFloat(e.target.value);
                          setFieldValue(
                            "contributing_condition_id",isNaN(selectedValue) ? "" : selectedValue);
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
                    <CustomLabel label={"Contributing Behavior"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="contributing_behavior_id"
                        as="select"
                        onChange={(e: any) => {
                          const selectedValue = parseFloat(e.target.value);
                          setFieldValue(
                            "contributing_behavior_id",isNaN(selectedValue) ? "" : selectedValue);
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
                    <CustomLabel label={"Hazard"}></CustomLabel>
                      <Field
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"
                        name="hazard_id"
                        as="select"
                        onChange={(e: any) => {
                          const selectedValue =parseFloat(e.target.value);
                          setFieldValue(
                            "hazard_id",isNaN(selectedValue)?"":selectedValue);
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
                    <CustomLabel label={"* Description"}></CustomLabel>
                      <Field
                        fullWidth
                        required
                        className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full h-[50px]  p-2 rounded hover:border-grey-500"
                        value={values.description}
                        name="description"
                        multiline
                        maxRows={4}
                        color="warning"
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
                        <div className="border border-solid border-border-dropDown focus:outline-none focus:border-border-yellow w-full  p-2 rounded hover:border-grey-500"></div>
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
export default LinkNewObservation;
