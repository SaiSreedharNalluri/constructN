import React from 'react'
import {
    TitleContainer,
    ArrowIcon,
     HeaderContainer,
    LeftTitleCont,
    SpanTile,
    
  } from "../../divami_components/issue_detail/IssueDetailStyles";
  import BackArrow from "../../../public/divami_icons/backArrow.svg";

const ProcoreHeader = (props:any) => {
 const { handleInstances,heading}=props as any
  return (
   <HeaderContainer>
          <TitleContainer>
            <LeftTitleCont>
              <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] ">
                <ArrowIcon
                  onClick={() => {
                    handleInstances()
                  }}
                  src={BackArrow}
                  alt={"close icon"}
                  data-testid="back-arrow"
                />
              </div>
              <SpanTile data-testid="issue-detail-header">
             {heading}
              </SpanTile>
            </LeftTitleCont>
          </TitleContainer>
        </HeaderContainer>
  )
}

export default ProcoreHeader