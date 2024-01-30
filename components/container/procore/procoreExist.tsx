import React, { useEffect, useState } from "react";
import { showObservationDetails, showRfiDetails, showSubmittalDetails } from "../../../services/procore";
import { PROCORE } from "../../../config/config";
import { PopupIcon, PriorityStatus, PriorityTitle, ProcoreLogo, SecondBodyDiv, SecondContPrior, TabOneDiv } from "../../divami_components/issue_detail/IssueDetailStyles";
import { Button } from "@mui/material";
import popup from "../../../public/divami_icons/popup.svg"
import { Grid } from "react-loader-spinner";
import styled from "@emotion/styled";
import { useAppContext } from "../../../state/appState/context";
interface ProcoreExistProps {
  selected: any;
}
export const ProcoreSectionIcon = styled.div({
  borderRadius: '10px',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#F1742E',
  '&:hover': {
    cursor: 'pointer',
    background: '#F1742E',
  },
});



const ProcoreExist: React.FC<ProcoreExistProps> = ({
  selected,

}) => {
  const { type, id } = selected.procore;
  const [details, setDetails] = useState<any>(null);
  const { state: appState} = useAppContext();
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;

  const generateLink = (type: string, id: string) => {
    if(type === "observation"){
    return `${PROCORE.BASE_URL}/${procoreProjectId}/project/${type}s/items/${id}`
    }else{
      return `${PROCORE.BASE_URL}/${procoreProjectId}/project/submittal_logs/${id}`
    }
  };

  useEffect(() => {
    if (type === "rfi") {
      showRfiDetails(id,procoreProjectId).then((response) => {
        if (response) {
          setDetails(response);
        }
      });
    } else if (type === "observation") {
      showObservationDetails(id,procoreProjectId).then((response)=>{
        
        if(response){
          setDetails({ ...response, link: generateLink(type, id) });
        }
      })
    }else if ( type === "submittal"){
      showSubmittalDetails(id,procoreProjectId).then((response)=>{
        
        if(response){
          setDetails({ ...response, link: generateLink(type, id) });
        }
      })
    }else{
      console.log('error in type and id ')
    }
  }, []);

  return (
    <div>
        {details && (
      <TabOneDiv>
          <SecondBodyDiv>
            <SecondContPrior>
              <PriorityTitle>Type</PriorityTitle>
              <PriorityStatus>{type}</PriorityStatus>
            </SecondContPrior>
          </SecondBodyDiv>
          <SecondBodyDiv>
            <SecondContPrior>
              <PriorityTitle>Title</PriorityTitle>
              <PriorityStatus>{details.title || details.name}</PriorityStatus>
            </SecondContPrior>
          </SecondBodyDiv>
          <SecondBodyDiv>
            <SecondContPrior>
              <PriorityTitle>Status</PriorityTitle>
              <PriorityStatus>{type === 'submittal' ? details.status.name : details.status}</PriorityStatus>
            </SecondContPrior>
          </SecondBodyDiv>
          <SecondBodyDiv>
            <SecondContPrior>
              <PriorityTitle>ID</PriorityTitle>
              <PriorityStatus>{details.id}</PriorityStatus>
            </SecondContPrior>
          </SecondBodyDiv>
          <SecondBodyDiv>
          <ProcoreSectionIcon>
          <PopupIcon
          src={popup}
          alt={"link"}></PopupIcon>
           <a href={details.link} target="_blank" rel="noopener noreferrer" className=" ml-2px text-box-white hover:underline">
           View {type} in Procore</a> 
       </ProcoreSectionIcon>
          </SecondBodyDiv>
        </TabOneDiv>
   
        )}
       
    
  </div>
  
  );
};

export default ProcoreExist;
