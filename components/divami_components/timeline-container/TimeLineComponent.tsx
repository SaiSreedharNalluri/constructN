import { useEffect, useRef, useState } from "react";
import Moment from "moment";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { KeyboardArrowDown } from "@mui/icons-material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { ISnapshot } from "../../../models/ISnapshot";
import CustomCalender from "../custom-datepicker/CustomCalender";
import {
  CircleIcon,
  DateText,
  LeftIconImage,
  PaginationStyle,
  RightIconImage,
  SelectedTimeLine,
  TimelineDots,
  TimelineNavigation,
  TimeLinePagination,
  TimeLineStyleContainer,
} from "./TimeLineComponentStyles";
import dayjs from "dayjs";
import moment from "moment";
import Image from "next/image";
import LeftIcon from "../../../public/divami_icons/leftIcon.svg";
import RightIcon from "../../../public/divami_icons/rightIcon.svg";
import { Tooltip } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import downArrowIcon from "../../../public/divami_icons/downArrowIcon.svg";
import LeftSingleArrow from "../../../public/divami_icons/LeftSingleArrow.png";
import RightSingleArrow from "../../../public/divami_icons/RightSingleArrow.png";
import { getSnapshotDetails } from "../../../services/snapshot";

interface IProps {
  currentSnapshot: ISnapshot;
  snapshotList: ISnapshot[];
  snapshotListCal?:ISnapshot[];
  snapshotHandler: (snapshotData: ISnapshot) => void;
  isFullScreen?: boolean;
  getSnapshotList: any;
  totalSnaphotsCount: any;
  structure: any;
  setPrevList: any;
  setNewList?:any
  setNextList: any;
  totalPages: any;
  offset: any;
  tools?: any;
}

