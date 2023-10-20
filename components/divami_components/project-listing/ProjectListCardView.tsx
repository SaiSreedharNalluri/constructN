import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IProjects } from "../../../models/IProjects";
import { getProjects, getProjectsList } from "../../../services/project";
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

import moment from "moment";
import CustomLoader from "../custom_loader/CustomLoader";
import { Tooltip } from "@material-ui/core";

export const ProjectListCardView = ({
  projects,
  projectActions,
  truncateString,
}: any) => {
  const router = useRouter();

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
    setProjectsData(projects);
  }, [projects]);

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
            router.push(`/projects/${each._id}/sections`);
          }}
        >
          <ProjectTopLeftBg />
          <ProjectTopRightBg />
          <ProjectBottomLeftBg />
          <ProjectBottomRightBg />
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
          <ProjectLogo
            src={each.companyLogo}
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

          <CapturesText>Captures so far</CapturesText>
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
    </ProjectCardsContainer>
  );
};
