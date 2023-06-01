import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IJobs } from "../../../models/IJobs";
import { IProjects } from "../../../models/IProjects";
import { getjobsInfo } from "../../../services/jobs";
import { getProjects, getProjectsList } from "../../../services/project";
import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import {
  CaptureProgress,
  CompanyLogo,
  CompanyLogoContainer,
  CountsContainer,
  Divider,
  FirstCount,
  FirstCountIcon,
  FirstCountNumber,
  LastCaptureText,
  LinkIcon,
  LinkText,
  ListActionsContainer,
  ListProgressContainer,
  ListProgressCountContainer,
  ListProgressItemContainer,
  MoreMenuIcon,
  PercentageDelay,
  PercentageSymbol,
  ProgressBar,
  ProgressCount,
  ProgressText,
  ProjectDetailsContainer,
  ProjectName,
  ProjectNameContainer,
  ProjectsContainer,
  ProjectsListItemContainer,
  UpdatedText,
  ViewLink,
} from "./ProjectListingStyles";
import windows from "../../../public/divami_icons/windows.svg";
import ovalsicon from "../../../public/divami_icons/ovalsicon.svg";
import usersIcon from "../../../public/divami_icons/usersIcon.svg";
import summaryicon from "../../../public/divami_icons/summaryicon.svg";
import userProjectIcon from "../../../public/divami_icons/userProjectIcon.svg";
import sectionsIcon from "../../../public/divami_icons/sectionsIcon.svg";
import logoimage from "../../../public/divami_icons/logoimage.svg";
import moremenu from "../../../public/divami_icons/moremenu.svg";
import { StyledMenu } from "../issue-listing/IssueListStyles";
// import SemiCircleProgressBar from "react-progressbar-semicircle";

