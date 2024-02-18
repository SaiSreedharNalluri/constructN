import {
  BodyContainer,
  CustomTaskProcoreLinks,
} from "../../../divami_components/issue_detail/IssueDetailStyles";
import { Field, Form, Formik, FormikProps } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import uploaderIcon from "../../../../public/divami_icons/Upload_graphics.svg";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { createRfi, linkIssueRfi, linkTaskRfi} from "../../../../services/procore";
import ProcoreFooter from "../procoreFooter";
import ProcoreHeader from "../procoreHeader";
import * as Yup from 'yup';
import { CustomToast } from "../../../divami_components/custom-toaster/CustomToast";
import { IprocoreActions } from "../../../../models/Iprocore";
import { useAppContext } from "../../../../state/appState/context";
import CustomLoader from "../../../divami_components/custom_loader/CustomLoader";
import { IToolbarAction } from "../../../../models/ITools";

export const UploaderIcon = styled(Image)({
  cursor: "pointer",
  height: "40px",
  width: "40px",
});
export type formAction={
      submitform :()=>void
}
interface IProps {
  handleInstance:any
  rfiManager:any
  receivedForm:any
  responsibleContractor:any
  potentialDistMem:any
  coastCodee:any
  rfistage:any
  scheduleImpactt:any
  costImpacts:any
  specSection:any
  issue:any
  task:any
  handleCloseProcore:any
  getIssues?:(s:string)=>{} | undefined;
  getTasks?:(s:string)=>{} | undefined;
  generatedpdf:any
  weburl:any
  screenshot:any
  attachment:any
  toolClicked?: (toolAction: IToolbarAction) => void;
}
const LinkNewRFI : React.FC<IProps> = ({
    handleInstance,
    rfiManager,
    receivedForm,
    responsibleContractor,
    potentialDistMem,
    coastCodee,
    rfistage,
    scheduleImpactt,
    costImpacts,
    specSection,
    issue,
    task,
    handleCloseProcore,
    getIssues,
    getTasks,
    generatedpdf,
    weburl,
    screenshot,
    attachment,
    toolClicked
  }) => {
  const ButtonsContainer = styled(Box)({
    padding: "10px",
    paddingTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });
  const [footerState, SetFooterState] = useState(true);
  const [scheduleImpact, setScheduleImpact] = useState("");
  const [scheduleImpactValue,setScheduleImpactValue]=useState<number | null>(0)
  const [costImpact, setCostImpact] = useState("");
  const [costImpactValue, setCostImpactValue]=useState<number | null>(0)
  const [showInput, setShowInput] = useState(false);
  const [showValueInput, setshowValueInput] = useState(false);
  const [isAllFieldsTrue, setIsAllFieldsTrue] = useState(false);
  const [files, setFiles] = useState<[Blob]>();
  const formikRef = useRef<FormikProps<any>>(null);
  const removeSpaces = (value:any) => value.trim(/^\s+|\s+$/g, '');
  const onDrop = useCallback((acceptedFiles: any) => {
      setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const { state: appState} = useAppContext();
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const sequenceNumber= issue?.sequenceNumber || task?.sequenceNumber
  const [loading, setLoading] = useState(false)
  const userObj=localStorage.getItem('userCredentials')
  const procoreAssigneeId=()=>{
    if (userObj) {
      const  user = JSON.parse(userObj);
      const metaData = user.metadata.procore      
      return metaData.id
     }
    
    }

  const initialValues: {
    subject: string;
    rfi_manager_id: number | null;
    distribution_ids: [];
    received_from_login_information_id: number | null;
    responsible_contractor_id: number | null;
    drawing_number: string;
    question: { body: string; attachments: Blob[] };
    specification_section_id: number | null;
    location_id: number | null;
    project_stage_id: number | null;
    schedule_impact: { status: string; value: number | null };
    cost_code_id: number | null;
    cost_impact: {
      status: string;
      value: number | null;
    };
    reference: string;
    assignee_id: number | null;
    draft: boolean;
  } = {
    subject: issue?.title || task.title,
    rfi_manager_id: null,
    distribution_ids: [],
    received_from_login_information_id: null,
    responsible_contractor_id: null,
    drawing_number: "",
    question: {
      body:issue?.description || task?.description ||" ",
      attachments: [],
    },
    specification_section_id: null,
    location_id: null,
    project_stage_id: null,
    schedule_impact: {
      status: "",
      value: null,
    },
    cost_code_id: null,
    cost_impact: {
      status: "",
      value: null,
    },
    reference: '',
    assignee_id:procoreAssigneeId(),
    draft: true,
  };
  const handleCostImpactChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setCostImpact(selectedValue);
    setShowInput(selectedValue === 'yes_known');
  };

  const handleScheduleImpactChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setScheduleImpact(selectedValue);
    setshowValueInput(selectedValue === 'yes_known');
  };

  const handleCostImpactValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue: string = e.target.value;
    const parsedValue: number = parseFloat(inputValue); 
    setCostImpactValue(parsedValue); 
  };

  const handleScheduleImpactValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue: string = e.target.value;
    const parsedValue: number = parseFloat(inputValue); 
    setScheduleImpactValue(parsedValue); 
  };


  const handleExternalSubmit = () => {
      formikRef.current?.submitForm();
    
  };
  
  const handleSubmit = (rfi: {
    subject: string;
    rfi_manager_id: number | null;
    distribution_ids: [];
    received_from_login_information_id: number | null;
    responsible_contractor_id: number | null;
    drawing_number: string;
    question: { body: string; attachments: Blob[]|undefined };
    specification_section_id: number | null;
    location_id: number | null;
    project_stage_id: number | null;
    schedule_impact: { status: string; value: number | null };
    cost_code_id: number | null;
    cost_impact: {
      status: string;
      value: number | null;
    };
    reference: string;
    assignee_id: number | null;
    draft: boolean;
  }) => {
    setLoading(true)
    rfi.question.body= rfi.question.body +`<a href=\"${weburl()}\">#${sequenceNumber}( View in ConstructN)</a>` ;
    rfi.schedule_impact.status = scheduleImpact;
    rfi.cost_impact.status = costImpact;
    rfi.cost_impact.value = costImpactValue;
    rfi.schedule_impact.value = scheduleImpactValue;
    const formdata:any =new FormData()
    Object.entries(rfi).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            if (nestedKey === 'attachments') {
              if (attachment && attachment.length > 0) {
                for (let i = 0; i < attachment.length; i++) {
                  formdata.append(`rfi[${key}][${nestedKey}][${attachment[i].name}]`, attachment[i]);
                }
              }
              formdata.append(`rfi[${key}][${nestedKey}][${screenshot.name}]`, screenshot)
              formdata.append(`rfi[${key}][${nestedKey}][${generatedpdf.name}]`, generatedpdf)
              if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                  formdata.append(`rfi[${key}][${nestedKey}][${files[i].name}]`, files[i]);
                }
              }
            } else {
              if (nestedValue !== null && nestedValue !== undefined && nestedValue !== "") {
                formdata.append(`rfi[${key}][${nestedKey}]`, String(nestedValue));
              }
            }
          });
        } else if(key==='distribution_ids'){
                formdata.append(`rfi[${key}][]`,String(value))
        }
        else {
          formdata.append(`rfi[${key}]`, String(value));
        }
      }
    });
    

    createRfi(formdata,procoreProjectId)
  .then((response) => {
    if (response) {
      if (issue) {
    
        linkIssueRfi(issue.project, issue._id, response.data.id)
          .then((linkResponse) => {
            if (linkResponse) {
              CustomToast("RFI Created and linked successfully", "success");
              getIssues && getIssues(issue.structure)
              let IntegrationObj: IToolbarAction = { type: "RecProcoreIssue", data: linkResponse };
              toolClicked && toolClicked(IntegrationObj)
              handleCloseProcore();
             
              
            }
          })
          .catch((linkError) => {
            if (linkError) {
              CustomToast("Linking RFI failed", 'error');
            }
          });
      } else {
        linkTaskRfi(task.project, task._id, response.data.id)
          .then((linkResponse) => {
            if (linkResponse) {
              CustomToast("RFI Created and linked successfully", "success");
              getTasks && getTasks(task.structure)
              let IntegrationObj: IToolbarAction = { type: "RecProcoreTask", data: linkResponse };
              toolClicked && toolClicked(IntegrationObj)
              handleCloseProcore();
            }
          })
          .catch((linkError) => {
            if (linkError) {
              CustomToast("Linking RFI failed", 'error');
            }
          });
      }
    }else{
      setLoading(false);
      CustomToast("RFI creation failed", "error");
    }
  })
  .catch((error) => {
    if (error) {
      CustomToast("RFI creation failed", "error");
    }
  });
  }
  const validationSchema = Yup.object().shape({
    subject: Yup.string().transform(removeSpaces).required('Subject is required'),
    rfi_manager_id: Yup.number().nullable().required('Select RFI manager'),
    received_from_login_information_id: Yup.number().nullable().required('Select Received From'),
    question: Yup.object().shape({
      body: Yup.string().trim().required('Question is required'),
      attachment: Yup.array(),
    }),
    'cost_impact.value': Yup.number().when('cost_impact.status', {
      is: 'yes_known', 
      then: Yup.number().required('Cost Impact Value is required'),
      otherwise: Yup.number() 
    }),
    'schedule_impact.value': Yup.number().when('schedule_impact.status', {
      is: 'yes_known', 
      then: Yup.number().required('Schedule Impact value Value is required'),
      otherwise: Yup.number() 
    })
  });
  
   
   
  
  const handleBack = () => {
    let closeNewRFI: IprocoreActions = {
      action: "closeNewRFI",
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
      <ProcoreHeader handleInstances={handleBack} heading={"Create New RFI"}></ProcoreHeader>
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
                if(values.subject!=="" && 
                values.rfi_manager_id!==null
                 && values.received_from_login_information_id!==null &&
                  values.question.body !=="" && 
                  (values.cost_impact.status !== "yes_known" || (values.cost_impact.status === "yes_known" && values.cost_impact.value !== undefined && values.cost_impact.value !== null)) &&
                  (values.schedule_impact.status !== "yes_known" || (values.schedule_impact.status === "yes_known" && values.schedule_impact.value !== undefined && values.schedule_impact.value !== null))){
                   return false;
                }else{
                  return true;
                }
              }
                )
              setIsAllFieldsTrue(allFieldsTrue)
              return(
              <Form>
                <div className=" px-1  overflow-y-auto calc-h84 mt-5 ">
                  <div>
                    <label className=" text-gray-700 font-medium text-[11px] mb-1">
                      SUBJECT <span className="text-border-yellow text-base text-[11px]"> *</span>
                    </label>
                    <div className="mt-1 border-grey-">
                      <Field
                        required
                        className="border border-border-grey border-solid  focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500"
                        name="subject"
                        placeholder="subject"
                      ></Field>{errors.subject && touched.subject && (
                        <div className="text-border-yellow  w-[182px]">{errors.subject}</div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mt-1">
                      <label className="text-gray-700 font-medium text-[11px] mb-1">
                        RFI MANAGER
                      </label><span className="text-border-yellow text-base  text-[11px]"> *</span>
                      <div className="border-grey">
                        <Field
                          required
                          className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                          name="rfi_manager_id"
                          as="select"
                          onChange={(e: any) =>
                            setFieldValue(
                              "rfi_manager_id",
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
                        {errors.rfi_manager_id && touched.rfi_manager_id && (
                        <div className="text-border-yellow  w-[182px]">{errors.rfi_manager_id}</div>
                      )}

                      </div>
                    </div>
                    <div className="mt-1">
                      <label className="text-gray-700 font-medium text-[11px] mb-1">
                        DISTRIBUTION MEMBERS
                      </label>
                      <div className="border-grey">
                        <Field
                          className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                          name="distribution_ids"
                          type="Number"
                          as="select"
                          onChange={(e: any) => {
                            setFieldValue("distribution_ids", [
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
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mt-1">
                      <label className="text-gray-700 font-medium text-[11px] mb-1">
                        RECEIVED FROM
                      </label><span className="text-border-yellow text-base text-[11px]"> *</span>
                      <div className="border-grey">
                        <Field
                          className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                          name="received_from_login_information_id"
                          as="select"
                          onChange={(e: any) => {
                            setFieldValue(
                              "received_from_login_information_id",
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
                        {errors.received_from_login_information_id && touched.received_from_login_information_id && (
                        <div className="text--border-yellow  w-[182px]">{errors.received_from_login_information_id}</div>
                      )}
                      </div>
                    </div>
                    <div className="mt-1">
                      <label className="text-gray-700 font-medium text-[11px] mb-1">
                        RESPONSIBLE CONTRACTOR
                      </label>
                      <div className="border-grey">
                        <Field
                          className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
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
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className=" text-gray-700 font-medium text-[11px] mb-1">
                      DRAWING NUMBER
                    </label>
                    <div className="mt-1 border-grey-">
                      <Field
                        className="border border-border-grey border-solid  focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500 w-32"
                        name="drawing_number"
                        placeholder="Drawing number"
                      ></Field>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mt-1">
                      <label className="text-gray-700 font-medium text-[11px] mb-1">
                        SPEC SECTION
                      </label>
                      <div className="border-grey">
                        <Field
                          className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                          name="specification_section_id"
                          as="select"
                          onChange={() => {}}
                        >
                          <option value="">Select spec section</option>
                          <option value=""></option>
                        </Field>
                      </div>
                    </div>
                    <div className="mt-1">
                      <label className="text-gray-700 font-medium text-[11px] mb-1">
                        LOCATION
                      </label>
                      <div className="border-grey">
                        <Field
                          className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                          name="location_id"
                          as="select"
                          onChange={(e: any) => {
                            setFieldValue(
                              "location_id",
                              parseFloat(e.target.value)
                            );
                          }}
                        >
                          <option value="">select a location</option>
                        </Field>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mt-1">
                      <label className="text-gray-700 font-medium text-[11px] mb-1">
                        RFI STAGE
                      </label>
                      <div className="border-grey">
                        <Field
                          className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                          name="project_stage_id"
                          as="select"
                          onChange={(e: any) => {
                            setFieldValue(
                              "project_stage_id",
                              parseFloat(e.target.value)
                            );
                          }}
                        >
                          <option value="">Select a RFI stage</option>
                          {rfistage.map((option: any) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>
                    <div className="mt-1">
                      <label className="text-gray-700 font-medium text-[11px] mb-1">
                        SCHEDULE IMPACT
                      </label>
                      <div className="border-grey">
                        <Field
                          className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                          name="schedule_impact"
                          as="select"
                          value={scheduleImpact}
                          onChange={handleScheduleImpactChange}
                        >
                          <option value="">Select a Impact schedule</option>
                          {scheduleImpactt.map((option: any) => (
                            <option key={option.value} value={option.value}>
                              {option.name}
                            </option>
                          ))}
                        </Field>
                      </div>                      
                    </div>
                    {showValueInput && (
        <div className="mt-1">
        <label className="text-gray-700 font-medium text-[11px] mb-1">
         SCHEDULE IMPACT VALUE
        </label>
                      <Field
                        type='number'
                        className="border border-border-grey border-solid  focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500"
                        name="schedule_impact.value"
                        value={scheduleImpactValue}
                        placeholder="Enter Schedule Impact value"
                        onChange={handleScheduleImpactValueChange}
                      ></Field>{errors.schedule_impact?.value && touched.schedule_impact?.value && (
                        <div className="text-border-yellow  w-[182px]">{errors.schedule_impact.value}</div>
                      )}
        </div>
      )}
                  </div>
                  <div className="mt-1">
                    <label className="text-gray-700 font-medium text-[11px] mb-1">
                      COST CODE
                    </label>
                    <div className="border-grey">
                      <Field
                        className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                        name="cost_code_id"
                        as="select"
                        onChange={(e: any) => {
                          setFieldValue(
                            "received_from_login_information_id",
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
                    </div>
                  </div>
                  <div className="mt-1">
                    <label className="text-gray-700 font-medium text-[11px] mb-1">
                      COST IMPACT
                    </label>
                    <div className="border-grey">
                      <Field
                        className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                        name="cost_impact.status"
                        as="select"
                        value={costImpact}
                        onChange={handleCostImpactChange}
                      >
                        <option value="">Select a cost Impact</option>
                        {costImpacts.map((option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    {showInput && (
        <div className="mt-1">
        <label className="text-gray-700 font-medium text-[11px] mb-1">
          COST IMPACT VALUE
        </label>
                      <Field
                        type='number'
                        className="border border-border-grey border-solid  focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500"
                        name="cost_impact.value"
                        value={costImpactValue}
                        placeholder="Enter Cost impact value"
                        onChange={handleCostImpactValueChange}
                      ></Field>
                      {errors.cost_impact?.value && touched.cost_impact?.value && (
                        <div className="text-border-yellow  w-[182px]">{errors.cost_impact.value}</div>
                      )}
        </div>
      )}
                  </div>
                  <div>
                    <label className=" text-gray-700 font-medium text-[11px] mb-1">
                      REFERENCE
                    </label>
                    <div className="mt-1">
                      <Field
                        className="border border-border-grey border-solid  focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500 "
                        name="reference"
                        placeholder=""
                        type="text"
                      ></Field>
                    </div>
                  </div>
                  <div className="">
                    <label className=" text-gray-700 font-medium text-[11px] mb-1">
                      QUESTION
                    </label><span className="text-border-yellow text-base text-[11px]"> *</span>
                    <div className="mt-1">
                      <TextField
                        required
                        className=""
                        name="question.body"
                        value={values.question.body}
                        placeholder=""
                        type="text"
                        fullWidth
                        color="warning"
                        onChange={(e: any) => {
                          setFieldValue(
                            "question.body",
                            e.target.value
                          );
                        }}
                      ></TextField>{errors.question?.body && touched.question?.body && (
                    <div className="text-border-yellow  w-[182px]">{errors.question.body}</div>
                      )}
                    </div>
                  </div>
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
          handleExternalSubmit={handleExternalSubmit}
          allFieldsTrue={isAllFieldsTrue}
        ></ProcoreFooter>
      </CustomTaskProcoreLinks>
      </div>)}
    </>
  );
};
export default LinkNewRFI;
