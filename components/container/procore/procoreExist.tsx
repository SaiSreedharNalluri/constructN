import React, { useEffect, useState } from "react";
import { showObservationDetails, showRfiDetails, showSubmittalDetails } from "../../../services/procore";
import { PROCORE } from "../../../config/config";
import { PopupIcon, PriorityStatus, PriorityTitle, ProcoreLogo, SecondBodyDiv, SecondContPrior, TabOneDiv } from "../../divami_components/issue_detail/IssueDetailStyles";
import popup from "../../../public/divami_icons/popup.svg"
import styled from "@emotion/styled";
import { useAppContext } from "../../../state/appState/context";
import CustomLoader from "../../divami_components/custom_loader/CustomLoader";
import listingErrorIcon from "../../../public/divami_icons/listingErrorIcon.svg";
import { ErrorImageDiv,ImageErrorIcon  } from "../issueListing/IssueListStyles";
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

export const MessageDivShowErr = styled("div")({
  width: "350px",
  height: "40px",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
  textAlign: "center",
  color: "#101F4C",
  marginTop: "40px",
  marginLeft: "12px",
});



const ProcoreExist: React.FC<ProcoreExistProps> = ({
  selected,

}) => {
  const { type, id } = selected.procore;
  const [details, setDetails] = useState<any>(null);
  const { state: appState} = useAppContext();
  const [loading , setLoading] = useState<boolean>(false);
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;

  const generateLink = (type: string, id: string) => {
    if(type === "observation"){
    return `${PROCORE.SANDBOX_URL}/${procoreProjectId}/project/${type}s/items/${id}`
    }else{
      return `${PROCORE.SANDBOX_URL}/${procoreProjectId}/project/submittal_logs/${id}`
    }
  };

  useEffect(() => {
    setLoading(true)
  
    if (type === "rfi") {
      setLoading(true)
      showRfiDetails(id,procoreProjectId).then((response) => {
        if (response) {
          let statusText = response.status;

          if(statusText === 'draft'){
            statusText ='Draft'
          }else if(statusText ==='open'){
            statusText ='Open'
          }
          setDetails({...response,  status:statusText,});
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
      });
    } else if (type === "observation") {
      setLoading(true)
      showObservationDetails(id,procoreProjectId).then((response)=>{
        
        if(response){
          let statusText = response.status;

   
    if (statusText === 'ready_for_review') {
      statusText = 'Ready For Review';
    }else if( statusText === 'not_accepted'){
      statusText ='Not Accepted'
    }else if(statusText === 'closed'){
      statusText = 'Closed'
    }else if(statusText === 'initiated'){
      statusText ='Initiated'
    }else if(statusText === 'open'){
      statusText='Open'
    }

          setDetails({ ...response,  status:statusText, link: generateLink(type, id) });
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
      });
    }else if ( type === "submittal"){
      setLoading(true)
      showSubmittalDetails(id,procoreProjectId).then((response)=>{
        
        if(response){

          setDetails({ ...response, link: generateLink(type, id) });
          setLoading(false)
        }
      }).catch((error) => {
        setLoading(false)
      });
     
    }
  
  }, []);

  const fullDetails = [
    {label:"ID", value: details?.id},
    {label:"Full Number", value: details?.full_number || details?.number || "NA"},
    {label:"Assignee", value: details?.assignee?.name || "NA"},
    {label:"Type", value: type?.toUpperCase()},
    {label:"Title", value: details?.title || details?.name},
    {label:"Status", value: type === 'submittal' ? details?.status?.name : details?.status},
  ]

  return (
    <div>
      {loading?(<div>
        <CustomLoader></CustomLoader>
      </div>):(<div>
        {details && details ? (
      <TabOneDiv>
        {fullDetails.map((detail)=>(<SecondBodyDiv key={detail.label}>
            <SecondContPrior>
              <PriorityTitle>{detail.label}</PriorityTitle>
              <PriorityStatus>{detail.value}</PriorityStatus>
            </SecondContPrior>
          </SecondBodyDiv>))}
          <SecondBodyDiv>
          <ProcoreSectionIcon>
          <PopupIcon
          src={popup}
          alt={"link"}></PopupIcon>
           <a href={details.link} target="_blank" rel="noopener noreferrer" style={{color:"white"}}>
           View {type === 'rfi' ? type.toUpperCase() : type.charAt(0).toUpperCase() + type.slice(1)} in Procore</a> 
       </ProcoreSectionIcon>
          </SecondBodyDiv>
        </TabOneDiv>
   
        ):(<div>
           <ErrorImageDiv>
          <ImageErrorIcon src={listingErrorIcon} alt="Error Image" />
          <MessageDivShowErr className="text-center justify-center">{`The ${type.charAt(0).toUpperCase() + type.slice(1)}  you are trying to access might have been deleted at Procore`}</MessageDivShowErr>
          </ErrorImageDiv>
        </div>)}
        </div>)}
    
  </div>
  
  );
};

export default ProcoreExist;
