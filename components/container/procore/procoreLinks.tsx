import {
  AddRfi,
  ArrowIcon,
  BodyContainer,
  CustomTaskProcoreLinks,
  HeaderContainer,
  LabelContainer,
  LeftTitleCont,
  SpanCont,
  SpanTile,
} from "../../divami_components/issue_detail/IssueDetailStyles";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
import { TitleContainer } from "../../divami_components/issue_detail/IssueDetailStyles";
import {useEffect, useState } from "react";
import rfiAdd from "../../../public/divami_icons/addButton.svg";
import { HelpCenterOutlined } from "@mui/icons-material";
import LinkNewObservation from "./procoreObservations/linkNewObservation";
import LinkNewRFI from "./newRFI/linkNewRfi";
import {
  contributingBehaviorList,
  contributingConditionsList,
  costImpact,
  getcoastCode,
  getLocation,
  getReceivedFrom,
  getResponsibleContractor,
  getRfiManager,
  getRfiStage,
  hazardList,
  permissions,
  potentialDistributionMembers,
  scheduleImpact,
  specSection,
  tradeList,
  typesList,
} from "../../../services/procore";
import NewLinkSubmittal from "./procoreSubmittal/newLinkSubmittal";
import CustomLoader from "../../divami_components/custom_loader/CustomLoader";
import LinkExistingRfi from "./newRFI/linkExistingRfi";
import LinkExistingObservation from "./procoreObservations/linkExistingObservations";
import LinkExistingSubmittal from "./procoreSubmittal/linkExistingSubmittal";
import { useAppContext } from "../../../state/appState/context";
import router from "next/router";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";

const ProcoreLink = (props: any) => {
  const { handleCloseProcore,
          generatedpdf ,
          issue,
          task,
          getIssues,
          getTasks,
          screenshot,
          attachment,toolClicked} = props;
  const [loading, setLoading] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);

  const [rfiManager, setRfiManager] = useState([]);
  const [receivedFrom, setReceivedFrom] = useState([]);
  const [responsibleContractor, setResponsibleContractor] = useState([]);
  const [potentialDistMem, setPotentialDistMem] = useState([]);
  const [contributingBehavior, setContributingBehavior] = useState([]);
  const [contributingCondition, setContributingCondition] = useState([]);
  const [hazard, setHazard] = useState([]);
  const [types, setTypes] = useState([]);
  const [specSectionn, setspecSection] = useState();
  const [coastCodee, setCoastCodee] = useState([]);
  const [trades, setTrade] = useState([]);
  const [location, setLocation] = useState([]);
  const [rfistage, setrfistage] = useState([]);
  const [scheduleImpactt, setScheduleImpact] = useState([]);
  const [costImpacts, setcostImpact] = useState([]);
  const [userPermission, setUserPermission] =useState<object[]>()
  const [isAdminObservation, setIsAdminObservation] = useState<boolean>(false)
  const [isAdminRfi,setIsAdminRfi] =useState<boolean>(false)
  const [isAdminSubmittal, setIsAdminSubmittal]=useState<boolean>(false)
  const [isAdminDocument ,setIsAdminDocument]=useState<boolean>(false)
 
  const { state: appState} = useAppContext();
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const procoreCompanyId = procoreProjectDetails?.procore?.companyId;
  const weburl=()=>{
    if(issue){
      return `${window.origin}/projects/${issue.project}/structure/${issue.structure}/multiverseviewer?type=${router.query.type}&snap=${router.query.snap}&iss=${issue._id}`
    }else{
      return `${window.origin}/projects/${task.project}/structure/${task.structure}/multiverseviewer?type=${router.query.type}&snap=${router.query.snap}&tsk=${task._id}`
    }
  }
  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        userPermissionData,
        rfiManagerData,
        receivedFromData,
        responsibleContractorData,
        potentialDistMemData,
        specSectionData,
        locationData,
        coastCodeData,
        rfistageData,
        scheduleImpactData,
        costImpactsData,
        tradeData,
        contributingBehaviorData,
        contributingConditionData,
        hazardData,
        typeData,
        
      ] = await Promise.all([
        permissions(procoreProjectId),
        getRfiManager(procoreProjectId),
        getReceivedFrom(procoreProjectId),
        getResponsibleContractor(procoreProjectId),
        potentialDistributionMembers(procoreProjectId),
        specSection(procoreProjectId),
        getLocation(procoreProjectId),
        getcoastCode(procoreProjectId),
        getRfiStage(procoreProjectId,procoreCompanyId),
        scheduleImpact(procoreProjectId),
        costImpact(procoreProjectId),
        tradeList(procoreCompanyId),
        contributingBehaviorList(procoreCompanyId),
        contributingConditionsList(procoreCompanyId),
        hazardList(procoreCompanyId),
        typesList(procoreProjectId),      
]);
      setUserPermission(userPermissionData.tools);
      setRfiManager(rfiManagerData);
      setReceivedFrom(receivedFromData);
      setResponsibleContractor(responsibleContractorData);
      setPotentialDistMem(potentialDistMemData);
      setspecSection(specSectionData);
      setLocation(locationData);
      setCoastCodee(coastCodeData);
      setrfistage(rfistageData);
      setScheduleImpact(scheduleImpactData);
      setcostImpact(costImpactsData);
      setTrade(tradeData);
      setContributingBehavior(contributingBehaviorData);
      setContributingCondition(contributingConditionData);
      setHazard(hazardData);
      setTypes(typeData);
      setLoading(false);
    } catch (error) {
      CustomToast(`You don't have the access for this project`,'error')
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
  }, [generatedpdf,screenshot]);

  useEffect(() => {
    if (userPermission) {
      let isAdminForObservation = userPermission?.some((permission: any) => 
        permission?.name === "observations" && 
        permission?.user_access_level && 
        permission?.user_access_level.name === "Admin"
      );
      let isAdminForRfi = userPermission?.some((permission:any)=>
      permission?.name === "rfi"  &&
      permission?.user_access_level && 
      permission?.user_access_level.name ==="Admin" );

      let isAdminForSubmittal = userPermission?.some((permission:any)=>
      permission?.name ==='submittal_log' &&
      permission?.user_access_level &&
      permission?.user_access_level.name ==='Admin')

      let isAdminForDocument = userPermission?.some((permission:any)=>
      permission?.name === 'documents' &&
      permission?.user_access_level &&
      permission?.user_access_level.name ==="Admin")

      setIsAdminSubmittal(isAdminForSubmittal)
      setIsAdminRfi(isAdminForRfi)
      setIsAdminObservation(isAdminForObservation);
      setIsAdminDocument(isAdminForDocument)
    }
  }, [userPermission]);

