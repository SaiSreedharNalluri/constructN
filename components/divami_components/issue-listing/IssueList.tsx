import { Box, Drawer } from "@mui/material";
import Image from "next/image";

import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import Download from "../../../public/divami_icons/download.svg";
import FilterInActive from "../../../public/divami_icons/filterInactive.svg";
import Search from "../../../public/divami_icons/search.svg";
import UpArrow from "../../../public/divami_icons/upArrow.svg";
import Divider from "../../../public/divami_icons/divider.svg";
import downArrow from "../../../public/divami_icons/downArrow.svg";
import commission from "../../../public/divami_icons/commission.svg";
import designIcon from "../../../public/divami_icons/designIcon.svg";

import Moment from "moment";

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
  ArrowDownIcon,
} from "./IssueListStyles";
import RFIList from "../../../public/divami_icons/rfiList.svg";
import SubmittalList from "../../../public/divami_icons/submittalList.svg";
import TransmittalList from "../../../public/divami_icons/transmittalList.svg";
import HourglassIcon from "../../../public/divami_icons/hourGlassIcon.svg";
import IssuesHighlightedIcon from "../../../public/divami_icons/issuesHighlightedIcon.svg";

import { Issue } from "../../../models/Issue";
import { useState } from "react";
import moment from "moment";
import { ITools } from "../../../models/ITools";
import FilterCommon from "../issue-filter-common/IssueFilterCommon";

interface IProps {
  closeOverlay: () => void;
  issuesList: Issue[];
  visibility: boolean;
  handleOnFilter: (formData: object) => void;
  handleOnSort: (sortMethod: string) => void;
  closeFilterOverlay: () => void;
  deleteTheIssue: (issueObj: object) => void;
  clickIssueEditSubmit: (editObj: object, issueObj: object) => void;
  onClose: any;
}

const CustomIssueListDrawer: React.FC<IProps> = ({
  visibility,
  closeOverlay,
  issuesList,
  handleOnFilter,
  handleOnSort,
  closeFilterOverlay,
  deleteTheIssue,
  clickIssueEditSubmit,
  onClose,
}) => {
  const issueListing = [
    {
      id: 107,
      title: "Submittals",
      status: "In Progress",
      priority: "Medium",
      assignee: "Alex Brandon",
      due_date: "2023-02-09T05:04:01.012Z",
    },

    {
      id: 320,
      title: "Transmittals",
      status: "Completed",
      priority: "Medium",
      assignee: "Charles Sean",
      due_date: "2023-02-18T05:04:01.012Z",
    },
    {
      id: 407,
      title: "Submittals",
      status: "To-do",
      priority: "High",
      assignee: "Ben Fratz",
      due_date: "2023-02-14T05:04:01.012Z",
    },
    {
      id: 407,
      title: "Submittals",
      status: "To-do",
      priority: "High",
      assignee: "Ben Fratz",
      due_date: "2023-02-11T05:04:01.012Z",
    },
  ];

  const handleClose = () => {
    onClose(true);
  };
  const [sortedDates, setSortedDates] = useState(issuesList);
  const [sortOrder, setSortOrder] = useState("asc");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [listOverlay, setListOverlay] = useState(false);
  let issueMenuInstance: ITools = { toolName: "issue", toolAction: "" };

  const closeIssueList = () => {
    //setListOverlay(false);
    issueMenuInstance.toolAction = "issueViewClose";
    // issueMenuClicked(issueMenuInstance);
  };

  const handleViewTaskList = () => {
    // console.log("teskssksk trigg");
    setOpenDrawer(true);
  };

  const sortDateOrdering = () => {
    let sorted;
    if (sortOrder === "asc") {
      sorted = [...issuesList].sort((a: any, b: any) => {
        return new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf();
      });
      setSortOrder("desc");
    } else {
      sorted = [...issuesList].sort((a: any, b: any) => {
        return new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf();
      });
      setSortOrder("asc");
    }
    setSortedDates(sorted);
  };

  console.log("issuesListnot fott-2", issuesList, openDrawer);
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

          {sortOrder === "asc" ? (
            <ArrowUpIcon onClick={sortDateOrdering} src={UpArrow} alt="Arrow" />
          ) : (
            <ArrowDownIcon
              onClick={sortDateOrdering}
              src={downArrow}
              alt="Arrow"
            />
          )}
          <DueDate>Due Date</DueDate>
          <DownloadIcon src={Download} alt="Arrow" />
          <FunnelIcon
            src={FilterInActive}
            alt="Arrow"
            onClick={() => {
              handleViewTaskList();
            }}
          />
        </MiniSymbolsContainer>
      </MiniHeaderContainer>

      <BodyContainer>
        <Box sx={{ marginTop: "15px" }}>
          {sortedDates.map((val) => {
            return (
              <div>
                <BodyInfo>
                  <FirstHeader>
                    <Image
                      src={
                        val.type === "RFI"
                          ? RFIList
                          : val.type === "Safety"
                          ? HourglassIcon
                          : val.type === "Transmittals"
                          ? TransmittalList
                          : val.type === "Clash"
                          ? SubmittalList
                          : val.type === "Commissioning"
                          ? commission
                          : val.type === "Building Code"
                          ? HourglassIcon
                          : val.type === "Design"
                          ? designIcon
                          : val.type === "Submittals"
                          ? SubmittalList
                          : ""
                      }
                      alt="Arrow"
                    />
                    <BodyContTitle>
                      {val.type} (#{val._id})
                    </BodyContTitle>
                  </FirstHeader>

                  <SecondHeader>
                    <div>{val.priority} Priority</div>
                  </SecondHeader>

                  <ThirdHeader>
                    <div>{val.assignees[0].firstName}</div>
                    <DueDateDiv>
                      Due by {Moment(val.dueDate).format("DD MMM 'YY")}
                    </DueDateDiv>
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

      {openDrawer && (
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => setOpenDrawer((prev: any) => !prev)}
        >
          <FilterCommon
            closeFilterOverlay={closeFilterOverlay}
            issuesList={issuesList}
            visibility={listOverlay}
            closeOverlay={closeIssueList}
            handleOnFilter={handleOnFilter}
            onClose={() => setOpenDrawer((prev: any) => !prev)}
            handleOnSort={() => {}}
            deleteTheIssue={() => {}}
            clickIssueEditSubmit={() => {}}
          />
        </Drawer>
      )}
    </TaskListContainer>
  );
};

export default CustomIssueListDrawer;
