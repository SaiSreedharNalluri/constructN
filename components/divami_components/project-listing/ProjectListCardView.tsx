import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IProjects } from "../../../models/IProjects";
import { deleteProject, getProjects, getProjectsList } from "../../../services/project";
import userCount from "../../../public/divami_icons/userCount.svg";
import updatedAtIcon from "../../../public/divami_icons/updatedAtIcon.svg";
import {
  ProjectCard,
  ProjectLogo,
  ProjectNameTitle,
  UsersCountContainer,
  UpdatedAtContainer,
  CapturesText,
  CaptureImageContainer,
  CaptureImageIcon,
  CaptureName,
  CaptureCount,
  ProjectCardsContainer,
  UsersCountText,
  ListDivider,
  ListHorizontalDivider,
  ProjectBottomLeftBg,
  ProjectBottomRightBg,
  ProjectTopLeftBg,
  ProjectTopRightBg,
  ProjectActionItem,
  ProjectActionsContainer,
  ShowErrorContainer,
  CenteredErrorImage,
  NoResultText,
  ProjectCardFlipIcon,
  HorizontalSeparator,
} from "./ProjectListingStyles";
import Image from "next/image";
import capture360Image from "../../../public/divami_icons/capture360Image.svg";
import Capture360photo from "../../../public/divami_icons/Capture360photo.svg";

import captureLidarIcon from "../../../public/divami_icons/captureLidarIcon.svg";
import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import PhoneImageNewCapture from "../../../public/divami_icons/PhoneImageNewCapture.svg";

import videoWalk from "../../../public/divami_icons/videoWalk.svg";
import CaptureVideoWalk from "../../../public/divami_icons/CaptureVideoWalk.svg";
import LidarWalk from "../../../public/divami_icons/LidarWalk.svg";
// import droneImage from "../../../public/divami_icons/droneImage.svg";
import DroneImage from "../../../public/divami_icons/DroneImage.svg";
import DroneImageNew from "../../../public/divami_icons/DroneImageNew.svg";

