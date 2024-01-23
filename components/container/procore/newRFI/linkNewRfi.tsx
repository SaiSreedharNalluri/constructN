import {
  BodyContainer,
  CustomTaskProcoreLinks,
} from "../../../divami_components/issue_detail/IssueDetailStyles";
import { Field, Form, Formik, FormikProps } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { useMemo, useRef, useState } from "react";
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
export const UploaderIcon = styled(Image)({
  cursor: "pointer",
  height: "40px",
  width: "40px",
});
export type formAction={
      submitform :()=>void
}
const LinkNewRFI = (props: any) => {
  const {
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
    updatedselectedIssue,
    handleCloseProcore,
    getIssues,
    getTasks
  } = props;
  const ButtonsContainer = styled(Box)({
    padding: "10px",
    paddingTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });
  const [footerState, SetFooterState] = useState(true);
  const [scheduleImpact, setScheduleImpact] = useState("");
  const [costImpact, setCostImpact] = useState("");
  const [attachments, setAttachments] = useState<File[]>();
  const [isAllFieldsTrue, setIsAllFieldsTrue] = useState(false);
  const formikRef = useRef<FormikProps<any>>(null);
  const removeSpaces = (value:any) => value.trim(/^\s+|\s+$/g, '');
  const onDrop = useCallback((files: File[]) => {}, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const initialValues: {
    subject: string;
    rfi_manager_id: number | null;
    distribution_ids: [];
    received_from_login_information_id: number | null;
    responsible_contractor_id: number | null;
    drawing_number: string;
    question: { body: string; attachment: File[] };
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
    subject: "",
    rfi_manager_id: null,
    distribution_ids: [],
    received_from_login_information_id: null,
    responsible_contractor_id: null,
    drawing_number: "",
    question: {
      body: "",
      attachment: [],
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
    reference: "",
    assignee_id: 10,
    draft: true,
  };
  
  const handleExternalSubmit = () => {
      formikRef.current?.submitForm();
    
  };

  const handleSubmit = (formData: {
    subject: string;
    rfi_manager_id: number | null;
    distribution_ids: [];
    received_from_login_information_id: number | null;
    responsible_contractor_id: number | null;
    drawing_number: string;
    question: { body: string; attachment: File[] };
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
    formData.schedule_impact.status = scheduleImpact;
    formData.cost_impact.status = costImpact;
    createRfi(formData)
  .then((response) => {
    if (response) {
      CustomToast("RFI Created successfully", "success");

      if (issue) {
    
        linkIssueRfi(issue.project, issue._id, response.data.id)
          .then((linkResponse) => {
            if (linkResponse) {
              CustomToast("RFI linked successfully", 'success');
              getIssues(issue.structure)
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
              CustomToast("RFI linked successfully", 'success');
              getTasks(task.structure)
              handleCloseProcore();
            }
          })
          .catch((linkError) => {
            if (linkError) {
              CustomToast("Linking RFI failed", 'error');
            }
          });
      }
    }
  })
  .catch((error) => {
    if (error) {
      CustomToast("RFI creation failed", "error");
    }
  });
  }
  const validationSchema = Yup.object().shape({
    subject: Yup.string().transform(removeSpaces) .required('Subject is required'),
    rfi_manager_id: Yup.number().nullable().required('select Rif manager'),
    received_from_login_information_id  : Yup.number().nullable().required('select Received From'),
    question: Yup.object().shape({
      body: Yup.string().trim().required('Question is required'),
      attachment: Yup.array(),
    }),
   
   
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
                if(values.subject!=="" && values.rfi_manager_id!==null && values.question.body !==""){
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
                          onChange={(e: any) => {
                            setScheduleImpact(e.target.value);
                          }}
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
                        name="cost_impact"
                        as="select"
                        value={costImpact}
                        onChange={(e: any) => {
                          setCostImpact(e.target.value);
                        }}
                      >
                        <option value="">Select a cost Impact</option>
                        {costImpacts.map((option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.name}
                          </option>
                        ))}
                      </Field>
                    </div>
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
                      ></TextField>{errors.question && touched.question && (
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
                </div>
              </Form>
              )
            }}
            
          </Formik>
        </BodyContainer>
        <ProcoreFooter
          handleExternalSubmit={handleExternalSubmit}
          allFieldsTrue={isAllFieldsTrue}
        ></ProcoreFooter>
      </CustomTaskProcoreLinks>
    </>
  );
};
export default LinkNewRFI;
