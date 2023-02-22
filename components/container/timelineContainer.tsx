import { useState } from "react";
import DatePicker from "./datePicker";
import Pagination from "./pagination";
import Moment from 'moment';
import { ISnapshot } from "../../models/ISnapshot";
interface IProps {
    currentSnapshot: ISnapshot;
    snapshotList: ISnapshot[];
    snapshotHandler: (snapshotData: ISnapshot) => void;
}

const TimelineContainer: React.FC<IProps> = ({ currentSnapshot, snapshotList, snapshotHandler }) => {

  const [bottomNav, setBottomNav] = useState(false);

  const toggleTimeline = () => {
    setBottomNav(!bottomNav);
  }

  const setCurrentSnapshot = (snapshot: ISnapshot) => {
    snapshotHandler(snapshot);
  }

  const getSnapshotDate = () => {
    if (currentSnapshot) {
      return Moment(currentSnapshot.date).format("Do MMM YYYY");
    } else {
      return "No Reality";
    }
  };

    return (
        <div className="absolute flex flex-col items-center z-10 bottom-0 inset-x-0">
        
        { snapshotList && currentSnapshot && (<div className={`flex flex-row ${bottomNav ? "visible" : "collapse"}`}>
            <div className=" bg-gray-200 border border-gray-300 rounded">
              <Pagination
                currentSnapshot={currentSnapshot}
                snapshotList={snapshotList}
                getSnapshotInfo={setCurrentSnapshot}
              />
            </div>

            {/* <div className="">
              <DatePicker></DatePicker>
            </div> */}
          </div>)}
          <div className="bg-gray-300 border border-gray-700 rounded duration-300 cursor-pointer flex grow shrink">
          <p onClick={toggleTimeline}>{getSnapshotDate()}</p>
        </div>
      </div>
    )
}

export default TimelineContainer;