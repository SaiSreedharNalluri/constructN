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
  filesUpload,
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
import { useAppContext } from "../../../state/appState/context";
import router from "next/router";
import axios from "axios";
import { screen } from "@testing-library/react";

const ProcoreLink = (props: any) => {
  const { handleCloseProcore,
          generatedpdf ,
          issue,
          setEnabled,
          task,
          setSelectedIssue,
          updatedselectedIssue,
          getIssues,
          getTasks,
          screenshot,
          attachment,toolClicked} = props;



  console.log('checking screen',screenshot)
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
  const weburl=()=>{
    if(issue){
      return `${window.origin}/projects/${issue.project}/structure?structId=${issue.structure}&type=${router.query.type}&snap=${router.query.snap}&iss=${issue._id}`
    }else{
      return `${window.origin}/projects/${task.project}/structure?structId=${task.structure}&type=${router.query.type}&snap=${router.query.snap}&tsk=${task._id}`
    }
  }
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
  const [uploadedFileIds, setUploadedFileIds] = useState([]);
  const [fileUuidNameMap, setFileUuidNameMap] = useState({});
  // const fileuploadFunction =(files:any)=>{
  //   const filesToUpload =[generatedpdf,screenshot,...(attachment || []),...(files || [])];
    
  //   const uploadPromises =filesToUpload.map((file:any)=>{

  //     const filename =file?.name;
  //     const contentType =file?.type;

  //     const formattedData = {
  //       "response_filename": filename,
  //       "response_content_type": contentType,
  //   };
  //   if(generatedpdf && screenshot){
  //   return filesUpload(procoreProjectId, formattedData);}
  //   });

  //   Promise.all(uploadPromises).then(uploadResponses =>{
  //     const ids:any = [];
  //     const uuidNameMap:any = {};
  //     uploadResponses.forEach((response, index) => {
  //       if (response) {
  //           const id = response.uuid;
  //           const filename = filesToUpload[index]?.name;
  //           uuidNameMap[id] = filename;
  //           ids.push(id);
  //           const url = response.url;
  //           const key = response.fields['key'];
  //           const contentType = response.fields['Content-Type'];
  //           const contentDisposition = response.fields['Content-Disposition'];
  //           const policy = response.fields['policy'];
  //           const credential = response.fields['x-amz-credential'];
  //           const algorithm = response.fields['x-amz-algorithm'];
  //           const date = response.fields['x-amz-date'];
  //           const signature = response.fields['x-amz-signature'];

  //           const formData = new FormData();

  //           formData.append(`key`, key);
  //           formData.append(`Content-Type`, contentType);
  //           formData.append(`Content-Disposition`, contentDisposition);
  //           formData.append(`policy`, policy);
  //           formData.append(`x-amz-credential`, credential);
  //           formData.append(`x-amz-algorithm`, algorithm);
  //           formData.append(`x-amz-date`, date);
  //           formData.append(`x-amz-signature`, signature);
  //           formData.append(`file`, filesToUpload[index]);


  //           axios.post(url,formData,{
  //             headers:{
  //               'Content-Type':'multipart/form-data',
  //             },
  //           })
  //           .then(response=>{
  //             console.log('dharani api response',response);
             

  //           })
  //       }})
  //       setUploadedFileIds(ids); 
  //       setFileUuidNameMap(uuidNameMap);
      
  //   })
  // }
  useEffect(() => {
    fetchData();
    //fileuploadFunction('');
  }, [generatedpdf,screenshot]);
console.log('before testing its',fileUuidNameMap)
  const handleInstanceClick = (componentType: any) => {
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
            handleCloseProcore={handleCloseProcore}
            toolClicked={toolClicked}
          />
        );
        break;
      case "closeNewRFI":
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
      case "newCloseObservation":
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
            toolClicked={toolClicked}
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
            handleInstance={handleInstanceClick}
            toolClicked={toolClicked}
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
