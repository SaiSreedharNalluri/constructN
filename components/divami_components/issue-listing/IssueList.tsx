import {
  Drawer,
  InputAdornment,
  ListItemIcon,
  Menu,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import Moment from "moment";
import Image from "next/image";
import { IProjectUsers } from "../../../models/IProjects";
import closeWithCircle from "../../../public/divami_icons/closeWithCircle.svg";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import DividerIconSVG from "../../../public/divami_icons/divider.svg";
import DownArrow from "../../../public/divami_icons/downArrow.svg";
import Download from "../../../public/divami_icons/download.svg";
import FilterInActive from "../../../public/divami_icons/filterInactive.svg";
import listingErrorIcon from "../../../public/divami_icons/listingErrorIcon.svg";
import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";
import Search from "../../../public/divami_icons/search.svg";
import smallDivider from "../../../public/divami_icons/smallDivider.svg";
import sort from "../../../public/divami_icons/sort.svg";
import UpArrow from "../../../public/divami_icons/upArrow.svg";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";
import {
  BodyContainer,
  BodyInfo,
  ContentError,
  ContentErrorSpan,
  CustomBox,
  DividerIcon,
  DownloadIcon,
  ErrorImageDiv,
  FilterIndication,
  FirstHeader,
  FunnelIcon,
  HeaderContainer,
  HorizontalLine,
  ImageErrorIcon,
  LoadMoreText,
  MenuOptionLabel,
  MessageDivShowErr,
  MiniHeaderContainer,
  MiniSymbolsContainer,
  NoMatchDiv,
  RaiseButtonDiv,
  SearchAreaContainer,
  SearchGlassIcon,
  SecondDividerIcon,
  SecondHeader,
  StyledMenu,
  TaskListContainer,
  ThirdHeader,
  TicketName,
  TitleContainer,
  Watcher,
  ProgressChild,
  SmallDivider,
  PriorityChild,
  AssigneeList,
  TopButton,
} from "./IssueListStyles";

import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import { Issue } from "../../../models/Issue";
import { ITools } from "../../../models/ITools";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import { getProjectUsers } from "../../../services/project";
import FilterCommon from "../issue-filter-common/IssueFilterCommon";
import CustomIssueDetailsDrawer from "../issue_detail/IssueDetail";
import {
  CloseIcon,
  CustomSearchField,
  IconContainer,
} from "../task_list/TaskListStyles";
import { DownloadTable } from "../toolbar/DownloadTable";
import { downloadMenuOptions, getDownladableList } from "./Constants";

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

export interface IFilterProps {
  taskType: string[];
  taskPriority: string[];
  projectUsers: IProjectUsers[];
  taskStatus: string[];
  tagStatus: string[];
  loading: boolean;
}

export interface ISortProps {
  sortStatus: string[];
  sortPriority: string[];
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
    setIssueList([
      ...issuesList.sort((a: any, b: any) => {
        return (
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
        );
      }),
    ]);
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
  const [filterRsp, setFilterRsp] = useState<IFilterProps>({
    taskType: [],
    taskPriority: [],
    projectUsers: [],
    taskStatus: [],
    tagStatus: [],
    loading: true,
  });

  const [sortRsp, setSortRsp] = useState<ISortProps>({
    sortPriority: [],
    sortStatus: [],
  });
  const sortMenuOptions = [
    {
      label: "Status  (A - Z)",
      icon: null,
      method: "status_asc",
    },
    {
      label: "Status   (Z - A)",
      icon: null,
      method: "status_desc",
    },

    {
      label: "Priority (A - Z)",
      icon: null,
      method: "Asc Priority",
    },
    {
      label: "Priority (Z - A)",
      icon: null,
      method: "Dsc Priority",
    },
    {
      label: "Due Date",
      icon: UpArrow,
      method: "Dsc DueDate",
    },
    {
      label: "Due Date",
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

  const handleSortMenuClick = (sortMethod: string) => {
    handleOnIssueSort(sortMethod);
  };

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
    issueMenuInstance.toolAction = "issueViewClose";
  };

  const handleViewTaskList = () => {
    setOpenDrawer(true);
  };

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
        issueTagData,
        toDate,
      } = issueFilterState.filterData;
      if (
        (issuePriorityData?.length === 0 &&
          issueStatusData?.length == 0 &&
          issueTypeData?.length == 0 &&
          issueTagData?.length == 0 &&
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
  const issueContRef = useRef<any>(null);
  const scrollTop = () => {
    if (issueContRef.current) {
      issueContRef.current.scrollTop = 0;
    }
  };

  return (
    <>
      {errorShow.length > 0 ? (
        <TaskListContainer id="download-test">
          <HeaderContainer>
            <TitleContainer>
              <span>Issue List</span>
              <div className="rounded-full p-1 hover:bg-[#E7E7E7]">
                <CloseIcon
                  onClick={() => {
                    handleClose();
                  }}
                  src={closeWithCircle}
                  alt={"close icon"}
                  data-testid="close-icon"
                />
              </div>
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
                    onChange={(e: any) => {
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

                  <SecondDividerIcon src={DividerIconSVG} alt="" />
                  <FunnelIcon
                    src={FilterInActive}
                    alt="Arrow"
                    onClick={() => {
                      handleViewTaskList();
                    }}
                    data-testid="filter"
                  />
                  {issueFilterState.isFilterApplied &&
                  issueFilterState.numberOfFilters > 0 ? (
                    <FilterIndication />
                  ) : null}

                  <CSVLink
                    data={getDownladableList(issueList)}
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

          <BodyContainer ref={issueContRef}>
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
                <NoMatchDiv>
                  <ImageErrorIcon src={projectHierIcon} alt="Error Image" />
                  <MessageDivShowErr>No result found</MessageDivShowErr>
                </NoMatchDiv>
              )}
              <div className="flex justify-between px-1">
                {remainingIssues > 1 && filteredIssuesList.length > 1 ? (
                  <LoadMoreText
                    onClick={() => {
                      handleLoadMore();
                    }}
                  >
                    Load More
                  </LoadMoreText>
                ) : null}
                <div></div>
                {filteredIssuesList.length >= 10 && (
                  <TopButton onClick={scrollTop}>Top</TopButton>
                )}
              </div>
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
                onClose={() => {
                  setOpenIssueDetail((prev: any) => !prev);
                }}
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
                filterRsp={filterRsp}
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
                     <HeaderContainer>
            <TitleContainer>
              <span></span>
              <div className="rounded-full p-1 hover:bg-[#E7E7E7]">
              <CloseIcon
                onClick={() => {
                  handleClose();
                }}
                src={closeWithCircle}
                alt={"close icon"}
                data-testid="close-icon"
              />
              </div>
            </TitleContainer>
          </HeaderContainer>
          <ErrorImageDiv>
            <ImageErrorIcon src={listingErrorIcon} alt="Error Image" />
            <MessageDivShowErr>
              No Issue has been raised yet. Get a headstart by raising one.
            </MessageDivShowErr>
            <RaiseButtonDiv
              onClick={() => {
                onClose();
                openIssueCreateFn();
                CustomToast(
                  "Click on the map where you want to 'Create Issue'"
                ,"success");
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
    fontSize: 11,
    right: 30,
    borderRadius: "4px",
    top: 2,
  },
  [`& .${tooltipClasses.arrow}`]: {
    height: "10px !important",
    left: "30px !important",
    marginBottom: "0px",
    "&:before": {
      background: "#FFFFFF",
      border: "1px solid #D9D9D9",
    },
  },
}));
