import {
  Box,
  Drawer,
  InputAdornment,
  ListItemIcon,
  Menu,
  Tooltip,
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

import {
  AppliedFilter,
  ArrowDownIcon,
  ArrowUpIcon,
  BodyContainer,
  BodyContTitle,
  BodyInfo,
  CloseIcon,
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
} from "./IssueListStyles";

import _ from "lodash";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Issue } from "../../../models/Issue";
import { ITools } from "../../../models/ITools";
import FilterCommon from "../issue-filter-common/IssueFilterCommon";
import {
  CustomSearchField,
  IconContainer,
  SearchAreaContainer,
} from "../task_list/TaskListStyles";
import CustomIssueDetailsDrawer from "../issue_detail/IssueDetail";
import { getProjectUsers } from "../../../services/project";
import router from "next/router";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";

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
  getIssues?: any;
  handleOnIssueSort?: any;
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
  getIssues,
  handleOnIssueSort,
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
  const [projectUsers, setProjectUsers] = useState([]);
  const [issueStatus, setIssueStatus] = useState<[string]>();
  const [dateSortState, setDateSortState] = useState("ascending");
  const [viewIssue, setViewIssue] = useState<any>({});
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [issueList, setIssueList] = useState<any>(issuesList);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const handleSortMenuClick = (sortMethod: string) =>
    handleOnIssueSort(sortMethod);

  const [filteredIssuesList, setFilteredIssuesList] = useState<any>(issueList);
  const [errorShow, setErrorShow] = useState<any>(issueList);

  useEffect(() => {
    setIssueList(issuesList);
  }, [issuesList]);

  useEffect(() => {
    setFilteredIssuesList(issueList);
  }, [issueList]);

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
      sorted = filteredIssuesList.sort((a: any, b: any) => {
        return new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf();
      });
      setSortOrder("desc");
    } else {
      sorted = filteredIssuesList.sort((a: any, b: any) => {
        return new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf();
      });
      setSortOrder("asc");
    }
    setFilteredIssuesList(sorted);
  };

  useEffect(() => {
    if (router.isReady) {
      getProjectUsers(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setProjectUsers(response.result);
            console.log(projectUsers);
          }
        })
        .catch();
    }
  }, [router.isReady, router.query.projectId]);

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
        return taskName.includes(searchTerm.toLowerCase());
      });
      setFilteredIssuesList([...filteredData]);
    } else {
      setFilteredIssuesList(issueList);
    }
  };

  const getDownladableIssueList = (issL = issuesList) => {
    console.log("issL", issL);
    let myL = issL.map((iss) => {
      let a = iss.assignees.map((a) => {
        return a.firstName;
      });
      let x = _.omit(iss, "progress", "context");
      let y = _.update(x, "assignees", (ass) => {
        let n = ass.map((o: { firstName: any }) => {
          return o.firstName;
        });
        return n;
      });
      return y;
    });
    return myL;
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    if (viewIssue?._id) {
      filteredIssuesList.forEach((item: any) => {
        if (viewIssue._id === item._id) {
          setViewIssue(item);
        }
      });
    }
  }, [filteredIssuesList]);

  const handleViewIssue = (issue: any) => {
    filteredIssuesList.forEach((item: any) => {
      if (issue._id === item._id) {
        setViewIssue(item);
      }
    });
    setOpenIssueDetail(true);
  };
  return (
    <>
      {errorShow.length > 0 ? (
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
                data-testid="const-custom-drawer-close-icon"
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
                          <Image src={SearchBoxIcon} alt="" />
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
                  <DividerIcon src={DividerIconSVG} alt="" />
                  {issueFilterState.isFilterApplied ? (
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
                  ) : null}
                  <Tooltip title="Sort Menu">
                    <IconContainer
                      src={sort}
                      alt="Arrow"
                      onClick={(e) => {
                        setIsSortMenuOpen((prev) => !prev);
                        handleSortClick(e);
                      }}
                    />
                  </Tooltip>
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
                  />

                  <CSVLink
                    data={getDownladableIssueList(filteredIssuesList)}
                    filename={"my-issues.csv"}
                    className="text-black btn btn-primary fill-black fa fa-Download "
                    target="_blank"
                  >
                    {/* <FontAwesomeIcon
                  className=" fill-black text-black"
                  icon={faDownload}
                ></FontAwesomeIcon> */}
                    <DownloadIcon src={Download} alt="Arrow" />
                  </CSVLink>
                </>
              )}
            </MiniSymbolsContainer>
          </MiniHeaderContainer>

          <BodyContainer>
            <CustomBox searchingOn={searchingOn}>
              {filteredIssuesList.length ? (
                filteredIssuesList.map((val: any, index: number) => {
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
                  key={option.label}
                  onClick={() => handleSortMenuClick(option.method)}
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
        </TaskListContainer>
      ) : (
        <TaskListContainer>
          <ErrorImageDiv>
            <ImageErrorIcon src={listingErrorIcon} alt="Error Image" />
            <MessageDivShowErr>
              No Issue has been raised yet. Get a headstart by raising one.
            </MessageDivShowErr>
            <RaiseButtonDiv>Raise Issue</RaiseButtonDiv>

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
