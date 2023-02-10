import { Box } from "@mui/material";
// ../styles/Home.module.css
import Image from "next/image";
// import dividerIcon from "../../../public/images/dividerIcon.svg";
// import filterFunnelIcon from "../../../public/images/filterFunnelIcon.svg";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import Download from "../../../public/divami_icons/download.svg";
import FilterInActive from "../../../public/divami_icons/filterInactive.svg";
import Search from "../../../public/divami_icons/search.svg";
import UpArrow from "../../../public/divami_icons/upArrow.svg";
import Divider from "../../../public/divami_icons/divider.svg";
import {
  ArrowUpIcon,
  BodyContainer,
  BodyContTitle,
  BodyInfo,
  CloseIcon,
  DownloadIcon,
  DueDate,
  DueDateDiv,
  FirstHeader,
  FunnelIcon,
  HeaderContainer,
  HorizontalLine,
  MiniHeaderContainer,
  MiniSymbolsContainer,
  SearchGlassIcon,
  SecondHeader,
  TaskListContainer,
  ThirdHeader,
  TitleContainer,
  LoadMoreContainer,
  LoadMoreButton,
  ArrowUpContainer,
  DividerIcon,
} from "./IssueListStyles";
import RFIList from "../../../public/divami_icons/rfilist.svg";
import SubmittalList from "../../../public/divami_icons/submittalList.svg";
import TransmittalList from "../../../public/divami_icons/transmittalList.svg";

const CustomIssueListDrawer = (props: any) => {
  const { onClose } = props;
  const issueListing = [
    {
      id: 107,
      title: "Submittals",
      status: "In Progress",
      priority: "Medium",
      assignee: "Alex Brandon",
      due_date: "03 Jan'23",
    },

    {
      id: 320,
      title: "Transmittals",
      status: "Completed",
      priority: "Medium",
      assignee: "Charles Sean",
      due_date: "01 Jan'23",
    },
    {
      id: 407,
      title: "Submittals",
      status: "To-do",
      priority: "High",
      assignee: "Ben Fratz",
      due_date: "31 Dec'23",
    },
    {
      id: 407,
      title: "Submittals",
      status: "To-do",
      priority: "High",
      assignee: "Ben Fratz",
      due_date: "31 Dec'23",
    },
    {
      id: 407,
      title: "Submittals",
      status: "To-do",
      priority: "High",
      assignee: "Ben Fratz",
      due_date: "31 Dec'23",
    },
    {
      id: 407,
      title: "Submittals",
      status: "To-do",
      priority: "High",
      assignee: "Ben Fratz",
      due_date: "31 Dec'23",
    },
  ];

  const handleClose = () => {
    onClose(true);
  };

  return (
    <TaskListContainer>
      <HeaderContainer>
        <TitleContainer>
          <span>Issue List</span>
          <CloseIcon
            onClick={() => {
              handleClose();
            }}
            src={CrossIcon}
            alt={"close icon"}
          />
        </TitleContainer>
      </HeaderContainer>

      <MiniHeaderContainer>
        <MiniSymbolsContainer>
          <SearchGlassIcon src={Search} alt={"close icon"} />
          <DividerIcon src={Divider} alt="" />
          <ArrowUpIcon src={UpArrow} alt="Arrow" />
          <DueDate>Due Date</DueDate>
          <DownloadIcon src={Download} alt="Arrow" />
          <FunnelIcon src={FilterInActive} alt="Arrow" />
        </MiniSymbolsContainer>
      </MiniHeaderContainer>

      <BodyContainer>
        <Box sx={{ marginTop: "15px" }}>
          {issueListing.map((val) => {
            return (
              <div>
                <BodyInfo>
                  <FirstHeader>
                    <Image
                      src={
                        val.title === "RFI"
                          ? RFIList
                          : val.title === "Transmittals"
                          ? TransmittalList
                          : val.title === "Submittals"
                          ? SubmittalList
                          : ""
                      }
                      alt="Arrow"
                    />
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
      {/* <LoadMoreContainer>
        <LoadMoreButton>Load More</LoadMoreButton>
      </LoadMoreContainer> */}
    </TaskListContainer>
  );
};

export default CustomIssueListDrawer;