export const ProjectListing = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<IProjects[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const projectListOptions = [
    {
      label: "Archive project",
      icon: null,
      method: "archive",
      onClick: () => {},
    },
    {
      label: "Clone project",
      icon: null,
      method: "clone",
      onClick: () => {},
    },
  ];
  useEffect(() => {
    if (router.isReady) {
      getProjectsList()
        .then(async (response) => {
          if (response?.data?.success === true) {
            let tempData: IProjects[] = [];
            let temp: IProjects[] = [];
            const projectsData = response?.data?.result.map((each: any) => {
              let diff =
                new Date().getTime() - new Date(each.updatedAt).getTime();

              const daydiff = diff / (1000 * 60 * 60 * 24);
              console.log(daydiff, "daydiff");
              return {
                ...each,
                numOfDays: `${Math.ceil(daydiff)}d`,
                progressCount: "12",
                lastCapture: "12",
              };
            });
            setProjects(projectsData);

            //   await Promise.all(
            //     response.data.result.map(async (pData: IProjects) => {

            //   const jobResp: any = await getjobsInfo(pData._id);
            //   if (jobResp.data.result.length > 0) {
            //     pData.LastUpdatedOn = jobResp.data.result.sort(
            //       (a: IJobs, b: IJobs) =>
            //         new Date(b.date).getTime() - new Date(a.date).getTime()
            //     )[0].updatedAt;
            //   }
            //   if (pData.LastUpdatedOn) {
            //     tempData.push(pData);
            //   } else {
            //     temp.push(pData);
            //   }
            // })
            //   );
            //   tempData = tempData.sort(
            //     (a: any, b: any) =>
            //       new Date(b.LastUpdatedOn).getTime() -
            //       new Date(a.LastUpdatedOn).getTime()
            //   );
            //   setProjects(tempData.concat(temp));
            //   setLoading(true);
          }
        })
        .catch((error) => {});
    }
  }, [router.isReady]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  return (
    <ProjectsContainer>
      {projects.map((each: any, index: number) => {
        return (
          <ProjectsListItemContainer key={index}>
            <ProjectNameContainer>
              <CompanyLogoContainer>
                <CompanyLogo src={logoimage} alt="" height={45} width={242} />
              </CompanyLogoContainer>
              <Divider orientation="horizontal" />
              <ProjectName>{each?.name}</ProjectName>
              <CountsContainer>
                <FirstCount>
                  <FirstCountIcon src={windows} alt={""}></FirstCountIcon>
                  <FirstCountNumber>{each.snapshotCount}</FirstCountNumber>
                </FirstCount>
                <FirstCount>
                  <FirstCountIcon src={ovalsicon} alt={""}></FirstCountIcon>
                  <FirstCountNumber> {each.snapshotCount}</FirstCountNumber>
                </FirstCount>
                <FirstCount>
                  <FirstCountIcon src={usersIcon} alt={""}></FirstCountIcon>
                  <FirstCountNumber>{each.snapshotCount}</FirstCountNumber>
                </FirstCount>
              </CountsContainer>
              <UpdatedText>Updated {each?.numOfDays} ago</UpdatedText>
            </ProjectNameContainer>
            <Divider orientation="vertical" />
            <ProjectDetailsContainer>
              <ListActionsContainer>
                <ViewLink>
                  <LinkIcon src={userProjectIcon} alt={""}></LinkIcon>
                  <LinkText>View Team Members</LinkText>
                </ViewLink>
                <ViewLink>
                  <LinkIcon src={sectionsIcon} alt={""}></LinkIcon>
                  <LinkText>View Sections</LinkText>
                </ViewLink>
                <ViewLink>
                  <LinkIcon src={summaryicon} alt={""}></LinkIcon>
                  <LinkText>View Summary</LinkText>
                </ViewLink>
                <ViewLink>
                  <MoreMenuIcon
                    src={moremenu}
                    alt=""
                    onClick={() => setIsMenuOpen(true)}
                  />
                </ViewLink>
              </ListActionsContainer>
              <ListProgressContainer>
                <ListProgressItemContainer>
                  <ListProgressCountContainer>
                    <ProgressCount>{each.progressCount}%</ProgressCount>
                    <ProgressText>Current Progress</ProgressText>
                  </ListProgressCountContainer>

                  <Divider orientation="horizontal" theme="light" />
                  <LastCaptureText>
                    {each.lastCapture}% since last capture
                  </LastCaptureText>
                </ListProgressItemContainer>
                <ListProgressItemContainer>
                  <ListProgressCountContainer>
                    <ProgressCount>{each.progressCount}%</ProgressCount>
                    <ProgressText>Actual Issues</ProgressText>
                  </ListProgressCountContainer>

                  <Divider orientation="horizontal" theme="light" />
                  <LastCaptureText>
                    <CaptureProgress>
                      {each.lastCapture} In Progress
                    </CaptureProgress>
                    | {each.open} To Do
                  </LastCaptureText>
                </ListProgressItemContainer>
                <ListProgressItemContainer>
                  <ListProgressCountContainer>
                    <ProgressCount>{each.progressCount}%</ProgressCount>
                    <ProgressText>Tasks Raised</ProgressText>
                  </ListProgressCountContainer>

                  <Divider orientation="horizontal" theme="light" />
                  <LastCaptureText>
                    <CaptureProgress>
                      {each.lastCapture} In Progress{" "}
                    </CaptureProgress>{" "}
                    | {each.open} To Do
                  </LastCaptureText>
                </ListProgressItemContainer>
                <ListProgressItemContainer>
                  {/* <ProgressBar></ProgressBar> */}
                  {/* <SemiCircleProgressBar
                    percentage={33}
                    showPercentValue={false}
                    diameter={"100"}
                    background="#D9D9D9"
                    stroke="#F1742E"
                    strokeWidth="7"
                  /> */}
                  <PercentageDelay>
                    10
                    <PercentageSymbol>%</PercentageSymbol>
                  </PercentageDelay>

                  <LastCaptureText leftAlign>Delay from plan</LastCaptureText>
                </ListProgressItemContainer>
              </ListProgressContainer>
            </ProjectDetailsContainer>
          </ProjectsListItemContainer>
        );
      })}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isMenuOpen}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {projectListOptions.map((option) => (
          <>
            <StyledMenu
              className="custom-styled-menu"
              key={option.label}
              onClick={() => option.onClick()}
              data-testid="sort-menu-item"
            >
              {option.label}
            </StyledMenu>
          </>
        ))}
      </Menu>
    </ProjectsContainer>
  );
};
