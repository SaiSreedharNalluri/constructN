import { Box, Drawer, InputAdornment } from "@mui/material";
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

import { useEffect, useState } from "react";
import hotspotObj from "./config";

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
                      //   handleViewTaskList();
                    }}
                  />
                </AppliedFilter>
              ) : null}
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

              <SecondDividerIcon src={Divider} alt="" />

              <FunnelIcon
                src={FilterInActive}
                alt="Arrow"
                onClick={() => {
                  //   handleViewTaskList();
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
        {searchingOn ? (
          <Box sx={{ marginTop: "10px" }}>
            {/* {console.log("filteredHotspotList", filteredHotspotList)} */}
            {filteredHotspotList.length ? (
              filteredHotspotList.map((val: any, index: number) => {
                return (
                  <div key={index}>
                    <BodyInfo
                    // onClick={() => {
                    //   handleViewIssue(val);
                    // }}
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
                          Took on {Moment(val.dueDate).format("DD MMM 'YY")}
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
          </Box>
        ) : (
          <Box>
            {/* {console.log("filteredHotspotList", filteredHotspotList)} */}
            {filteredHotspotList.length ? (
              filteredHotspotList.map((val: any, index: number) => {
                return (
                  <div key={index}>
                    <BodyInfo
                    // onClick={() => {
                    //   handleViewIssue(val);
                    // }}
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
                          Took on {Moment(val.dueDate).format("DD MMM 'YY")}
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
          </Box>
        )}
      </BodyContainer>
    </HotspotListContainer>
  );
};

export default CustomHotspotListDrawer;