import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";
import ReactCardFlip from "react-card-flip";
import cardMenu from "../../../public/divami_icons/cardMenu.svg";
import Delete from "../../../public/divami_icons/delete.svg";
import moment from "moment";
import CustomLoader from "../custom_loader/CustomLoader";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import { Tooltip } from "@mui/material";
import { CustomToast } from "../custom-toaster/CustomToast";
import PopupComponent from "../../popupComponent/PopupComponent";
export const ProjectListCardView = ({
  projects,
  projectActions,
  truncateString,
  onDelete
}: any) => {
  const router = useRouter();
  const customLogger = new CustomLoggerClass();
  const [projectsData, setProjectsData] = useState(
    projects?.length
   ? projects.map((each: any, index: number) => {
      return {
        ...each,
        showActionsCard: index == 1 ? true : false,
      };
    })
: []
  );

  useEffect(() => {
    // console.log(projects)
    setProjectsData(projects);
  }, [projects]);

  const[isAdmin,setisAdmin]=useState(false);
  const[isPending,setisPending]=useState(false);
  const[isDelete,setDelete]=useState(false);
  const[projectId,setProjectId]=useState("");
  const[role,setRole]=useState("");

  const Card = ({ each }: any) => {
    const [isFlipped, setIsFlipped] = useState(true);

    return (
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <ProjectCard
          onClick={() => {
            router.push(`/projects/${each._id}/sections`);
          }}
          active
          onMouseLeave={() => {
            setIsFlipped((prev) => !prev);
          }}

        >
          <ProjectTopLeftBg active />
          <ProjectTopRightBg active />
          <ProjectBottomLeftBg active />
          <ProjectBottomRightBg active />
          {/* <ProjectLogo
            src={each.companyLogo}
            alt={""}
            width={242}
            height={45}
          /> */}
          <Tooltip
            title={each.projectName?.length > 50 ? each.projectName : ""}
          >
            <ProjectNameTitle>
              {truncateString(each.projectName, 50)}
            </ProjectNameTitle>
          </Tooltip>

          <HorizontalSeparator />
          {/* <ListHorizontalDivider /> */}

          <ListHorizontalDivider active />

          <ProjectActionsContainer>
            {projectActions.map((item: any, index: number) => {
              return (
                <ProjectActionItem
                  key={index}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    item.action(each._id);
                  }}
                >
                  {item.label}
                </ProjectActionItem>
              );
            })}
          </ProjectActionsContainer>
        </ProjectCard>
        <ProjectCard
          onClick={(e: any) => {
            e.stopPropagation();
            if(each.status==="Draft" && each.role==="admin"){
              router.push(`project-onboarding?id=${each._id}`)
            }
         else if(each.status==="Draft" && each.role!=="admin"){
          setisAdmin(true)
            }
            else if(each.status==="PendingApproval"){              
              setisPending(true)
            }
        
            else if (each.status !== "Draft" && each.status !== "PendingApproval"){
              router.push(`/projects/${each._id}/sections`);
            }
           
            customLogger.logInfo("Project Card - Sections");
          }}
          className={each.status==="Draft" ?"bg-[#d9d9d9]" :each.status === 'PendingApproval'?"bg-[#FFECE2]":""}
        >
          <ProjectTopLeftBg />
          <ProjectTopRightBg />
          <ProjectBottomLeftBg />
          <ProjectBottomRightBg />
          {each.status==="Draft" || each.status === 'PendingApproval'?
          <Tooltip title="Delete Project" placement="bottom">
          <Image className="float-right" width={15} height={17} src={Delete} alt=""  onClick={(e) => {
            e.stopPropagation(); 
            setDelete(true)
            setProjectId(each._id)
            setRole(each.role)
          }}></Image>
          </Tooltip>:
          <Tooltip title="Project Menu" placement="bottom">
          <div className="float-right">
          <ProjectCardFlipIcon
            src={cardMenu}
            alt=""
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped((prev) => !prev);
            }}
          />
          </div>
          </Tooltip>
          }
          {/* <Tooltip title="Project Menu" placement="bottom">
          <div className="float-right">
            {each._id==="PRJ697680"?<Image src={Delete} alt=""></Image>:<ProjectCardFlipIcon
            src={cardMenu}
            alt=""
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped((prev) => !prev);      
            }}
          />}
          
          </div>
          </Tooltip> */}
          <ProjectLogo
            src={each.companyLogo?each.companyLogo:"https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/defaults/projectCoverPhoto.webp"}
            alt={""}
            width={242}
            height={45}
          />

          <ListHorizontalDivider />
          <Tooltip
            title={each.projectName?.length > 50 ? each.projectName : ""}
          >
            <ProjectNameTitle>
              {truncateString(each.projectName, 50)}
            </ProjectNameTitle>
          </Tooltip>

        {each.status==="Draft" || each.status === 'PendingApproval'?"":<>  <CapturesText>Captures so far</CapturesText>
          <CaptureImageContainer>
            <CaptureImageIcon src={Capture360photo} alt=""></CaptureImageIcon>
            <CaptureName>360 Image - </CaptureName>
            <CaptureCount>
              {each.capture360Count?.length > 1
                ? each.capture360Count
                : `0${each.capture360Count}`}
            </CaptureCount>
          </CaptureImageContainer>
          <CaptureImageContainer>
            <CaptureImageIcon src={CaptureVideoWalk} alt=""></CaptureImageIcon>
            <CaptureName>360° Video Walk - </CaptureName>
            <CaptureCount>
              {each.captureVideoWalkCount?.length > 1
                ? each.captureVideoWalkCount
                : `0${each.captureVideoWalkCount}`}
            </CaptureCount>
          </CaptureImageContainer>
          <CaptureImageContainer>
            <CaptureImageIcon
              src={PhoneImageNewCapture}
              alt=""
            ></CaptureImageIcon>
            <CaptureName>Phone Image - </CaptureName>
            <CaptureCount>
              {each.capturePhoneCount?.length > 1
                ? each.capturePhoneCount
                : `0${each.capturePhoneCount}`}
            </CaptureCount>
          </CaptureImageContainer>
          {/* <CaptureImageContainer>
            <CaptureImageIcon src={LidarWalk} alt=""></CaptureImageIcon>
            <CaptureName>Phone Video Walk - </CaptureName>
            <CaptureCount>
              {each.captureLidarCount?.length > 1
                ? each.captureLidarCount
                : `0${each.captureLidarCount}`}
            </CaptureCount>
          </CaptureImageContainer> */}
          <CaptureImageContainer>
            <CaptureImageIcon src={DroneImageNew} alt=""></CaptureImageIcon>
            <CaptureName>Drone - </CaptureName>
            <CaptureCount>
              {each.captureDroneCount?.length > 1
                ? each.captureDroneCount
                : `0${each.captureDroneCount}`}
            </CaptureCount>
          </CaptureImageContainer>
          <ListHorizontalDivider />

</>}
<UpdatedAtContainer>
            <UsersCountContainer>
              <Image src={userCount} alt="" width={14} height={15} />
              <UsersCountText>{each.numberOfUsers}</UsersCountText>
            </UsersCountContainer>
            <ListDivider />
            <CaptureImageContainer>
              <Image src={updatedAtIcon} alt="" width={14} height={15} />
              <UsersCountText>Last Captured - {isNaN(Date.parse(each.lastUpdated))
      ? "N/A"
      : moment(each.lastUpdated).format('DD MMM YYYY')}</UsersCountText>
            </CaptureImageContainer>
          </UpdatedAtContainer>
          <div>
           {each.status==="Draft"?
            <div className="font-bold text-base text-[#101F4C] text-center" >
            Click to Resume
           </div>: each.status === 'PendingApproval' ?
           <div className="font-bold text-base text-[#101F4C] text-center" >
           </div>
          :""}  
          </div>
          <div className="absolute bottom-[10px]  flex justify-center w-[90%] font-bold text-base text-[#C24200] ">
  {each.status==="Draft" || each.status === 'PendingApproval' ? 
 
      each.status === 'PendingApproval' ? (
        <div className="text-sm  text-white py-[0.5px] bg-[#006CD0] cursor-default px-[4px] rounded-[3px]">{each.status.replace('Pending', 'Pending ')}</div>
      ) : (
        <div className="text-sm text-white py-[0.5px] bg-[#C24200] cursor-default px-[4px] rounded-[3px]">{each.status}</div>
      )   
      : (
    ""
  )}
