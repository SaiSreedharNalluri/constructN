import { ISnapshot } from '../../models/ISnapshot';
import React, { useEffect, useState } from 'react';
import Moment from 'moment';
interface IProps {
  currentSnapshot: ISnapshot;
  snapshotList: ISnapshot[];
  getSnapshotInfo: (snapshotData: ISnapshot) => void;
}
const Pagination: React.FC<IProps> = ({ currentSnapshot, snapshotList, getSnapshotInfo }) => {
  const [oldDate, setOldDate] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    if (snapshotList.length > 0) {
      setNewDate(snapshotList[0].date);
      setOldDate(snapshotList.reverse()[0].date);
    }
  }, [snapshotList]);

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
          {snapshotList &&
            snapshotList.length > 0 &&
            snapshotList.map((snapData: ISnapshot) => {
              return (
                <div key={snapData._id} className="py-3 px-1">
                  {/* <ul>
                    <li
                       //key={snapData._id}
                      // onClick={() => {
                      //   getSnapshotInfo(snapData);
                      // }}
                    > */}
                      <div className="flex items-center justify-evenly rounded pl-2 ">
                        <input
                          type="radio"
                          name="bordered-radio"
                          className="w-2 h-2 mt-auto  cursor-pointer"
                          key={snapData._id}
                          defaultChecked ={(snapData._id === currentSnapshot._id) ? true : false}
                          onClick={() => {
                            getSnapshotInfo(snapData);
                          }}
                        />
                      </div>
                    {/* </li>
                  </ul> */}
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
