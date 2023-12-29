import BackArrow from "../../../../public/divami_icons/backArrow.svg";
import { Field, Form, Formik } from "formik";
import {
  Grid,
  OutlinedInput,
  Select,
  TextField,
  Checkbox,
  styled,
  Box,
  Button,
} from "@mui/material";

import {
  TitleContainer,
  ArrowIcon,
  CustomTaskProcoreLinks,
  HeaderContainer,
  LeftTitleCont,
  SpanTile,
  BodyContainer,
} from "../../../divami_components/issue_detail/IssueDetailStyles";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const LinkNewObservation = (props: any) => {
  const { handleInstance } = props;
  const initialValues: {
    type:string,
    status:string,
    title:string,
    priority:string,
    number:string,
    trade:string,
    location:string,
    section:string,
    assignee:string,
    distributionMember:string,
    dueDate:string,
    private:boolean,
    contributingCondition:string,
    contributingBehaviour:string,
    hazard:string,
    description:string,
    attachFiles:File[],
  } = {
    type:'',
    status:'',
    title:'',
    priority:'',
    number:'',
    trade:'',
    location:'',
    section:'',
    assignee:'',
    distributionMember:'',
    dueDate:'',
    private:false,
    contributingCondition:'',
    contributingBehaviour:'',
    hazard:'',
    description:'',
    attachFiles:[],

  };
  const ButtonsContainer = styled(Box)({
    padding: "10px",
    paddingTop:'20px',
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });
  const [footerState, setfooterState] = useState(true);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const handleSubmit = (values:any) => {
    
    console.log('initialvalues',values)
  };
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <CustomTaskProcoreLinks>
        <HeaderContainer>
          <TitleContainer>
            <LeftTitleCont>
              <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] ">
                <ArrowIcon
                  onClick={() => {
                    let closeNewRFI: IprocoreActions = {
                      action: "newCloseObservation",
                      status: false,
                    };
                    handleInstance(closeNewRFI);
                  }}
                  src={BackArrow}
                  alt={"close icon"}
                  data-testid="back-arrow"
                />
              </div>
              <SpanTile data-testid="issue-detail-header">
                Create a new Procore Observation<br></br>
              </SpanTile>
            </LeftTitleCont>
          </TitleContainer>
        </HeaderContainer>
        <BodyContainer footerState={footerState}>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
           
            <Form>
              <div className=" overflow-y-auto">
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  className="mt-[4px]"
                >
                  <Grid item xs={6}>
                    <div>TYPE*</div>
                    <Field
                    className="border border-solid border-gray-400 focus:border-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                    name="type"
                    as="select"
                    placeHolder="select Type"
                ></Field>
                  </Grid>
                  <Grid item xs={6}>
                    <div>STATUS *</div>
                    <Field
                    className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                    name="status"
                    as="select"
                    placeHolder="select status"
                ></Field>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  className="mt-[4px]"
                >
                  <Grid item xs={6}>
                    <div>TITLE</div>
                    <Field
                    className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                    name="title"
                    type="text"
                    placeHolder="Title"
                ></Field>
                  </Grid>
                  <Grid item xs={6}>
                    <div>PRIORITY</div>
                    <Field
                    className="border border-solid border-gray-400 focus:outline-border-yellow  hover:border-border-yellow w-[182px] h-[38px] rounded"
                    name="title"
                    type="text"
                    placeHolder="Title"
                ></Field>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  className="mt-[4px]"
                >
                  <Grid item xs={6}>
                    <div>NUMBER(Assigned)</div>
                    <OutlinedInput
                      fullWidth
                      size="small"
                      className="outline-none"
                      color="warning"
                      name="number"
                      value={null}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div>TRADE</div>
                    <Select
                      fullWidth
                      color="warning"
                      size="small"
                      name="trade"
                      placeholder="Select Trade"
                    ></Select>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  className="mt-[4px]"
                >
                  <Grid item xs={6}>
                    <div>LOCATION</div>
                    <Select
                      fullWidth
                      size="small"
                      color="warning"
                      name="location"
                      placeholder="Select a Location"
                    ></Select>
                  </Grid>
                  <Grid item xs={6}>
                    <div>SPEC SECTION</div>
                    <Select
                      fullWidth
                      size="small"
                      color="warning"
                      name="section"
                      placeholder="Select a Spec Section"
                    ></Select>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  className="mt-[4px]"
                >
                  <Grid item xs={6}>
                    <div>ASSIGNEE</div>
                    <Select
                      fullWidth
                      size="small"
                      color="warning"
                      name="assignee"
                      placeholder="Select Assignee"
                    ></Select>
                  </Grid>
                  <Grid item xs={6}>
                    <div>DISTRIBUTION MEMBERS</div>
                    <Select
                      fullWidth
                      size="small"
                      color="warning"
                      name="distributionMembers"
                      placeholder="Select DistributionMember"
                    ></Select>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  className="mt-[4px]"
                >
                  <Grid item xs={6}>
                    <div>DUE DATE</div>
                    <input
                      className="border border-solid border-border-black p-2 focus:outline-yellow-500 rounded w-full hover:border-yellow-500"
                      type="date"
                      placeholder="date"
                      name="DueDate"
                      step="1"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div>PRIVATE</div>
                    <Checkbox {...label} name="private" />
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  className="mt-[4px]"
                >
                  <Grid item xs={6}>
                    <div>CONTRIBUTING CONDITIONS</div>
                    <Select
                      fullWidth
                      size="small"
                      name="contributingCondition"
                      placeholder="Select Contributing Condtion"
                    ></Select>
                  </Grid>
                  <Grid item xs={6}>
                    <div>CONTRIBUTING BEHAVOIR</div>
                    <Select
                      fullWidth
                      size="small"
                      name="contributingBehavior"
                      placeholder="Select Contributing Behavior"
                    ></Select>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  className="mt-[4px]"
                >
                  <Grid item xs={6}>
                    <div>HAZARD</div>
                    <Select 
                    fullWidth 
                    size="small" 
                    name="hazard"
                    placeholder="Select Hazard"></Select>
                  </Grid>
                </Grid>
                <Grid container className="mt-[4px]">
                  <Grid item xs={15}>
                    <div>DESCRIPTION *</div>
                    <TextField
                      fullWidth
                      required
                      name="description"
                      id="outlined-multiline-flexible"
                      multiline
                      maxRows={4}
                     
                    />
                  </Grid>
                </Grid>
                <Grid container className="mt-[4px] mb-[20px]">
                  <Grid item xs={10}>
                    <div>ATTACH FILES</div>
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
                        <p>Drag & drop files here, or click to select files</p>
                      )}
                    </div>
                    {files.length > 0 && (
            <div>
              <strong>Uploaded Files:</strong>
              <ul>
                {files.map((file: any, index: number) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
                  </Grid>
                </Grid>
              </div>
              <ButtonsContainer>
      <Button>Cancel</Button>
      <Button type='submit'>Create</Button>
    </ButtonsContainer>
            </Form>
            
          </Formik>
        </BodyContainer>
      
      </CustomTaskProcoreLinks>
    </>
  );
};
export default LinkNewObservation;
