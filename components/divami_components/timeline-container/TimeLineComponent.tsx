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
  PaginationStyle,
  SelectedTimeLine,
  TimeLinePagination,
  TimeLineStyleContainer,
} from "./TimeLineComponentStyles";

interface IProps {
  currentSnapshot: ISnapshot;
  snapshotList: ISnapshot[];
  snapshotHandler: (snapshotData: ISnapshot) => void;
}

const TimeLineComponent: React.FC<IProps> = ({
  currentSnapshot,
  snapshotList,
  snapshotHandler,
}) => {
  const [bottomNav, setBottomNav] = useState(false);
  const [page, setPage] = useState(1);
  const [oldDate, setOldDate] = useState("");
  const [newDate, setNewDate] = useState("");
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const toggleTimeline = () => {
    setBottomNav(!bottomNav);
  };

  const setCurrentSnapshot = (snapshot: ISnapshot) => {
    snapshotHandler(snapshot);
  };

  const getSnapshotDate = () => {
    if (currentSnapshot) {
      return Moment(currentSnapshot.date).format("Do MMM YYYY");
    } else {
      return "No Reality";
    }
  };

  useEffect(() => {
    setCurrentSnapshot(snapshotList[page - 1]);
  }, [page]);

  useEffect(() => {
    if (snapshotList.length > 0) {
      setOldDate(snapshotList[0].date);
      setNewDate(snapshotList[snapshotList.length - 1].date);
    }
  }, [snapshotList]);

  const disableWeekends = (date: any) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  console.log(snapshotList, "snaphsot listt");
  return (
    <>
      <TimeLineStyleContainer>
        <SelectedTimeLine onClick={toggleTimeline}>
          {Moment(currentSnapshot?.date).format("DD MMM YYYY")}
        </SelectedTimeLine>

        <div
        //  className="absolute flex flex-col items-center z-10 top-0 inset-x-0"
        >
          <div
          // className="bg-gray-300 border border-gray-700 rounded duration-300 cursor-pointer"
          >
            {/* <p onClick={toggleTimeline}>{getSnapshotDate()}</p> */}
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
              <CustomCalender
                onChange={(e: any) => handleChange(e, 1)}
                shouldDisableDate={disableWeekends}
                hideTextField
              />
            </TimeLinePagination>
          )}
        </div>
      </TimeLineStyleContainer>
    </>
  );
};

export default TimeLineComponent;
