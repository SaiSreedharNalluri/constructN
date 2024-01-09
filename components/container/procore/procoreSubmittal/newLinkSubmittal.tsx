import React, { useCallback, useRef, useState } from "react";
import {CustomTaskProcoreLinks,BodyContainer} from "../../../divami_components/issue_detail/IssueDetailStyles";
import { Field, Form, Formik, FormikProps } from "formik";
import {  Checkbox, Grid, TextField } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { createSubmittal } from "../../../../services/procore";
import ProcoreFooter from "../procoreFooter";
import ProcoreHeader from "../procoreHeader";
import * as Yup from 'yup';
import { statusData } from "../../../../utils/Procoreconstants";
import { CustomToast } from "../../../divami_components/custom-toaster/CustomToast";

const NewLinkSubmittal = (props: any) => {
  const {
    handleInstance,
    rfiManager,
    receivedForm,
    responsibleContractor,
    potentialDistMem,
    coastCodee,
  } = props as any;
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [footerState, setfooterState] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const formikRef = useRef<FormikProps<any>>(null);
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
  } = {
    title: "",
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
    description: "",
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
  }) => {
    createSubmittal(formData)
    .then((response) => {
      if (response) {
        CustomToast("Submittal Created successfully","success");
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
    number: Yup.string().required('Title is required'),
  
   
  });
  return (
    <>
      <CustomTaskProcoreLinks>
        <ProcoreHeader handleInstances={handleBack} heading={"Create New Submittal"}></ProcoreHeader>
        <BodyContainer footerState={footerState}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            innerRef={formikRef}
            validationSchema={validationSchema}
          >
            {({ errors, touched, setFieldValue }) => (
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
                        NUMBER <span className="text-border-yellow">*</span>
                      </label>
                      <Field
                        className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                        name="number"
                        type="text"
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
                        name="description"
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
                    <Grid item xs={10}>
                      <label className=" text-gray-700 font-medium text-[11px] mb-1">
                        ATTACH FILES
                      </label>
                      <div
                        {...getRootProps()}
                        style={{
                          width: "100%",
                          border: "1px dashed #ccc",
                          padding: "20px",
                          textAlign: "center",
                        }}
                      >
                        <input {...getInputProps()} name="attachFiles" />
                        {isDragActive ? (
                          <p>Drop the files here ...</p>
                        ) : (
                          <p>
                            Drag & drop files here, or click to select files
                          </p>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Form>
            )}
          </Formik>
        </BodyContainer>
        <ProcoreFooter
          handleExternalSubmit={handleExternalSubmit}
        ></ProcoreFooter>
      </CustomTaskProcoreLinks>
    </>
  );
};

export default NewLinkSubmittal;
