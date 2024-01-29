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
import { useEffect, useState } from "react";
import rfiAdd from "../../../public/divami_icons/addButton.svg";
import { HelpCenterOutlined } from "@mui/icons-material";
import LinkNewObservation from "./procoreObservations/linkNewObservation";
import jsPDF from "jspdf";
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
  listSubmittal,
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
import { useUploaderContext } from "../../../state/uploaderState/context";
import { useAppContext } from "../../../state/appState/context";

const ProcoreLink = (props: any) => {
  const { handleCloseProcore,
          gen ,
          issue,
          setEnabled,
          task,
          setSelectedIssue,
          updatedselectedIssue,
          getIssues,
          getTasks,} = props;
  const [stateCheck, setStateCheck] = useState<boolean>(false)

  const captureToPdf2 = async () => {
    const element = document.getElementById("targetElementId");

    if (element) {
      try {
        const pdf = new jsPDF();
        pdf.html(element, {
          callback: () => {
            pdf.save("procore_link.pdf");
          },
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    } else {
      console.warn("Element not found");
    }
  };
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
 
  const { state: appState} = useAppContext();
  const procoreProjectDetails=appState.currentProjectData?.project.metaDetails
  const procoreProjectId =procoreProjectDetails?.procore?.projectId;
  const procoreCompanyId = procoreProjectDetails?.procore?.companyId;
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [
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
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleInstanceClick = (componentType: any) => {
    switch (componentType) {
      case "RFI":
        setSelectedComponent(
          <LinkNewRFI
          getTasks={getTasks}
          getIssues={getIssues}
          updatedselectedIssue={updatedselectedIssue}
          setEnabled={setEnabled}
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
            specSectionn={specSectionn}
            handleCloseProcore={handleCloseProcore}
            setSelectedIssue={setSelectedIssue}
          />
        );
        break;
      case "closeNewRFI":
        setSelectedComponent(null);
        break;
      case "Existing_RFI":
        setSelectedComponent(
            <LinkExistingRfi
            getTasks={getTasks}
            getIssues={getIssues}
            issue={issue}
            handleCloseProcore={handleCloseProcore}
            task={task}
            handleInstance={handleInstanceClick}></LinkExistingRfi>
        )
        break;
      case "newCloseObservation":
        setSelectedComponent(null);
        break;
      case "New_Observation":
        setSelectedComponent(
          <LinkNewObservation
          getTasks={getTasks}
          getIssues={getIssues}
          issue={issue}
            gen={gen}
            handleCloseProcore={handleCloseProcore}
            task={task}
            rfiManager={rfiManager}
            handleInstance={handleInstanceClick}
            potentialDistMem={potentialDistMem}
            types={types}
            hazard={hazard}
            contributingCondition={contributingCondition}
            contributingBehavior={contributingBehavior}
          ></LinkNewObservation>
        );
        break;
      case "Existing_Observation":
        setSelectedComponent(<LinkExistingObservation
          getTasks={getTasks}
          getIssues={getIssues}
          issue={issue}
          handleCloseProcore={handleCloseProcore}
          task={task}
            handleInstance={handleInstanceClick}></LinkExistingObservation>)
            break;
      case "Link_new_submittal":
        setSelectedComponent(
          <NewLinkSubmittal
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
            handleInstance={handleInstanceClick}
          ></NewLinkSubmittal>
        );
        break;
      case "Existing_Submittal":
        setSelectedComponent(<LinkExistingSubmittal
          getTasks={getTasks}
          getIssues={getIssues}
          issue={issue}
          handleCloseProcore={handleCloseProcore}
          task={task}
          handleInstance={handleInstanceClick}
          ></LinkExistingSubmittal>)
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
              handleInstanceClick("RFI");
            }}
          >
            <AddRfi className="" src={rfiAdd} alt="Link new RFI"></AddRfi>
            <SpanCont className="flex justify-center">LINK NEW RFI</SpanCont>
          </LabelContainer>
          <LabelContainer
            id="targetElementId"
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => {
                handleInstanceClick("Existing_RFI");
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
              handleInstanceClick("New_Observation");
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
                handleInstanceClick("Existing_Observation");
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
              handleInstanceClick("Link_new_submittal");
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
             handleInstanceClick("Existing_Submittal");
            
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
