import {
  Box,
  Drawer,
  InputAdornment,
  ListItemIcon,
  Menu,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import Moment from "moment";

import {
  HotspotListContainer,
  HeaderContainer,
  TitleContainer,
  CloseIcon,
  MiniHeaderContainer,
  MiniSymbolsContainer,
  SearchGlassIcon,
  DividerIcon,
  FilterIcon,
  ArrowUpIcon,
  DueDate,
  SecondDividerIcon,
  DownloadIcon,
  BodyContainer,
  BodyInfo,
  FirstHeader,
  BodyContTitle,
  SecondHeader,
  ThirdHeader,
  DueDateDiv,
  HorizontalLine,
  NoMatchDiv,
  ImageErrorIcon,
  MessageDivShowErr,
  ArrowDownIcon,
  FunnelIcon,
  SearchAreaContainer,
  CustomSearchField,
  AppliedFilter,
  IconContainer,
  StyledMenu,
  CustomBox,
} from "./HotspotListStyles";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import Divider from "../../../public/divami_icons/divider.svg";
import Search from "../../../public/divami_icons/search.svg";
import AppliedFilterIcon from "../../../public/divami_icons/appliedFilter.svg";
import filterFunnelIcon from "../../../public/divami_icons/filterFunnelIcon.svg";
import UpArrow from "../../../public/divami_icons/upArrow.svg";
import Download from "../../../public/divami_icons/download.svg";
import HourglassIcon from "../../../public/divami_icons/hourGlassIcon.svg";

import RFIList from "../../../public/divami_icons/rfiList.svg";
import SubmittalList from "../../../public/divami_icons/submittalList.svg";
import TransmittalList from "../../../public/divami_icons/transmittalList.svg";
import listingErrorIcon from "../../../public/divami_icons/listingErrorIcon.svg";
import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";
import stagProgressIcon from "../../../public/divami_icons/stagProgressIcon.svg";
import highProgressIcon from "../../../public/divami_icons/highProgressIcon.svg";
import downArrow from "../../../public/divami_icons/downArrow.svg";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import FilterInActive from "../../../public/divami_icons/filterInactive.svg";
import sort from "../../../public/divami_icons/sort.svg";
import DownArrow from "../../../public/divami_icons/downArrow.svg";

import { useEffect, useState } from "react";
import hotspotObj from "./config";
import HotspotFilterCommon from "../hotspot-filter-common/HotspotFilterCommon";
import CustomHotspotDetailsDrawer from "../hotspot_detail/HotspotDetail";
import { setTheFormatedDate } from "../../../utils/ViewerDataUtils";

interface IProps {
  onClose: any;
}

const CustomHotspotListDrawer: React.FC<IProps> = ({ onClose }) => {
  const handleClose = () => {
    onClose(true);
  };

  const [filteredHotspotList, setFilteredHotspotList] =
    useState<any>(hotspotObj);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchingOn, setSearchingOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openHotspotDetail, setOpenHotspotDetail] = useState(false);
  const [viewHotspot, setViewHotspot] = useState<any>({});

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const sortDateOrdering = () => {
    let sorted;
    if (sortOrder === "asc") {
      sorted = filteredHotspotList.sort((a: any, b: any) => {
        return new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf();
      });
      setSortOrder("desc");
    } else {
      sorted = filteredHotspotList.sort((a: any, b: any) => {
        return new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf();
      });
      setSortOrder("asc");
    }
    setFilteredHotspotList(sorted);
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
      const filteredData: any = hotspotObj?.filter((eachIssue: any) => {
        const taskName = eachIssue?.type?.toLowerCase();
        return taskName.includes(searchTerm.toLowerCase());
      });
      setFilteredHotspotList([...filteredData]);
    } else {
      setFilteredHotspotList(hotspotObj);
    }
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setIsSortMenuOpen(false);
    setAnchorEl(null);
  };
  const handleViewTaskList = () => {
    setOpenDrawer(true);
  };

  const handleViewIssue = (issue: any) => {
    filteredHotspotList.forEach((item: any) => {
      if (issue._id === item._id) {
        setViewHotspot(item);
      }
    });
    setOpenHotspotDetail(true);
  };

  const handleSortMenuClick = (sortMethod: string) => {
    // handleOnIssueSort(sortMethod);
  };

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

  return (
    <HotspotListContainer>
      <HeaderContainer>
        <TitleContainer>
          <span>Hotspot List</span>

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
              <DividerIcon src={Divider} alt="" />
              {filteredHotspotList.isFilterApplied ? (
                <AppliedFilter>
                  {filteredHotspotList.numberOfFilters} Filters{" "}
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

              <SecondDividerIcon src={Divider} alt="" />

              <FunnelIcon
                src={FilterInActive}
                alt="Arrow"
                onClick={() => {
                  handleViewTaskList();
                }}
              />

              {/* <FontAwesomeIcon
                  className=" fill-black text-black"
                  icon={faDownload}
                ></FontAwesomeIcon> */}
              <DownloadIcon src={Download} alt="Arrow" />
            </>
          )}

          {/* <FilterIcon src={filterFunnelIcon} alt="Arrow" /> */}
          {/* <DownloadIcon src={Download} alt="Arrow" /> */}
        </MiniSymbolsContainer>
      </MiniHeaderContainer>

      <BodyContainer>
        <CustomBox searchingOn={searchingOn}>
          {filteredHotspotList.length ? (
            filteredHotspotList.map((val: any, index: number) => {
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
                          val.progress_rate > 0
                            ? highProgressIcon
                            : stagProgressIcon
                        }
                        alt="Arrow"
                      />
                      <BodyContTitle>
                        {val.current_progress}% Current Progress
                      </BodyContTitle>
                    </FirstHeader>

                    {/* <SecondHeader>
                      <div>{val.priority} Priority</div>
                    </SecondHeader> */}

                    <ThirdHeader>
                      <div>Progress Rate: {val.progress_rate}%</div>
                      <DueDateDiv>
                        Took on {setTheFormatedDate(val.dueDate)}
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
      {openHotspotDetail && (
        <Drawer
          anchor={"right"}
          open={openHotspotDetail}
          onClose={() => setOpenHotspotDetail((prev: any) => !prev)}
        >
          <CustomHotspotDetailsDrawer
            onClose={() => setOpenHotspotDetail((prev: any) => !prev)}
          />
        </Drawer>
      )}
      {openDrawer && (
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => setOpenDrawer((prev: any) => !prev)}
        >
          <HotspotFilterCommon
            onClose={() => setOpenDrawer((prev: any) => !prev)}
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
    </HotspotListContainer>
  );
};

export default CustomHotspotListDrawer;
