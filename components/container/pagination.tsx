import { ISnapshot } from '../../models/ISnapshot';
import React, { useEffect, useState } from 'react';
import { getSnapshotDetails } from '../../services/snapshot';
import Moment from 'moment';
interface IProps {
  snapshots: ISnapshot[];
}
const Pagination: React.FC<IProps> = ({ snapshots }) => {
  const [oldDate, setOldDate] = useState('');
  const [newDate, setNewDate] = useState('');
  useEffect(() => {
    if (snapshots.length > 0) {
      let snapResult = snapshots.sort(
        (a: ISnapshot, b: ISnapshot) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNewDate(snapResult[0].createdAt);
      setOldDate(snapResult.reverse()[0].createdAt);
    }
  }, [snapshots]);
  const getSnapshotInfo = (snapshotData: ISnapshot) => {
    getSnapshotDetails(
      snapshotData.project,
      snapshotData.structure,
      snapshotData._id
    )
      .then((response) => {})
      .catch();
  };
  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div className="flex ">
          <div className="  py-2 px-1  ">
            <span>&laquo;</span>
          </div>
          <div className=" flex items-center mr-1">
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
                          className="w-2 h-4 mt-auto cursor-pointer"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              );
            })}

          <div className="flex items-center ml-1 ">
            <p>{newDate && Moment(newDate).format('Do MMM YY')} </p>
          </div>
          <div className=" flex items-center ml-1 ">
            <span>&raquo;</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Pagination;
