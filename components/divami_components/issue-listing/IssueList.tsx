import { Box, Drawer, InputAdornment } from "@mui/material";
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
import SearchIcon from "@mui/icons-material/Search";
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
import { useEffect, useState } from "react";
import moment from "moment";
import { ITools } from "../../../models/ITools";
import FilterCommon from "../issue-filter-common/IssueFilterCommon";
import {
  CustomSearchField,
  SearchAreaContainer,
} from "../task_list/TaskListStyles";
import CustomIssueDetailsDrawer from "../issue_detail/IssueDetail";

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
  issuePriorityList: any;
  issueStatusList: any;
  currentProject: any;
  currentStructure: any;
  currentSnapshot: any;
  contextInfo: any;
  issueTypesList?: any;
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
  issuePriorityList,
  issueStatusList,
  currentProject,
  currentStructure,
  currentSnapshot,
  contextInfo,
  issueTypesList,
}) => {
  const handleClose = () => {
    onClose(true);
  };
  const [issuesListData, setIssuesListData] = useState(issuesList);
  const [sortOrder, setSortOrder] = useState("asc");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [listOverlay, setListOverlay] = useState(false);
  const [searchingOn, setSearchingOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  let issueMenuInstance: ITools = { toolName: "issue", toolAction: "" };
  const [openIssueDetail, setOpenIssueDetail] = useState(false);
  const [issueType, setIssueType] = useState<[string]>();
  const [issuePriority, setIssuePriority] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState([]);
  const [issueStatus, setIssueStatus] = useState<[string]>();
  const [dateSortState, setDateSortState] = useState("ascending");
  const [issueListData, setIssueListDataState] = useState([]);
  const [viewIssue, setViewIssue] = useState({});
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [filteredIssuesList, setFilteredTaskList] =
    useState<any>(issueListData);

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
    setIssuesListData(sorted);
  };

  const handleSearchWindow = () => {
    if (searchTerm === "") {
      setSearchingOn(!searchingOn);
    } else {
      setSearchTerm("");
    }
  };

  const handleSearch = () => {
    const filteredData: any = issuesList?.filter((eachTask) => {
      const taskName = eachTask.type.toLowerCase();
      return taskName.includes(searchTerm.toLowerCase());
    });
    setFilteredTaskList([...filteredData]);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    setFilteredTaskList(issuesList);
  }, [issuesList]);
  useEffect(() => {
    setIssuesListData(filteredIssuesList);
  }, [filteredIssuesList]);

  console.log("issuesListnot fott-2", issuesListData, openDrawer);
  const handleViewIssue = (issue: any) => {
    issuesListData.forEach((item: any) => {
      if (issue.id === item._id) {
        setViewIssue(item);
      }
    });
    setOpenIssueDetail(true);
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
          {searchingOn ? (
            <SearchAreaContainer>
              <CustomSearchField
                placeholder="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                InputLabelProps={{ shrink: false }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
                      <CloseIcon
                        onClick={() => {
                          handleSearchWindow();
                        }}
                        src={CrossIcon}
                        alt={"close icon"}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </SearchAreaContainer>
          ) : (
            <>
              <SearchGlassIcon
                src={Search}
                alt={"close icon"}
                onClick={() => setSearchingOn((prev) => !prev)}
              />
              <DividerIcon src={Divider} alt="" />

              {sortOrder === "asc" ? (
                <ArrowUpIcon
                  onClick={sortDateOrdering}
                  src={UpArrow}
                  alt="Arrow"
                />
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
            </>
          )}
        </MiniSymbolsContainer>
      </MiniHeaderContainer>

      <BodyContainer>
        <Box sx={{ marginTop: "15px" }}>
          {issuesListData.map((val, index: number) => {
            return (
              <div key={index}>
                <BodyInfo
                  onClick={() => {
                    handleViewIssue(val);
                  }}
                >
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
                          : val.type === "Building code"
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
      {openIssueDetail && (
        <Drawer
          anchor={"right"}
          open={openIssueDetail}
          onClose={() => setOpenIssueDetail((prev: any) => !prev)}
        >
          <CustomIssueDetailsDrawer
            issuesList={issuesListData}
            issue={viewIssue}
            onClose={() => setOpenIssueDetail((prev: any) => !prev)}
            issueType={issueTypesList}
            issuePriority={issuePriorityList}
            issueStatus={issueStatusList}
            projectUsers={projectUsers}
            currentProject={currentProject}
            currentStructure={currentStructure}
            currentSnapshot={currentSnapshot}
            contextInfo={contextInfo}
          />
        </Drawer>
      )}
      {openDrawer && (
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => setOpenDrawer((prev: any) => !prev)}
        >
          <FilterCommon
            closeFilterOverlay={closeFilterOverlay}
            issuesList={issuesListData}
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