const handleSpaceInField =(e:string) =>{
    console.log('checking',e)
    const regex =  /[A-Za-z0-9\-']+$/;
    if(regex.test(e)){
      return true
    }else{
      return false
    }
  }
  
  const handleInstanceClick = (componentType:string) => {
    switch (componentType) {
      case "RFI":
        setSelectedComponent(
          <LinkNewRFI
          attachment={attachment}
          screenshot={screenshot}
          weburl={weburl}
          generatedpdf={generatedpdf}
          getTasks={getTasks}
          getIssues={getIssues}
            issue={issue}
            task={task}
            handleInstance={handleInstanceClick}
            rfiManager={rfiManager}
            receivedForm={receivedFrom}
            responsibleContractor={responsibleContractor}
            potentialDistMem={potentialDistMem}
            coastCodee={coastCodee}
            rfistage={rfistage}
            scheduleImpactt={scheduleImpactt}
            costImpacts={costImpacts}
            specSection={specSectionn}
            location={location}
            handleCloseProcore={handleCloseProcore}
            toolClicked={toolClicked}
            handleSpaceInField={handleSpaceInField}
          />
        );
        break;
      case "closeRFI":
        setSelectedComponent(null);
        break;
      case "Existing_RFI":
        setSelectedComponent(
            <LinkExistingRfi
            attachment ={attachment}
            screenshot={screenshot}
            weburl={weburl}
            generatedpdf={generatedpdf}
            getTasks={getTasks}
            getIssues={getIssues}
            issue={issue}
            handleCloseProcore={handleCloseProcore}
            task={task}
            handleInstance={handleInstanceClick}
            toolClicked={toolClicked}></LinkExistingRfi>
        )
        break;
      case "CloseObservation":
        setSelectedComponent(null);
        break;
      case "New_Observation":
        setSelectedComponent(
          <LinkNewObservation
          attachment ={attachment}
          screenshot={screenshot}
          weburl={weburl}
          getTasks={getTasks}
          getIssues={getIssues}
          issue={issue}
          generatedpdf={generatedpdf}
            handleCloseProcore={handleCloseProcore}
            task={task}
            rfiManager={rfiManager}
            handleInstance={handleInstanceClick}
            potentialDistMem={potentialDistMem}
            types={types}
            hazard={hazard}
            contributingCondition={contributingCondition}
            contributingBehavior={contributingBehavior}
            trade={trades}
            location={location}
            specSection={specSectionn}
            toolClicked={toolClicked}
            handleSpaceInField={handleSpaceInField}
          ></LinkNewObservation>
        );
        break;
      case "Existing_Observation":
        setSelectedComponent(<LinkExistingObservation
          attachment ={attachment}
          screenshot={screenshot}
          weburl={weburl}
          generatedpdf={generatedpdf}
          getTasks={getTasks}
          getIssues={getIssues}
          issue={issue}
          handleCloseProcore={handleCloseProcore}
          task={task}
            handleInstance={handleInstanceClick}
            toolClicked={toolClicked}></LinkExistingObservation>)
            break;
      case "Link_new_submittal":
        setSelectedComponent(
          <NewLinkSubmittal
          weburl={weburl}
          attachment ={attachment}
          screenshot={screenshot}
          generatedpdf={generatedpdf}
          getTasks={getTasks}
          getIssues={getIssues}
          issue={issue}
          handleCloseProcore={handleCloseProcore}
          task={task}
            rfiManager={rfiManager}
            receivedForm={receivedFrom}
            responsibleContractor={responsibleContractor}
            potentialDistMem={potentialDistMem}
            coastCodee={coastCodee}
            specSection={specSectionn}
            location={location}
            handleInstance={handleInstanceClick}
            toolClicked={toolClicked}
            handleSpaceInField={handleSpaceInField}
          ></NewLinkSubmittal>
        );
        break;
      case "Existing_Submittal":
        setSelectedComponent(<LinkExistingSubmittal
          attachment ={attachment}
          screenshot={screenshot}
          weburl={weburl}
          generatedpdf={generatedpdf}
          getTasks={getTasks}
          getIssues={getIssues}
          issue={issue}
          handleCloseProcore={handleCloseProcore}
          task={task}
          handleInstance={handleInstanceClick}
          toolClicked={toolClicked}
          ></LinkExistingSubmittal>)
        break;
        case "CloseSubmittal":
        setSelectedComponent(null)
        break;
       default:
        setSelectedComponent(null);
    }
  };

  const [footerState, SetFooterState] = useState(false);

  if (selectedComponent) {
    return selectedComponent;
  }

  return (
    
    <div className="">
      {loading?(<div>
        <CustomLoader></CustomLoader>
      </div>):(<div>
      <CustomTaskProcoreLinks id="targetElementId">
        <HeaderContainer>
          <TitleContainer>
            <LeftTitleCont>
              <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] ">
                <ArrowIcon
                  onClick={() => {
                    handleCloseProcore();
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
          <LabelContainer
            id="targetElementId"
            className="cursor-pointer hover:bg-gray-100 "
            onClick={() => {
              if(isAdminRfi){
              handleInstanceClick("RFI");
              }else{
                CustomToast('You need to have Procore Admin access to enable this feature','error');
              }
            }}
          >
            <AddRfi className="" src={rfiAdd} alt="Link new RFI"></AddRfi>
            <SpanCont className="flex justify-center">LINK NEW RFI</SpanCont>
          </LabelContainer>
          <LabelContainer
            id="targetElementId"
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => {
              if(isAdminRfi){
                handleInstanceClick("Existing_RFI");
              }else{
                CustomToast('You need to have Procore Admin access to enable this feature','error');
              }
              }}
            >
          
            <HelpCenterOutlined className="ml-45 mt-6"></HelpCenterOutlined>

            <SpanCont className="flex justify-center">
              LINK EXISTING RFI
            </SpanCont>
          </LabelContainer>
          <LabelContainer
            id="targetElementId"
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => {
              if(isAdminObservation){
              handleInstanceClick("New_Observation");
            }else{
              CustomToast('You need to have Procore Admin access to enable this feature','error')
            }
            }}
          >
            <AddRfi
              className=""
              src={rfiAdd}
              alt="Link new Observation"
            ></AddRfi>
            <SpanCont className="flex justify-center">
              LINK NEW OBSERVATION
            </SpanCont>
          </LabelContainer>
          <LabelContainer
            id="targetElementId"
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => {
              if(isAdminObservation){
                handleInstanceClick("Existing_Observation");
              }else{
                CustomToast('You need to have Procore Admin access to enable this feature','error');
              }
              }}
          >
            <HelpCenterOutlined className="ml-45 mt-6"></HelpCenterOutlined>

            <SpanCont className="flex justify-center">
              LINK EXISTING OBSERVATION
            </SpanCont>
          </LabelContainer>
          <LabelContainer
            id="targetElementId"
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => {
              if(isAdminSubmittal && isAdminDocument){
              handleInstanceClick("Link_new_submittal");
            }else{
              CustomToast('You need to have Procore Admin access to enable this feature','error')
            }
            }}
          >
            <AddRfi className="" src={rfiAdd} alt="Link new submittal"></AddRfi>
            <SpanCont className="flex justify-center">
              LINK NEW SUBMITTAL
            </SpanCont>
          </LabelContainer>
          <LabelContainer
            id="targetElementId"
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => {
              if(isAdminSubmittal && isAdminDocument){
             handleInstanceClick("Existing_Submittal");
              }else{
                CustomToast('You need to have Procore Admin access to enable this feature','error')
              }
            
            }}
          >
            <HelpCenterOutlined className="ml-45 mt-6"></HelpCenterOutlined>

            <SpanCont className="flex justify-center">
              LINK EXISTING SUBMITTAL
            </SpanCont>
          </LabelContainer>
        </BodyContainer>
      </CustomTaskProcoreLinks>
      </div>)}
    </div>
  );
};

export default ProcoreLink;