</div>



        </ProjectCard>
      </ReactCardFlip>
    );
  };
  return (
    <ProjectCardsContainer>
      {projectsData.length ? (
        projectsData.map((each: any, index: number) => {
          return (
            <div
              style={{
                width: "336px",

                minHeight: "432px",
              }}
              key={index}
            >
              <Card each={each} />
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center calc-h146 overflow-y-hidden mx-auto ">
        <ShowErrorContainer>
          <CenteredErrorImage src={projectHierIcon} alt="" />

          <NoResultText>No Results Found</NoResultText>
        </ShowErrorContainer>
         </div>
      )}
      {
        isAdmin || isPending?<PopupComponent open={isAdmin?isAdmin:isPending}
        setShowPopUp={isAdmin?setisAdmin:setisPending}
        modalTitle={isAdmin? "Access Denied !!":"Review in progress !!"}
        modalmessage={
        isAdmin?
        <div className="flex flex-col">
          <div>
          1. The project you are trying to access is in draft stage.
          </div>
        <div>
        2. Please reach out to the admin of this project to finish the project setup.
        </div>
<div>
3. You will receive an email once the project is ready to use.
  </div>         
          </div>:<div className="flex flex-col">
          <div>
          1. The project you are trying to access has not been approved.
          </div>
        <div>
        2. You can access the project only after the project has been approved. 
        </div>
<div>
3. You will receive an email once the project is ready to use.
  </div>         
          </div>}
        primaryButtonLabel={"Ok"}
        SecondaryButtonlabel={""}
        callBackvalue={
          isAdmin?
          () => {
          setisAdmin(false)
        }:() => {
          setisPending(false)
        }}></PopupComponent>:""
      }
      {
        isDelete? <PopupComponent
        open={isDelete}
        setShowPopUp={setDelete}
        modalTitle={"'Attention'"}
        modalmessage={
         `Are you sure you want to 'Delete Project'?`
        }
        primaryButtonLabel={"Yes"}
        SecondaryButtonlabel={"No"}
        callBackvalue={()=>{onDelete(projectId,role);setDelete(false)}}
      />:""
      }
    </ProjectCardsContainer>
  );
};
