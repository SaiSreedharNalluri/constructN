import { Box } from "@mui/material";
// ../styles/Home.module.css
import Image from "next/image";
// import dividerIcon from "../../../public/images/dividerIcon.svg";
// import filterFunnelIcon from "../../../public/images/filterFunnelIcon.svg";
import FilterActive from "../../../public/divami_icons/filterActive.svg";
import FilterInActive from "../../../public/divami_icons/filterInactive.svg";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import DownArrow from "../../../public/divami_icons/downArrow.svg";
import UpArrow from "../../../public/divami_icons/upArrow.svg";
import Search from "../../../public/divami_icons/search.svg";
import Download from "../../../public/divami_icons/download.svg";
import {
  HeaderContainer,
  TaskListContainer,
  TitleContainer,
  CloseIcon,
  MiniHeaderContainer,
  MiniSymbolsContainer,
  SearchGlassIcon,
  DividerIcon,
  ArrowUpIcon,
  DownloadIcon,
  FunnelIcon,
  DueDate,
  BodyContainer,
  FirstHeader,
  BodyInfo,
  BodyContIcon,
  BodyContTitle,
  SecondHeader,
  ThirdHeader,
  DueDateDiv,
  HorizontalLine,
} from "./TaskListStyles";

const CustomTaskListDrawer = () => {
  const taskListing = [
    {
      id: 107,
      title: "RFI",
      //   icon: hourGlassIcon,
      status: "In Progress",
      priority: "Medium",
      assignee: "Alex Brandon",
      due_date: "03 Jan'23",
    },

    {
      id: 320,
      title: "Transmittals",
      //   icon: safetyIcon,
      status: "Completed",
      priority: "Medium",
      assignee: "Charles Sean",
      due_date: "01 Jan'23",
    },
    {
      id: 407,
      title: "Submittals",
      //   icon: circleTickMarkIcon,
      status: "To-do",
      priority: "High",
      assignee: "Ben Fratz",
      due_date: "31 Dec'23",
    },
    {
      id: 407,
      title: "Submittals",
      //   icon: circleTickMarkIcon,
      status: "To-do",
      priority: "High",
      assignee: "Ben Fratz",
      due_date: "31 Dec'23",
    },
    {
      id: 407,
      title: "Submittals",
      //   icon: circleTickMarkIcon,
      status: "To-do",
      priority: "High",
      assignee: "Ben Fratz",
      due_date: "31 Dec'23",
    },
    {
      id: 407,
      title: "Submittals",
      //   icon: circleTickMarkIcon,
      status: "To-do",
      priority: "High",
      assignee: "Ben Fratz",
      due_date: "31 Dec'23",
    },
  ];
  return (
    <TaskListContainer>
      <HeaderContainer>
        <TitleContainer>
          <span>Task List</span>
          <CloseIcon src={CrossIcon} alt={"close icon"} />
        </TitleContainer>
      </HeaderContainer>

      <MiniHeaderContainer>
        <MiniSymbolsContainer>
          {/* <Image src={searchGlassIcon} alt="Arrow" /> */}
          <SearchGlassIcon src={Search} alt={"close icon"} />
          <ArrowUpIcon src={UpArrow} alt="Arrow" />
          <DueDate>Due Date</DueDate>
          <DownloadIcon src={Download} alt="Arrow" />
          <FunnelIcon src={FilterInActive} alt="Arrow" />
        </MiniSymbolsContainer>
      </MiniHeaderContainer>

      <BodyContainer>
        <Box sx={{ marginTop: "15px" }}>
          {taskListing.map((val) => {
            return (
              <div>
                <BodyInfo>
                  <FirstHeader>
                    <BodyContIcon>
                      <Image src={""} alt="Arrow" />
                    </BodyContIcon>

                    <BodyContTitle>
                      {val.title} (#{val.id})
                    </BodyContTitle>
                  </FirstHeader>

                  <SecondHeader>
                    <div>{val.priority} Priority</div>
                  </SecondHeader>

                  {/* <div className={styles.second_header}>
                  </div> */}

                  <ThirdHeader>
                    <div>{val.assignee}</div>
                    <DueDateDiv>Due by {val.due_date}</DueDateDiv>
                  </ThirdHeader>
                </BodyInfo>

                <HorizontalLine></HorizontalLine>
              </div>
            );
          })}
        </Box>
      </BodyContainer>
    </TaskListContainer>
  );
};

export default CustomTaskListDrawer;