const TimeLineComponent: React.FC<IProps> = ({
  currentSnapshot,
  snapshotList,
  snapshotListCal,
  snapshotHandler,
  isFullScreen = false,
  getSnapshotList,
  totalSnaphotsCount = 0,
  structure,
  setPrevList,
  setNewList,
  setNextList,
  totalPages,
  offset,
  tools,
}) => {
  const [bottomNav, setBottomNav] = useState(false);
  const [page, setPage] = useState<any>();
  // const [offset, setOffset] = useState(1);

  const [oldDate, setOldDate] = useState("");
  const [newDate, setNewDate] = useState("");
  const [activeCircleIndex, setActiveCircleIndex] = useState<any>();
  // const [totalPages, setTotalPages] = useState(
  //   Math.ceil(totalSnaphotsCount / 10)
  // );
  // const pageSize = 10;
  // useEffect(() => {
  //   setTotalPages(Math.ceil(totalSnaphotsCount / 10));
  // }, [totalSnaphotsCount]);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDateChange = async(event: any) => {
    const dateFormatted = moment(new Date(event))
      .format("YYYY-MM-DD")
      .toString();
    const value = snapshotList.findIndex(
      (item) =>
        moment(item?.date).format("YYYY-MM-DD").toString() === dateFormatted
    );
    if (value > -1) {
      setPage(value);
    }
    else if(snapshotListCal)
    {
      console.log(snapshotListCal,"Array Order")
    
      const value = snapshotListCal.findIndex(
        (item) =>
          moment(item?.date).format("YYYY-MM-DD").toString() === dateFormatted
      );
      console.log(snapshotListCal,"Array Order", value, snapshotListCal[value]._id);
      
      if (value>1)
      setNewList(Math.ceil((value-1) / 10),snapshotListCal[value]._id)
      else
      setNewList(0,snapshotListCal[0]._id)
      
      

    //  const snp = await (await getSnapshotDetails(structure.project,structure._id,snapshotListCal[value]._id!))?.data?.result
    //   setCurrentSnapshot(snp);
    }
  };

  const toggleTimeline = () => {
    setBottomNav(!bottomNav);
  };

  const setCurrentSnapshot = (snapshot: ISnapshot) => {
    snapshotHandler(snapshot);
  };

  const setPrevPage = () => {
    if (page >= 1) {
      setPage(page - 1);
    }
  };
  const setNextPage = () => {
    if (page < snapshotList.length - 1) {
      setPage(page + 1);
    }
  };
  // const getSnapshotDate = () => {
  //   if (currentSnapshot) {
  //     return Moment(currentSnapshot.date).format("Do MMM YYYY");
  //   } else {
  //     return "No Reality";
  //   }
  // };
  useEffect(() => {
    if (page || page == 0) {
      setCurrentSnapshot(snapshotList[page]);
      // if (page >= 6) {
      //   setActiveCircleIndex(6);
      // } else {
      //   setActiveCircleIndex(page);
      // }
      setActiveCircleIndex(page);
    }
  }, [page]);

  useEffect(() => {
    if (snapshotList.length > 0) {
      setOldDate(snapshotList[0].date);
      setNewDate(snapshotList[snapshotList.length - 1].date);
      const snapshotIndex = snapshotList.findIndex(
        (item) => item.date === currentSnapshot.date
      );
      setPage(snapshotIndex);
      // setPage(snapshotList.length - 1);
    }
  }, [snapshotList]);

  const disableWeekends = (date: any) => {
    const timelineDates: any[] = [];
    if (snapshotListCal?.length) {
      snapshotListCal.forEach((element, i) => {
        timelineDates.push(dayjs(element.date).format("YYYY-MM-DD"));
      });
    }
    return timelineDates.indexOf(dayjs(date).format("YYYY-MM-DD")) < 0;
  };

  // const calenderStyles = {
  //   sx: {
  //     "& .css-bkrceb-MuiButtonBase-root-MuiPickersDay-root:not(.Mui-disabled,.Mui-selected)":
  //       {
  //         backgroundColor: "#FFF5EF",
  //         paddingRight: "5px",
  //         color: "#101F4C",
  //         fontSize: "14px",
  //         fontWeight: 400,
  //         fontFamily: "Open Sans",

  //         "&:after": {
  //           content: '""',
  //           display: "block",
  //           width: "4px",
  //           height: "4px",
  //           background: "#FF843F",
  //           border: "1px solid red",
  //           borderRadius: "50%",
  //           marginTop: "22px",
  //           marginLeft: "-7px",
  //         },
  //       },
  //     "& .css-bkrceb-MuiButtonBase-root-MuiPickersDay-root.Mui-selected:hover":
  //       {
  //         backgroundColor: "#FF843F",
  //         color: "#FFFFFF",
  //       },
  //     " .css-7jfl2q-MuiPopper-root-MuiPickersPopper-root .css-bkrceb-MuiButtonBase-root-MuiPickersDay-root.Mui-selected":
  //       {
  //         backgroundColor: "#FF843F",
  //         color: "#FFFFFF",
  //       },
  //     "& .css-bkrceb-MuiButtonBase-root-MuiPickersDay-root.Mui-selected": {
  //       backgroundColor: "#FF843F",
  //       color: "#FFFFFF",
  //       fontSize: "14px",
  //       fontWeight: 400,
  //       fontFamily: "Open Sans",
  //     },
  //     "& .css-195y93z-MuiButtonBase-root-MuiPickersDay-root:not(.Mui-selected) ":
  //       {
  //         border: "1px solid #FF843F",
  //         borderRadius: "50%",
  //         fontSize: "14px",
  //         fontWeight: 400,
  //         fontFamily: "Open Sans",
  //       },
  //     "& .css-bkrceb-MuiButtonBase-root-MuiPickersDay-root.Mui-disabled": {
  //       fontSize: "14px",
  //       fontWeight: 400,
  //       color: "#888888",
  //       fontFamily: "Open Sans",
  //     },
  //     "& .css-raiqh1-MuiTypography-root-MuiDayPicker-weekDayLabel": {
  //       color: "#888888",
  //       fontSize: "14px",
  //       fontWeight: 400,
  //       fontFamily: "Open Sans",
  //     },
  //     "& .css-dplwbx-MuiPickersCalendarHeader-label": {
  //       color: "#36415D",
  //       fontWeight: 500,
  //       fontFamily: "Open Sans",
  //       fontSize: "14px",
  //     },
  //     "& .css-1ae9t7h-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button":
  //       {
  //         border: "1px solid #9D9D9D",
  //         borderRadius: "4px",
  //         width: "24px",
  //         height: "24px",
  //         marginTop: "3px",
  //       },
  //     "& .css-jro82b-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button":
  //       {
  //         border: "1px solid #9D9D9D",
  //         borderRadius: "4px",
  //         width: "24px",
  //         height: "24px",
  //         marginTop: "3px",
  //       },
  //     "& .css-nk89i7-MuiPickersCalendarHeader-root ": {
  //       borderBottom: "1px solid #9D9D9D",
  //       paddingBottom: "15px",
  //     },
  //   },
  // };
  // console.log(snapshotList, "snaphsot listt");
  return (
    <>
      {tools?.toolName !== "compareDesign" ? (
        <TimeLineStyleContainer   
        onMouseLeave={()=>{setBottomNav(false)}}
        onMouseEnter={()=>{setBottomNav(true)}}  
        isFullScreen={isFullScreen}>
          <SelectedTimeLine
            style={{ bottom: bottomNav ? "36px" : "0px" }}
            onClick={toggleTimeline}
            data-testid={"selected-timeline"}
          >
            {Moment(currentSnapshot?.date).format("DD MMM YYYY")}
          </SelectedTimeLine>
          {bottomNav ? (
            <TimelineNavigation>
              {offset !== totalPages ? (
                <LeftIconImage
                  src={LeftIcon}
                  alt=""
                  onClick={() => {
                    setPrevList();
                  }}
                />
              ) : (
                <></>
              )}
              <LeftIconImage
                src={RightSingleArrow}
                alt=""
                onClick={() => {
                  setPrevPage();
                }}
              />
              <DateText>
                <p
                  onClick={() => {
                    setPage(0);
                  }}
                >
                  {oldDate && Moment(oldDate).format("DD MMM YY")}
                </p>
              </DateText>

              <TimelineDots>
                {snapshotList.map((item: any, index: number) => {
                  return (
                    <Tooltip
                      title={Moment(item.date).format("DD MMM YYYY")}
                      key={Moment(item.date).format("DD MMM YYYY")}
                    >
                      <CircleIcon
                        key={index}
                        active={index === activeCircleIndex}
                        onClick={(e: any) => handleChange(e, index)}
                      >
                        3
                      </CircleIcon>
                    </Tooltip>
                  );
                })}
              </TimelineDots>

              <DateText>
                <p
                  onClick={() => {
                    setPage(snapshotList.length - 1);
                  }}
                >
                  {newDate && Moment(newDate).format("DD MMM YY")}{" "}
                </p>
              </DateText>
              <RightIconImage
                src={LeftSingleArrow}
                alt=""
                onClick={() => {
                  setNextPage();
                }}
              />
              {offset > 1 ? (
                <Image
                  src={RightIcon}
                  alt=""
                  onClick={() => {
                    setNextList();
                  }}
                />
              ) : (
                <></>
              )}
              <CustomCalender
                onChange={handleDateChange}
                data-testid="calender"
                shouldDisableDate={disableWeekends}
                hideTextField
                data={{
                  disableAll: true,
                  defaultValue: currentSnapshot?.date,
                  // defaultValue: page === 2 ? newDate : oldDate,
                  disableDays: disableWeekends,
                }}
              />
            </TimelineNavigation>
          ) : (
            <></>
          )}
        </TimeLineStyleContainer>
      ) : (
        <></>
      )}
      {/* {snapshotList && snapshotList.length > 0 && (
        <TimeLineStyleContainer isFullScreen={isFullScreen}>
          <SelectedTimeLine
            style={{ bottom: bottomNav ? "" : 0 }}
            onClick={toggleTimeline}
            data-testid={"selected-timeline"}
          >
            {Moment(currentSnapshot?.date).format("DD MMM YYYY")}
          </SelectedTimeLine>

          {bottomNav ? (
            <div
              data-testid="bottomNav"
            >
              <div
              >
              </div>
              {snapshotList && currentSnapshot && (
                <TimeLinePagination>
                  <div className=" flex text-sm">
                    <p>{oldDate && Moment(oldDate).format("DD MMM YY")}</p>
                  </div>
                  <PaginationStyle
                    count={snapshotList?.length}
                    page={page}
                    onChange={handleChange}
                    data-testid={"page"}
                    renderItem={(item: any) => (
                      <PaginationItem
                        slots={{
                          previous: KeyboardDoubleArrowLeftIcon,
                          next: KeyboardDoubleArrowRightIcon,
                        }}
                        {...item}
                      />
                    )}
                  />
                  <div className="flex text-sm items-center ml-1 ">
                    <p>{newDate && Moment(newDate).format("DD MMM YY")} </p>
                  </div>
                  {!isNaN(page) ? (
                    <CustomCalender
                      onChange={handleDateChange}
                      data-testid="calender"
                      shouldDisableDate={disableWeekends}
                      hideTextField
                      data={{
                        disableAll: true,
                        defaultValue: currentSnapshot?.date,
                        disableDays: disableWeekends,
                        styles: calenderStyles,
                      }}
                    />
                  ) : null}
                </TimeLinePagination>
              )}
            </div>
          ) : null}
        </TimeLineStyleContainer>
      )} */}
    </>
  );
};

export default TimeLineComponent;
