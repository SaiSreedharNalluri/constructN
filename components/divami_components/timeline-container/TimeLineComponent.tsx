import { useEffect, useState } from "react";
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

interface IProps {
  currentSnapshot: ISnapshot;
  snapshotList: ISnapshot[];
  snapshotHandler: (snapshotData: ISnapshot) => void;
  isFullScreen?: boolean;
}

const TimeLineComponent: React.FC<IProps> = ({
  currentSnapshot,
  snapshotList,
  snapshotHandler,
  isFullScreen = false,
}) => {
  const [bottomNav, setBottomNav] = useState(false);
  const [page, setPage] = useState(0);
  const [oldDate, setOldDate] = useState("");
  const [newDate, setNewDate] = useState("");
  const [activeCircleIndex, setActiveCircleIndex] = useState(0);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDateChange = (event: any) => {
    const dateFormatted = moment(new Date(event))
      .format("YYYY-MM-DD")
      .toString();
    const value = snapshotList.findIndex(
      (item) =>
        moment(item?.date).format("YYYY-MM-DD").toString() == dateFormatted
    );
    if (value > -1) {
      setPage(value);
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
    setCurrentSnapshot(snapshotList[page]);
    if (page >= 6) {
      setActiveCircleIndex(6);
    } else {
      setActiveCircleIndex(page);
    }
  }, [page]);

  useEffect(() => {
    if (snapshotList.length > 0) {
      setOldDate(snapshotList[0].date);
      setNewDate(snapshotList[snapshotList.length - 1].date);
      setPage(snapshotList.length - 1);
    }
  }, [snapshotList]);

  const disableWeekends = (date: any) => {
    const timelineDates: any[] = [];
    if (snapshotList.length) {
      snapshotList.forEach((element, i) => {
        timelineDates.push(dayjs(element.date).format("YYYY-MM-DD"));
      });
    }
    return timelineDates.indexOf(dayjs(date).format("YYYY-MM-DD")) < 0;
  };

  const calenderStyles = {
    sx: {
      "& .css-bkrceb-MuiButtonBase-root-MuiPickersDay-root:not(.Mui-disabled,.Mui-selected)":
        {
          backgroundColor: "rgba(0, 0, 0, 0.20)",
        },
    },
  };

  // console.log(snapshotList, "snaphsot listt");
  return (
    <>
      <TimeLineStyleContainer isFullScreen={isFullScreen}>
        <SelectedTimeLine
          style={{ bottom: bottomNav ? (isFullScreen ? 0 : "0") : "unset" }}
          onClick={toggleTimeline}
          data-testid={"selected-timeline"}
        >
          {Moment(currentSnapshot?.date).format("DD MMM YYYY")}
        </SelectedTimeLine>
        {bottomNav ? (
          <TimelineNavigation>
            <LeftIconImage
              src={LeftIcon}
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
                  <CircleIcon
                    key={index}
                    active={index === activeCircleIndex}
                    onClick={(e: any) => handleChange(e, index)}
                  >
                    3
                  </CircleIcon>
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
            <Image
              src={RightIcon}
              alt=""
              onClick={() => {
                setNextPage();
              }}
            />
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
                styles: calenderStyles,
              }}
            />
          </TimelineNavigation>
        ) : (
          <></>
        )}
      </TimeLineStyleContainer>
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
