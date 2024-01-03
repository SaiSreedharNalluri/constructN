import { ArrowIcon, BodyContainer, CustomTaskProcoreLinks, HeaderContainer, LeftTitleCont, SpanTile, TitleContainer } from "../../../divami_components/issue_detail/IssueDetailStyles";
import BackArrow from "../../../../public/divami_icons/backArrow.svg";
import { Field, Form, Formik } from "formik"
import { TextField } from "@mui/material";
import { useState } from "react";
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import NewRfiFooter from "./newRfiFooter";
import uploaderIcon from "../../../../public/divami_icons/Upload_graphics.svg"
import {styled} from "@mui/material/styles"
import Image from "next/image";
import { createRfi } from "../../../../services/newRfi";

export const UploaderIcon =styled(Image)({
    cursor:"pointer",
    height:"40px",
    width:"40px"
})
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
        specSectionn
    } = props
    const [footerState, SetFooterState] = useState(false);
    const [attachments,setAttachments] = useState<File[]>();
    const onDrop = useCallback((e:File[]) => {
        setAttachments(e)
    }, [])

    console.log("uploaded files",attachments);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const initialValues: {
        subject: string;
        rfi_manager_id: string;
        // distribution_ids: [];
        // received_from_login_information_id: Number;
        // responsible_contractor_id: Number;
        // drawing_number: string;
        question:{body:string};
        // specification_section_id:Number;
        // location_id:Number;
        // project_stage_id:Number;
        // schedule_impact:object;
        // cost_code_id:Number;
        // cost_impact:object;
        // reference:string;
        assignee_id:Number
        
    

    } = {
        subject: "",
        rfi_manager_id: "",
        // distribution_ids: [],
        // received_from_login_information_id: 0,
        // responsible_contractor_id: 0,
        // drawing_number: "",
        question:{
           body:"checking" 
        },
        // specification_section_id:0,
        // location_id:0,
        // project_stage_id:0,
        // schedule_impact:{},
        // cost_code_id:0,
        // cost_impact:{},
        // reference:"",
        "assignee_id": 10
    };

    const handleSubmit = (formData:any) => {
        
        createRfi(formData)
        
        

    }

    return (<>
        <CustomTaskProcoreLinks>
            <HeaderContainer>
                <TitleContainer>
                    <LeftTitleCont>
                        <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] ">
                            <ArrowIcon
                                onClick={() => {
                                    let closeNewRFI: IprocoreActions = { action: "closeNewRFI", status: false }
                                    handleInstance(closeNewRFI)
                                }}
                                src={BackArrow}
                                alt={"close icon"}
                                data-testid="back-arrow"
                            />
                        </div>
                        <SpanTile data-testid="issue-detail-header">
                            Create a new procore RFI<br></br>
                        </SpanTile>
                    </LeftTitleCont>
                </TitleContainer>
            </HeaderContainer>
            <BodyContainer footerState={footerState}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}>
                    {({ values,handleBlur, isSubmitting,setFieldValue }) => (
                        <Form>
                            <div className=' px-1  overflow-y-auto calc-h84 mt-5 '>
                                <div>
                                    <label className=' text-gray-700 font-medium text-[11px] mb-1'>SUBJECT</label>
                                    <div className="mt-1 border-grey-">
                                        <Field
                                            className="border border-border-grey border-solid  focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500"
                                            name="subject"
                                            placeholder="subject"
                                            
                                            >

                                        </Field>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mt-1">
                                        <label className='text-gray-700 font-medium text-[11px] mb-1'>RFI MANAGER</label>
                                        <div className="border-grey">
                                            <Field
                                                className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                                                name="rfi_manager_id"
                                                as="select"
                                                onChange={(e: any) => setFieldValue("rfi_manager_id", e.target.value)}
                                            >
                                                <option value="">Select a person</option>
                                                  {rfiManager.map((option:any) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        <label className='text-gray-700 font-medium text-[11px] mb-1'>DISTRIBUTION MEMBERS</label>
                                        <div className="border-grey">
                                            <Field
                                                className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                                                name="distribution_ids"
                                                as="select"
                                                onChange={(e:any) => {setFieldValue("distribution_ids", e.target.value) }}
                                            >
                                                <option value="">Select a person</option>
                                               {potentialDistMem.map((option:any) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mt-1">
                                        <label className='text-gray-700 font-medium text-[11px] mb-1'>RECEIVED FROM</label>
                                        <div className="border-grey">
                                            <Field
                                                className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                                                name="received_from_login_information_id"
                                                as="select"
                                                onChange={(e:any) => { setFieldValue("received_from_login_information_id", e.target.value)}}
                                            >
                                                <option value="">Select a person</option>
                                                 {receivedForm.map((option:any) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                                                <option value=""></option>
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        <label className='text-gray-700 font-medium text-[11px] mb-1'>RESPONSIBLE CONTRACTOR</label>
                                        <div className="border-grey">
                                            <Field
                                                className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                                                name="responsible_contractor_id"
                                                as="select"
                                                onChange={(e:any) => { setFieldValue("responsible_contractor_id", e.target.value)}}
                                            >
                                                <option value="">Select a Responsible contractor</option>
                                                   {responsibleContractor.map((option:any) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className=' text-gray-700 font-medium text-[11px] mb-1'>DRAWING NUMBER</label>
                                    <div className="mt-1 border-grey-">
                                        <Field
                                            className="border border-border-grey border-solid  focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500 w-32"
                                            name="drawingNumber"
                                            placeholder="Drawing number">

                                        </Field>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mt-1">
                                        <label className='text-gray-700 font-medium text-[11px] mb-1'>SPEC SECTION</label>
                                        <div className="border-grey">
                                            <Field
                                                className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                                                name="specification_section_id"
                                                as="select"
                                                onChange={() => { }}
                                            >
                                                <option value="">Select spec section</option>
                                                <option value=""></option>
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        <label className='text-gray-700 font-medium text-[11px] mb-1'>LOCATION</label>
                                        <div className="border-grey">
                                            <Field
                                                className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                                                name="location_id"
                                                as="select"
                                                onChange={(e:any) => {setFieldValue("location_id", e.target.value) }}
                                            >
                                                <option value="">select a location</option>
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mt-1">
                                        <label className='text-gray-700 font-medium text-[11px] mb-1'>RFI STAGE</label>
                                        <div className="border-grey">
                                            <Field
                                                className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                                                name="project_stage_id"
                                                as="select"
                                                onChange={(e:any) => {setFieldValue("project_stage_id", e.target.value)  }}
                                            >
                                                <option value="">Select a RFI stage</option>
                                                {rfistage.map((option:any) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        <label className='text-gray-700 font-medium text-[11px] mb-1'>SCHEDULE IMPACT</label>
                                        <div className="border-grey">
                                            <Field
                                                className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                                                name="schedule_impact"
                                                as="select"
                                                onChange={(e:any) => {setFieldValue("schedule_impact", e.target.value) }}
                                            >
                                                <option value="">Select a Impact schedule</option>
                                                 {scheduleImpactt.map((option:any) => (
                              <option key={option.value} value={option.value}>
                                {option.name}
                              </option>
                            ))}
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <label className='text-gray-700 font-medium text-[11px] mb-1'>COST CODE</label>
                                    <div className="border-grey">
                                        <Field
                                            className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                                            name="cost_code_id"
                                            as="select"
                                            onChange={(e:any) => { setFieldValue("received_from_login_information_id", e.target.value)}}
                                        >
                                            <option value="">Select a cost code</option>
                                           {coastCodee.map((option:any) => (
                              <option key={option.id} value={option.id}>
                                {option.full_code}&nbsp;{option.name}
                              </option>
                            ))}
                                        </Field>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <label className='text-gray-700 font-medium text-[11px] mb-1'>COST IMPACT</label>
                                    <div className="border-grey">
                                        <Field
                                            className="border border-border-grey border-solid focus:outline-orange-300 w-full p-2 rounded hover:border-grey-500"
                                            name="cost_impact"
                                            as="select"
                                            onChange={(e:any) => { setFieldValue("cost_impact", e.target.value)}}
                                        >
                                            <option value="">Select a cost Impact</option>
                                           {costImpacts.map((option:any) => (
                              <option key={option.id} value={option.id}>
                                {option.full_code}&nbsp;{option.name}
                              </option>
                            ))}
                                        </Field>
                                    </div>
                                </div>
                                <div>
                                    <label className=' text-gray-700 font-medium text-[11px] mb-1'>REFERENCE</label>
                                    <div className="mt-1">
                                        <Field
                                            className="border border-border-grey border-solid  focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500 "
                                            name="reference"
                                            placeholder=""
                                            type="text"
                                        >

                                        </Field>
                                    </div>
                                </div>
                                <div className="">
                                    <label className=' text-gray-700 font-medium text-[11px] mb-1'>QUESTION</label>
                                    <div className="mt-1">
                                        <TextField
                                            className=""
                                            name="question.body"
                                            placeholder=""
                                            type="text"
                                            fullWidth
                                            color="warning"
                                        >

                                        </TextField>
                                    </div>
                                </div>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <label htmlFor="attachments" className="text-gray-700 font-medium text-[11px] mb-1">
                                        Attachments
                                    </label>
                                    {
                                        isDragActive ?
                                            <div className="border-grey focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500">
                                                
                                            </div>:
                                            <div className="flex justify-center border border-soild border-grey-500 focus:outline-orange-300 w-full  p-2 rounded hover:border-grey-500">
                                            <UploaderIcon
                                                src={uploaderIcon}
                                                alt="upload">
                                            </UploaderIcon>
                                            </div>
                                            // <p>Drop the files here ...</p> :
                                            // <p>Drag 'n' drop some files here, or click to select files</p>
                                    }
                                </div>

                                {/* <NewRfiFooter></NewRfiFooter> */}

                                <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                                    <div>
                                        <button className="p-2 w-[150px] bg-gray-200 hover:bg-custom- text-grey font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="reset" onClick={() => { }}>
                                            Cancel
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className={`p-2 ml-[30px] bg-orange-400 hover:bg-custom-orange-500 text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline}`}
                                            type="submit"
                                        >
                                            CREATE AND LINK
                                        </button>
                                    </div>
                                </div>


                            </div>
                        </Form>
                    )}
                </Formik>
            </BodyContainer>
           
        </CustomTaskProcoreLinks>



    </>)

}
export default LinkNewRFI;