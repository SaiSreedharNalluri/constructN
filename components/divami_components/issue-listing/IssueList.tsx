import {
  Box,
  Drawer,
  InputAdornment,
  ListItemIcon,
  Menu,
  setRef,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import Image from "next/image";

import SearchIcon from "@mui/icons-material/Search";
import Moment from "moment";
import commission from "../../../public/divami_icons/commission.svg";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import designIcon from "../../../public/divami_icons/designIcon.svg";
import DividerIconSVG from "../../../public/divami_icons/divider.svg";
import downArrow from "../../../public/divami_icons/downArrow.svg";
import Download from "../../../public/divami_icons/download.svg";
import FilterInActive from "../../../public/divami_icons/filterInactive.svg";
import Search from "../../../public/divami_icons/search.svg";
import UpArrow from "../../../public/divami_icons/upArrow.svg";
import AppliedFilterIcon from "../../../public/divami_icons/appliedFilter.svg";
import HourglassIcon from "../../../public/divami_icons/hourGlassIcon.svg";
import RFIList from "../../../public/divami_icons/rfiList.svg";
import SubmittalList from "../../../public/divami_icons/submittalList.svg";
import TransmittalList from "../../../public/divami_icons/transmittalList.svg";
import sort from "../../../public/divami_icons/sort.svg";
import DownArrow from "../../../public/divami_icons/downArrow.svg";
import listingErrorIcon from "../../../public/divami_icons/listingErrorIcon.svg";
import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";
import closeWithCircle from "../../../public/divami_icons/closeWithCircle.svg";
import filterElip from "../../../public/divami_icons/filterElip.svg";
import progressHour from "../../../public/divami_icons/progressHour.svg";
import todoIcon from "../../../public/divami_icons/todoIcon.svg";
import blockedFrame from "../../../public/divami_icons/blockedFrame.svg";
import smallDivider from "../../../public/divami_icons/smallDivider.svg";

import {
  AppliedFilter,
  ArrowDownIcon,
  ArrowUpIcon,
  BodyContainer,
  BodyContTitle,
  BodyInfo,
  DividerIcon,
  DownloadIcon,
  DueDate,
  DueDateDiv,
  ErrorImageDiv,
  FilterIcon,
  FirstHeader,
  FunnelIcon,
  HeaderContainer,
  HorizontalLine,
  ImageErrorIcon,
  MessageDiv,
  MiniHeaderContainer,
  MiniSymbolsContainer,
  SearchGlassIcon,
  SecondDividerIcon,
  SecondHeader,
  StyledMenu,
  TaskListContainer,
  ThirdHeader,
  TitleContainer,
  MessageDivShowErr,
  RaiseButtonDiv,
  ContentError,
  ContentErrorSpan,
  NoMatchDiv,
  CustomBox,
  LoadMoreText,
  FilterIndication,
  MenuOptionLabel,
  SearchAreaContainer,
  DueDateHeader,
  TicketName,
  ProgressChild,
  SmallDivider,
  PriorityChild,
  AssigneeList,
  Watcher,
} from "./IssueListStyles";

import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { Issue } from "../../../models/Issue";
import { ITools } from "../../../models/ITools";
import FilterCommon from "../issue-filter-common/IssueFilterCommon";
import {
  CloseIcon,
  CustomSearchField,
  IconContainer,
} from "../task_list/TaskListStyles";
import CustomIssueDetailsDrawer from "../issue_detail/IssueDetail";
import { getProjectUsers } from "../../../services/project";
import router from "next/router";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { getIssuesList } from "../../../services/issue";
import { DownloadTable } from "../toolbar/DownloadTable";
import { downloadMenuOptions, getDownladableList } from "./Constants";
import CompletedIconTask from "../../../public/divami_icons/CompletedIconTask.svg";
import sortUp from "../../../public/divami_icons/sortUp.svg";

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
  issueFilterState?: any;
  setIssueFilterState?: any;
  getIssues?: any;
  handleOnIssueSort?: any;
  deleteTheAttachment?: any;
  openIssueCreateFn?: any;
  issueMenuClicked?: any;
  projectUsers?: any;
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
  issueFilterState,
  setIssueFilterState,
  getIssues,
  handleOnIssueSort,
  deleteTheAttachment,
  openIssueCreateFn,
  issueMenuClicked,
  projectUsers,
}) => {
  const handleClose = () => {
    onClose(true);
  };
  const [sortOrder, setSortOrder] = useState("asc");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [listOverlay, setListOverlay] = useState(false);
  const [searchingOn, setSearchingOn] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  let issueMenuInstance: ITools = { toolName: "issue", toolAction: "" };
  const [openIssueDetail, setOpenIssueDetail] = useState(false);
  const [issueType, setIssueType] = useState<[string]>();
  const [issuePriority, setIssuePriority] = useState<[string]>();
  const [issueStatus, setIssueStatus] = useState<[string]>();
  const [dateSortState, setDateSortState] = useState("ascending");
  const [viewIssue, setViewIssue] = useState<any>({});
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [issueList, setIssueList] = useState<any>(issuesList);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [remainingIssues, setRemainingIssues] = useState(issueList?.length);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const docRef: any = useRef();
  const [ref1, setRef1] = useState(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [downloadList, setDownloadList] = useState(issueList);
  const sortMenuOptions = [
    {
      label: "Status ( To Do - Completed)",
      icon: null,
      method: "status_asc",
    },
    {
      label: "Status ( Completed - To Do)",
      icon: null,
      method: "status_desc",
    },

    {
      label: "Priotity ( High - Low)",
      icon: null,
      method: "Dsc Priority",
    },
    {
      label: "Priotity ( Low - High)",
      icon: null,
      method: "Asc Priority",
    },
    {
      label: "Due Date ",
      icon: UpArrow,
      method: "Dsc DueDate",
    },
    {
      label: "Due Date ",
      icon: DownArrow,
      method: "Asc DueDate",
    },
  ];

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setIsSortMenuOpen(false);
    setAnchorEl(null);
  };

  const handleDownloadClose = () => {
    setIsDownloadMenuOpen(false);
    setAnchorEl(null);
  };

  const handleSortMenuClick = (sortMethod: string) =>
    handleOnIssueSort(sortMethod);

  const handleDownloadMenuClick = () => handleDownloadClose();

  const [filteredIssuesList, setFilteredIssuesList] = useState<any>(
    issueList.slice(0, 10)
  );
  const [errorShow, setErrorShow] = useState<any>(issueList);

  useEffect(() => {
    setIssueList(issuesList);
    setDownloadList(issuesList);
  }, [issuesList]);

  useEffect(() => {
    setFilteredIssuesList(issueList.slice(0, 10));
  }, [issueList]);

  useEffect(() => {
    setRemainingIssues(issueList?.length > 10 ? issueList.length : 0);
  }, [issueList]);

  const closeIssueList = () => {
    //setListOverlay(false);
    issueMenuInstance.toolAction = "issueViewClose";
    // issueMenuClicked(issueMenuInstance);
  };

  const handleViewTaskList = () => {
    setOpenDrawer(true);
  };

  // const sortDateOrdering = () => {
  //   let sorted;
  //   if (sortOrder === "asc") {
  //     sorted = filteredIssuesList.sort((a: any, b: any) => {
  //       return new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf();
  //     });
  //     setSortOrder("desc");
  //   } else {
  //     sorted = filteredIssuesList.sort((a: any, b: any) => {
  //       return new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf();
  //     });
  //     setSortOrder("asc");
  //   }
  //   setFilteredIssuesList(sorted);
  // };

  const handleSearchWindow = () => {
    if (searchTerm === "") {
      setSearchingOn(!searchingOn);
    } else {
      setSearchTerm("");
    }
  };

  const handleSearch = () => {
    if (searchTerm) {
      const filteredData: any = issueList?.filter((eachIssue: any) => {
        const taskName = eachIssue?.type?.toLowerCase();
        const sequenceNumber = eachIssue?.sequenceNumber.toString();
        return (
          taskName.includes(searchTerm.toLowerCase()) ||
          sequenceNumber.includes(searchTerm.toLowerCase())
        );
      });
      setDownloadList(filteredData);
      setFilteredIssuesList([...filteredData.slice(0, 10)]);
      setRemainingIssues(filteredData.length > 10 ? filteredData.length : 0);
    } else {
      setFilteredIssuesList(issueList.slice(0, 10));
      setRemainingIssues(issueList.length > 10 ? issueList.length : 0);
    }
  };

  const handleLoadMore = () => {
    const noOfIssuesLoaded = filteredIssuesList.length;
    if (searchTerm) {
      const filteredData: any = issueList?.filter((eachIssue: any) => {
        const taskName = eachIssue?.type?.toLowerCase();
        const sequenceNumber = eachIssue?.sequenceNumber.toString();
        return (
          taskName.includes(searchTerm.toLowerCase()) ||
          sequenceNumber.includes(searchTerm.toLowerCase())
        );
      });
      setRemainingIssues(filteredData?.length - (noOfIssuesLoaded + 10));
      setFilteredIssuesList([...filteredData.slice(0, noOfIssuesLoaded + 10)]);
    } else {
      setFilteredIssuesList(issueList.slice(0, noOfIssuesLoaded + 10));
      setRemainingIssues(issueList?.length - (noOfIssuesLoaded + 10));
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    if (viewIssue?._id) {
      issueList.forEach((item: any) => {
        if (viewIssue._id === item._id) {
          setViewIssue(item);
        }
      });
    }
  }, [issueList]);

  const handleViewIssue = (issue: any) => {
    filteredIssuesList.forEach((item: any) => {
      if (issue._id === item._id) {
        setViewIssue(item);
      }
    });
    setOpenIssueDetail(true);
    issueMenuInstance.toolAction = "issueSelect";
    issueMenuInstance.response = { ...issue.context, id: issue._id };
    issueMenuClicked(issueMenuInstance);
  };

  useEffect(() => {}, [issueFilterState]);
  const [abc, setAbc] = useState(false);
  const checkIsFilter = () => {
    if (issueFilterState?.filterData) {
      const {
        assigneesData,
        fromDate,
        issuePriorityData,
        issueStatusData,
        issueTypeData,
        toDate,
      } = issueFilterState.filterData;
      if (
        (issuePriorityData?.length === 0 &&
          issueStatusData?.length == 0 &&
          issueTypeData?.length == 0 &&
          toDate === "" &&
          assigneesData === null) ||
        undefined
      ) {
        setAbc(true);
        setIssueFilterState({
          ...issueFilterState,
          isFilterApplied: false,
        });
      }
    }
  };
  return (
    <>
      {errorShow.length > 0 ? (
        <TaskListContainer
          // ref={docRef}
          id="download-test"
        >
          <HeaderContainer>
            <TitleContainer>
              <span>Issue List</span>

              <CloseIcon
                onClick={() => {
                  handleClose();
                }}
                src={closeWithCircle}
                alt={"close icon"}
                data-testid="close-icon"
              />
            </TitleContainer>
          </HeaderContainer>

          <MiniHeaderContainer searchingOn={searchingOn}>
            <MiniSymbolsContainer>
              {searchingOn ? (
                <SearchAreaContainer>
                  <CustomSearchField
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontFamily: "Open Sans",
                        color: "#101F4C",
                        fontWeight: "400",
                        "&::placeholder": {
                          color: "#787878",

                          fontFamily: "Open Sans",
                          fontSize: "14px",
                          lineHeight: "20px",
                          fontWeight: "400",
                        },
                      },
                    }}
                    placeholder="Search"
                    variant="outlined"
                    value={searchTerm}
                    autoFocus={true}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image src={SearchBoxIcon} alt="" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="start">
                          <CloseIcon
                            onClick={() => {
                              handleSearchWindow();
                            }}
                            isSmall={true}
                            src={CrossIcon}
                            alt={"close icon"}
                            data-testid="search-close"
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
                    data-testid="search-icon"
                    alt={"close icon"}
                    onClick={() => setSearchingOn((prev) => !prev)}
                  />
                  <DividerIcon src={DividerIconSVG} alt="" />
                  {/* {issueFilterState.isFilterApplied ? (
                    <AppliedFilter>
                      {issueFilterState.numberOfFilters} Filters{" "}
                      <FilterIcon
                        src={AppliedFilterIcon}
                        alt="Arrow"
                        onClick={() => {
                          handleViewTaskList();
                        }}
                      />
                    </AppliedFilter>
                  ) : null} */}
                  <Tooltip title="Sort Menu">
                    <IconContainer
                      src={sort}
                      alt="Arrow"
                      onClick={(e) => {
                        setIsSortMenuOpen((prev) => !prev);
                        handleSortClick(e);
                      }}
                      data-testid="sort"
                    />
                  </Tooltip>

                  {/* <DueDateHeader>Due Date</DueDateHeader> */}
                  {/* {sortOrder === "asc" ? (
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
                  <DueDate>Due Date</DueDate> */}
                  <SecondDividerIcon src={DividerIconSVG} alt="" />
                  <FunnelIcon
                    src={FilterInActive}
                    alt="Arrow"
                    onClick={() => {
                      handleViewTaskList();
                    }}
                    data-testid="filter"
                  />
                  {issueFilterState.isFilterApplied ? (
                    <FilterIndication />
                  ) : null}
                  {/* <Tooltip title="Download Menu">
                    <DownloadIcon
                      src={Download}
                      alt="Arrow"
                      onClick={(e) => {
                        setIsDownloadMenuOpen((prev) => !prev);
                        handleSortClick(e);
                      }}
                    />
                  </Tooltip> */}
                  <CSVLink
                    data={getDownladableList(filteredIssuesList)}
                    filename={"my-issues.csv"}
                    className="text-black btn btn-primary fill-black fa fa-Download "
                    target="_blank"
                    data-testid="download"
                  >
                    <DownloadIcon src={Download} alt="Arrow" />
                  </CSVLink>
                </>
              )}
            </MiniSymbolsContainer>
          </MiniHeaderContainer>

          <BodyContainer>
            <CustomBox
              searchingOn={searchingOn}
              ref={(el: any) => {
                setRef1(el);
              }}
            >
              {filteredIssuesList.length ? (
                filteredIssuesList.map((val: any, index: number) => {
                  return (
                    <div key={index}>
                      <BodyInfo
                        data-testid="item-body"
                        onClick={() => {
                          handleViewIssue(val);
                        }}
                      >
                        <FirstHeader>
                          <Image
                            src={
                              val?.status === "In Progress"
                                ? progressHour
                                : val.status === "To Do"
                                ? todoIcon
                                : val.status === "Blocked"
                                ? blockedFrame
                                : val.status === "Completed"
                                ? CompletedIconTask
                                : todoIcon
                            }
                            alt="Arrow"
                          />
                          <TicketName>
                            {" "}
                            {val?.type} (#{val?.sequenceNumber})
                          </TicketName>
                        </FirstHeader>

                        <SecondHeader>
                          <ProgressChild>{val?.status}</ProgressChild>

                          <SmallDivider src={smallDivider} alt="progress" />

                          <PriorityChild>
                            {val?.priority} Priority{" "}
                          </PriorityChild>
                        </SecondHeader>

                        <ThirdHeader>
                          <ProgressChild>
                            Due by {Moment(val.dueDate).format("DD MMM 'YY")}
                          </ProgressChild>
                          <SmallDivider src={smallDivider} alt="progress" />

                          <PriorityChild>
                            {val?.assignees[0]?.firstName
                              .charAt(0)
                              .toUpperCase()}
                            {val?.assignees[0]?.firstName.slice(1)}{" "}
                            {val?.assignees[0]?.lastName
                              .charAt(0)
                              .toUpperCase()}
                            {val?.assignees[0]?.lastName.slice(1)}
                          </PriorityChild>

                          <LightTooltip
                            arrow
                            title={
                              <AssigneeList>
                                {val?.assignees?.map(
                                  (assignName: any, index: number) => {
                                    if (index != 0) {
                                      return (
                                        <>
                                          {index !== val?.assignees?.length - 1
                                            ? assignName?.firstName +
                                              " " +
                                              assignName.lastName +
                                              " | "
                                            : assignName?.firstName +
                                              " " +
                                              assignName.lastName}
                                        </>
                                      );
                                    }
                                  }
                                )}
                              </AssigneeList>
                            }
                          >
                            <Watcher>
                              {val?.assignees.length - 1 > 0
                                ? `+${val?.assignees.length - 1}`
                                : ""}
                            </Watcher>
                          </LightTooltip>
                        </ThirdHeader>
                      </BodyInfo>
                      <HorizontalLine></HorizontalLine>
                    </div>
                  );
                })
              ) : (
                // <MessageDiv>
                //   <p>No issue matches the search</p>
                // </MessageDiv>

                <NoMatchDiv>
                  <ImageErrorIcon src={projectHierIcon} alt="Error Image" />
                  <MessageDivShowErr>No result found</MessageDivShowErr>
                </NoMatchDiv>
              )}
              {remainingIssues > 1 && filteredIssuesList.length > 1 ? (
                <LoadMoreText
                  onClick={() => {
                    handleLoadMore();
                  }}
                >
                  Load More
                </LoadMoreText>
              ) : null}
            </CustomBox>
          </BodyContainer>

          {openIssueDetail && (
            <Drawer
              anchor={"right"}
              open={openIssueDetail}
              onClose={() => setOpenIssueDetail((prev: any) => !prev)}
            >
              <CustomIssueDetailsDrawer
                issuesList={issueList}
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
                deleteTheIssue={deleteTheIssue}
                getIssues={getIssues}
                deleteTheAttachment={deleteTheAttachment}
                setIssueList={setIssueList}
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
                issuesList={issuesList}
                visibility={listOverlay}
                closeOverlay={closeIssueList}
                handleOnFilter={handleOnFilter}
                onClose={() => setOpenDrawer((prev: any) => !prev)}
                handleOnSort={() => {}}
                deleteTheIssue={() => {}}
                clickIssueEditSubmit={() => {}}
                issueFilterState={issueFilterState}
                setIssueFilterState={setIssueFilterState}
                checkIsFilter={checkIsFilter}
              />
            </Drawer>
          )}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={isSortMenuOpen}
            onClose={handleSortMenuClose}
            onClick={handleSortMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                // width: "342px",
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
            {sortMenuOptions.map((option) => (
              <>
                <StyledMenu
                  className="custom-styled-menu"
                  key={option.label}
                  onClick={() => handleSortMenuClick(option.method)}
                  data-testid="sort-menu-item"
                >
                  {option.label}
                  {option.icon && (
                    <ListItemIcon>
                      <IconContainer src={option.icon} alt={option.label} />
                    </ListItemIcon>
                  )}
                </StyledMenu>
              </>
            ))}
          </Menu>
          {isDownloadMenuOpen ? (
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={isDownloadMenuOpen}
              onClose={handleDownloadClose}
              onClick={handleDownloadClose}
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
              {downloadMenuOptions.map((option) => (
                <>
                  <StyledMenu
                    key={option.label}
                    // onClick={() => handleDownloadMenuClick()}
                    data-testid="download-menu-item"
                  >
                    {option.label === "Download as CSV" ? (
                      <CSVLink
                        data={getDownladableList(downloadList)}
                        filename={"issues.csv"}
                        className="text-black btn btn-primary fill-black fa fa-Download "
                        target="_blank"
                        data-testid="download"
                        onClick={() => handleDownloadMenuClick()}
                      >
                        <MenuOptionLabel>{option.label}</MenuOptionLabel>
                      </CSVLink>
                    ) : (
                      <DownloadTable
                        data={getDownladableList(downloadList)}
                        label={option.label}
                        filename="issues.pdf"
                        onClick={() => handleDownloadMenuClick()}
                      />
                    )}

                    {/* {option.icon && (
                    <ListItemIcon>
                      <IconContainer src={option.icon} alt={option.label} />
                    </ListItemIcon>
                  )} */}
                  </StyledMenu>
                </>
              ))}
            </Menu>
          ) : (
            <></>
          )}
        </TaskListContainer>
      ) : (
        <TaskListContainer>
          <ErrorImageDiv>
            <ImageErrorIcon src={listingErrorIcon} alt="Error Image" />
            <MessageDivShowErr>
              No Issue has been raised yet. Get a headstart by raising one.
            </MessageDivShowErr>
            <RaiseButtonDiv
              onClick={() => {
                onClose();
                openIssueCreateFn();
                toast.success(
                  "Click on the map where you want to create an issue"
                );
              }}
            >
              Raise Issue
            </RaiseButtonDiv>

            <ContentError>
              Check out
              <ContentErrorSpan> How to raise an Issue?</ContentErrorSpan>
            </ContentError>
          </ErrorImageDiv>
        </TaskListContainer>
      )}
    </>
  );
};

export default CustomIssueListDrawer;

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    // color: "rgba(0, 0, 0, 0.87)",
    fontSize: 11,
    // position: "absolute",
    right: 30,
    borderRadius: "4px",
    top: 2,
    // width: "308px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    height: "10px !important",
    left: "30px !important",
    marginBottom: "0px",
    "&:before": {
      background: "#FFFFFF",
      border: "1px solid #D9D9D9",
    },

    //  color: 'red',
  },
}));
