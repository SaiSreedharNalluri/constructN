import { ISnapshot } from '../../models/ISnapshot';
import React, { useEffect, useState } from 'react';
import Moment from 'moment';
interface IProps {
  snapshots: ISnapshot[];
  getSnapshotInfo: (snapshotData: ISnapshot) => void;
}
const Pagination: React.FC<IProps> = ({ snapshots, getSnapshotInfo }) => {
  const [oldDate, setOldDate] = useState('');
  const [newDate, setNewDate] = useState('');
  useEffect(() => {
    if (snapshots.length > 0) {
      setNewDate(snapshots[0].createdAt);
      setOldDate(snapshots.reverse()[0].createdAt);
    }
  }, [snapshots]);

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div className="  py-2 px-1  ">
          <span>&laquo;</span>
        </div>
        <div className="flex items-center ">
          <div className=" flex text-sm">
            <p>{oldDate && Moment(oldDate).format('Do MMM YY')}</p>
          </div>
          {snapshots &&
            snapshots.length > 0 &&
            snapshots.map((snapData: ISnapshot) => {
              return (
                <div key={snapData._id} className="py-3 px-1">
                  <ul>
                    <li
                      key={snapData._id}
                      onClick={() => {
                        getSnapshotInfo(snapData);
                      }}
                    >
                      <div className="flex items-center justify-evenly rounded pl-2 ">
                        <input
                          type="radio"
                          name="bordered-radio"
                          className="w-2 h-2 mt-auto cursor-pointer"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              );
            })}

          <div className="flex text-sm items-center ml-1 ">
            <p>{newDate && Moment(newDate).format('Do MMM YY')} </p>
          </div>
        </div>

        <div className="  py-2 px-1  ">
          <span>&raquo;</span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Pagination;
