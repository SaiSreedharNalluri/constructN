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
} from "./ProjectListingStyles";
import Image from "next/image";
import capture360Image from "../../../public/divami_icons/capture360Image.svg";
import captureLidarIcon from "../../../public/divami_icons/captureLidarIcon.svg";
import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import videoWalk from "../../../public/divami_icons/videoWalk.svg";
// import droneImage from "../../../public/divami_icons/droneImage.svg";
import DroneImage from "../../../public/divami_icons/DroneImage.svg";
import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";
import ReactCardFlip from "react-card-flip";

import moment from "moment";
import CustomLoader from "../custom_loader/CustomLoader";

export const ProjectListCardView = ({ projects, projectActions }: any) => {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
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

  const TruncatedString = ({ text, maxLength, suffixLength }: any) => {
    let truncatedText = text;

    if (text.length > maxLength) {
      const prefix = text.substring(0, maxLength - suffixLength);
      const suffix = text.substring(text.length - suffixLength);
      truncatedText = prefix + "..." + suffix;
    }

    return truncatedText;
  };

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

          <ProjectLogo
            src={each.companyLogo}
            alt={""}
            width={242}
            height={45}
          />

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
          onClick={() => {
            router.push(`/projects/${each._id}/sections`);
          }}
          onMouseEnter={() => {
            setIsFlipped((prev) => !prev);
          }}
        >
          <ProjectTopLeftBg />
          <ProjectTopRightBg />
          <ProjectBottomLeftBg />
          <ProjectBottomRightBg />

          <ProjectLogo
            src={each.companyLogo}
            alt={""}
            width={242}
            height={45}
          />

          <ListHorizontalDivider />
          <ProjectNameTitle>
            <TruncatedString
              text={each.projectName}
              maxLength={20}
              suffixLength={0}
            />
          </ProjectNameTitle>
          <UpdatedAtContainer>
            <UsersCountContainer>
              <Image src={userCount} alt="" width={14} height={15} />
              <UsersCountText>{each.numberOfUsers}</UsersCountText>
            </UsersCountContainer>
            <ListDivider />
            <CaptureImageContainer>
              <Image src={updatedAtIcon} alt="" width={14} height={15} />
              <UsersCountText>Updated on - {each.updatedAt}</UsersCountText>
            </CaptureImageContainer>
          </UpdatedAtContainer>

          <CapturesText>Captures so far</CapturesText>
          <CaptureImageContainer>
            <CaptureImageIcon src={capture360Image} alt=""></CaptureImageIcon>
            <CaptureName>360 photo - </CaptureName>
            <CaptureCount>
              {each.capture360Count?.length > 1
                ? each.capture360Count
                : `0${each.capture360Count}`}
            </CaptureCount>
          </CaptureImageContainer>
          <CaptureImageContainer>
            <CaptureImageIcon src={videoWalk} alt=""></CaptureImageIcon>
            <CaptureName>360° Video Walk - </CaptureName>
            <CaptureCount>
              {each.captureVideoWalkCount?.length > 1
                ? each.captureVideoWalkCount
                : `0${each.captureVideoWalkCount}`}
            </CaptureCount>
          </CaptureImageContainer>
          <CaptureImageContainer>
            <CaptureImageIcon src={phoneImage} alt=""></CaptureImageIcon>
            <CaptureName>Phone capture - </CaptureName>
            <CaptureCount>
              {each.capturePhoneCount?.length > 1
                ? each.capturePhoneCount
                : `0${each.capturePhoneCount}`}
            </CaptureCount>
          </CaptureImageContainer>
          <CaptureImageContainer>
            <CaptureImageIcon src={captureLidarIcon} alt=""></CaptureImageIcon>
            <CaptureName>Phone Video Walk - </CaptureName>
            <CaptureCount>
              {each.captureLidarCount?.length > 1
                ? each.captureLidarCount
                : `0${each.captureLidarCount}`}
            </CaptureCount>
          </CaptureImageContainer>
          <CaptureImageContainer>
            <CaptureImageIcon src={DroneImage} alt=""></CaptureImageIcon>
            <CaptureName>Drone - </CaptureName>
            <CaptureCount>
              {each.captureDroneCount?.length > 1
                ? each.captureDroneCount
                : `0${each.captureDroneCount}`}
            </CaptureCount>
          </CaptureImageContainer>
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
        <ShowErrorContainer>
          <CenteredErrorImage src={projectHierIcon} alt="" />

          <NoResultText>No Result Found</NoResultText>
        </ShowErrorContainer>
      )}
    </ProjectCardsContainer>
  );
};
