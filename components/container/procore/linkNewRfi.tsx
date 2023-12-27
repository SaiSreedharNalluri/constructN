import { ArrowIcon, CustomTaskProcoreLinks, HeaderContainer, LeftTitleCont, SpanTile, TitleContainer } from "../../divami_components/issue_detail/IssueDetailStyles";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
const LinkNewRFI = (props: any) => {
    const {
        closeNewRFI
    } = props
const initialValues: {
    subject: string;
    RFIManager: string;
    distributionMembers:string;
    receivedFrom:string;
    responsibleContractor:string;
    } = {
    subject: "",
    RFIManager: "",
    distributionMembers:"",
    receivedFrom:"",
    responsibleContractor:"",

    };
return(<>
<CustomTaskProcoreLinks>
<HeaderContainer>
<TitleContainer>
                    <LeftTitleCont>
                        <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] ">
                            <ArrowIcon
                                onClick={() => {
                                    closeNewRFI(false);
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
</CustomTaskProcoreLinks>



</>)

}
export default LinkNewRFI;