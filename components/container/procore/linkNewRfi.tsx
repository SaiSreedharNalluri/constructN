import { ArrowIcon, CustomTaskProcoreLinks, HeaderContainer, LeftTitleCont, SpanTile, TitleContainer } from "../../divami_components/issue_detail/IssueDetailStyles";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
import {Form, Formik } from "formik"
import { TextField } from "@mui/material";
const LinkNewRFI = (props: any) => {
    const {
        handleInstance,
    } = props
const initialValues: {
    subject: string;
    RFIManager: string;
    distributionMembers:string;
    receivedFrom:string;
    responsibleContractor:string;
    drawingNumber:string;
    
    } = {
    subject: "",
    RFIManager: "",
    distributionMembers:"",
    receivedFrom:"",
    responsibleContractor:"",
    drawingNumber:"",

    };
    console.log('checking dewofgutewtyt')

const handleSubmit = () =>{

}
return(<>
<CustomTaskProcoreLinks>
<HeaderContainer>
<TitleContainer>
                    <LeftTitleCont>
                        <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] ">
                            <ArrowIcon
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
<Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}>
                            <Form>
                                <div>
                                    <TextField
                                    type="text"
                                    placeholder="Subject"
                                    name="subject">
                                    
                                        
                                    </TextField>
                                </div>
                                
                            </Form>
                        </Formik>
</CustomTaskProcoreLinks>



</>)

}
export default LinkNewRFI;