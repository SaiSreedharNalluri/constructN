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
} from "./ProjectListingStyles";
import Image from "next/image";
import capture360Image from "../../../public/divami_icons/capture360Image.svg";
import captureLidarIcon from "../../../public/divami_icons/captureLidarIcon.svg";
import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import videoWalk from "../../../public/divami_icons/videoWalk.svg";
import moment from "moment";

export const ProjectListCardView = ({ projects, projectActions }: any) => {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
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
  return (
    <ProjectCardsContainer>
      {projectsData.map((each: any) => {
        return each.showActionsCard ? (
          <ProjectCard
            active
            onMouseLeave={() => {
              setProjectsData((prev: any) =>
                prev.map((item: any) => {
                  return {
                    ...item,
                    showActionsCard: false,
                  };
                })
              );
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
              {projectActions.map((each: any) => {
                return <ProjectActionItem>{each.label}</ProjectActionItem>;
              })}
            </ProjectActionsContainer>
          </ProjectCard>
        ) : (
          <ProjectCard
            onMouseEnter={() => {
              setProjectsData((prev: any) =>
                prev.map((item: any) => {
                  if (each._id === item._id) {
                    return {
                      ...item,
                      showActionsCard: true,
                    };
                  } else {
                    return {
                      ...item,
                      showActionsCard: false,
                    };
                  }
                })
              );
            }}
            onMouseLeave={() => {
              setProjectsData((prev: any) =>
                prev.map((item: any) => {
                  return {
                    ...item,
                    showActionsCard: false,
                  };
                })
              );
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
            <ProjectNameTitle>{each.projectName}</ProjectNameTitle>
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
              <CaptureName>Video Walk - </CaptureName>
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
              <CaptureImageIcon
                src={captureLidarIcon}
                alt=""
              ></CaptureImageIcon>
              <CaptureName>LiDAR - </CaptureName>
              <CaptureCount>
                {each.captureLidarCount?.length > 1
                  ? each.captureLidarCount
                  : `0${each.captureLidarCount}`}
              </CaptureCount>
            </CaptureImageContainer>
            <CaptureImageContainer>
              <CaptureImageIcon src={capture360Image} alt=""></CaptureImageIcon>
              <CaptureName>Drone - </CaptureName>
              <CaptureCount>
                {each.captureDroneCount?.length > 1
                  ? each.captureDroneCount
                  : `0${each.captureDroneCount}`}
              </CaptureCount>
            </CaptureImageContainer>
          </ProjectCard>
        );
      })}
    </ProjectCardsContainer>
  );
};
