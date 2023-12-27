import { AddRfi, ArrowIcon, BodyContainer, CustomTaskProcoreLinks, HeaderContainer, LabelContainer, LeftTitleCont, SpanCont, SpanTile } from "../../divami_components/issue_detail/IssueDetailStyles";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
import { TitleContainer } from "../../divami_components/issue_detail/IssueDetailStyles";
import { useState } from "react";
import rfiAdd from "../../../public/divami_icons/addButton.svg"
import { HelpCenterOutlined } from "@mui/icons-material";
import LinkNewRFI from "./linkNewRfi";



const ProcoreLink = (props: any) => {
    const {
        closeProcorePopup,
        setnewRFI,
    } = props

    const [footerState, SetFooterState] = useState(false);

    return (<div className="">
        <CustomTaskProcoreLinks>
            <HeaderContainer>
                <TitleContainer>
                    <LeftTitleCont>
                        <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] ">
                            <ArrowIcon
                                onClick={() => {
                                    closeProcorePopup(true);
                                }}
                                src={BackArrow}
                                alt={"close icon"}
                                data-testid="back-arrow"
                            />
                        </div>
                        <SpanTile data-testid="issue-detail-header">
                            Link to Procore<br></br>
                        </SpanTile>
                    </LeftTitleCont>
                </TitleContainer>
            </HeaderContainer>
            <BodyContainer footerState={footerState}>
                <LabelContainer className="cursor-pointer hover:bg-gray-100 " onClick={()=>{
                    setnewRFI(true); 
                    }}>
                    <AddRfi
                        className=""
                        src={rfiAdd}
                        alt="Link new RFI"
                    >
                    </AddRfi>
                    <SpanCont className="flex justify-center">LINK NEW RFI</SpanCont>

                </LabelContainer>
                <LabelContainer className="cursor-pointer hover:bg-gray-100">

                    <HelpCenterOutlined className="ml-45 mt-6"></HelpCenterOutlined>

                    <SpanCont className="flex justify-center">LINK EXISTING RFI</SpanCont>

                </LabelContainer>
                <LabelContainer className="cursor-pointer hover:bg-gray-100">
                    <AddRfi
                        className=""
                        src={rfiAdd}
                        alt="Link new RFI"
                    >
                    </AddRfi>
                    <SpanCont className="flex justify-center">LINK NEW OBSERVATION</SpanCont>

                </LabelContainer>
                <LabelContainer className="cursor-pointer hover:bg-gray-100">

                    <HelpCenterOutlined className="ml-45 mt-6"></HelpCenterOutlined>

                    <SpanCont className="flex justify-center">LINK EXISTING OBSERVATION</SpanCont>

                </LabelContainer>
                <LabelContainer className="cursor-pointer hover:bg-gray-100">
                    <AddRfi
                        className=""
                        src={rfiAdd}
                        alt="Link new RFI"
                    >
                    </AddRfi>
                    <SpanCont className="flex justify-center">LINK NEW SUBMITTAL</SpanCont>

                </LabelContainer>
                <LabelContainer className="cursor-pointer hover:bg-gray-100">

                    <HelpCenterOutlined className="ml-45 mt-6"></HelpCenterOutlined>

                    <SpanCont className="flex justify-center">LINK EXISTING SUBMITTAL</SpanCont>

                </LabelContainer>


            </BodyContainer>


        </CustomTaskProcoreLinks>

        

    </div>)
}

export default ProcoreLink;