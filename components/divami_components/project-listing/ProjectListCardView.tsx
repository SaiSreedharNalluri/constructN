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

import LaserIcon from "../../../public/icons/LaserIcon.svg";

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
import { Mixpanel } from "../../analytics/mixpanel";
import CustomMiniLoader from "../custom_loader/CustomMiniLoader";

const Image2D =({ stroke = "#36415D" , strokeWidth ='1' })=>(<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.3125 15H3.32031V14.1602L4.75391 12.7109C5.04297 12.4141 5.27474 12.1667 5.44922 11.9688C5.6263 11.7682 5.75391 11.5859 5.83203 11.4219C5.91276 11.2578 5.95312 11.082 5.95312 10.8945C5.95312 10.668 5.88932 10.4987 5.76172 10.3867C5.63672 10.2721 5.46875 10.2148 5.25781 10.2148C5.03646 10.2148 4.82161 10.2656 4.61328 10.3672C4.40495 10.4688 4.1875 10.6133 3.96094 10.8008L3.30469 10.0234C3.46875 9.88281 3.64193 9.75 3.82422 9.625C4.00911 9.5 4.22266 9.39974 4.46484 9.32422C4.70964 9.24609 5.0026 9.20703 5.34375 9.20703C5.71875 9.20703 6.04036 9.27474 6.30859 9.41016C6.57943 9.54557 6.78776 9.73047 6.93359 9.96484C7.07943 10.1966 7.15234 10.4596 7.15234 10.7539C7.15234 11.069 7.08984 11.3568 6.96484 11.6172C6.83984 11.8776 6.65755 12.1354 6.41797 12.3906C6.18099 12.6458 5.89453 12.9284 5.55859 13.2383L4.82422 13.9297V13.9844H7.3125V15ZM13.0352 12.0898C13.0352 12.7331 12.9115 13.2708 12.6641 13.7031C12.4193 14.1328 12.0638 14.457 11.5977 14.6758C11.1315 14.8919 10.5703 15 9.91406 15H8.29688V9.28906H10.0898C10.6888 9.28906 11.2083 9.39583 11.6484 9.60938C12.0885 9.82031 12.4297 10.1341 12.6719 10.5508C12.9141 10.9648 13.0352 11.4779 13.0352 12.0898ZM11.7773 12.1211C11.7773 11.6992 11.7148 11.3529 11.5898 11.082C11.4674 10.8086 11.2852 10.6068 11.043 10.4766C10.8034 10.3464 10.5065 10.2812 10.1523 10.2812H9.50781V14H10.0273C10.6185 14 11.0573 13.8424 11.3438 13.5273C11.6328 13.2122 11.7773 12.7435 11.7773 12.1211Z" fill={stroke} stroke-width={strokeWidth}  />
<path d="M21 13V15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H3C2.46957 17 1.96086 16.7893 1.58579 16.4142C1.21071 16.0391 1 15.5304 1 15V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H9" stroke={stroke} stroke-linecap="round" stroke-linejoin="round" stroke-width={strokeWidth}  />
<path d="M20.9999 0.999987L16.6961 5.33249L14.4159 3.06732L11.0181 6.48772" stroke={stroke} stroke-linecap="round" stroke-linejoin="round" stroke-width={strokeWidth} />
<path d="M18.2725 1.00903L20.9997 0.999974L21.0088 3.72723" stroke={stroke} stroke-linecap="round" stroke-linejoin="round" stroke-width={strokeWidth} />
</svg>

)

export const ProjectListCardView = ({
  projects,
  projectActions,
  truncateString,
  onDelete,
  d2Details,
  userId
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
            //router.push(`/projects/${each._id}/sections`);
            router.push({pathname:'/projects/[projectId]/sections',query:{projectId:each._id}})
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

        <ProjectActionsContainer className="overflow-y-auto h-[250px]">
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
            Mixpanel.track( {name: "projects_card_clicked",project_id:each._id,company_id:each.company?.name,screen_name:"projects_list_page",event_category:"projects_list",event_action:"projects_card_clicked",user_id:userId?._id,layout:"grid"})          
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
          <CaptureImageContainer>
            <CaptureImageIcon src={LaserIcon} alt="laser icon"></CaptureImageIcon>
            <CaptureName>Laser - </CaptureName>
            <CaptureCount>
            {each.captures?.Laser || 0}
            </CaptureCount>
          </CaptureImageContainer>
          <CaptureImageContainer opacity={d2Details[each._id] ? 1 : 0.6}>
            <Image2D stroke={d2Details[each._id]? "green": "#36415D"} strokeWidth={d2Details[each._id]? "1.3": "1"} />
              <div className={`${d2Details[each._id] ? "text-[green]": 'text-[#36415D]'} ml-[7px]`}>{d2Details[each._id]? "Available" : "Not Available"}</div>
            </CaptureImageContainer>
          <ListHorizontalDivider />

</>}
<UpdatedAtContainer>
            <UsersCountContainer>
              <Image src={userCount} alt="" width={14} height={15} />
              <UsersCountText>{each.numberOfUsers}</UsersCountText>
            </UsersCountContainer>
            <ListDivider />
            <CaptureImageContainer marginBottom>
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
      {projects.length ? (
        !projectsData.length?(<CustomMiniLoader></CustomMiniLoader>):(
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
        )
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
