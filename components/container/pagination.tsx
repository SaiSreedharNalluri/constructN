import { ISnapshot } from '../../models/ISnapshot';
import React from 'react';
import { getSnapshotDetails } from '../../services/snapshot';
interface IProps {
  snapshots: ISnapshot[];
}
const Pagination: React.FC<IProps> = ({ snapshots }) => {
  const getSnapshotInfo = (snapshotData: ISnapshot) => {
    console.log('snapShotData', snapshotData);
    getSnapshotDetails(
      snapshotData.project,
      snapshotData.structure,
      snapshotData._id
    )
      .then((response) => {})
      .catch();
  };
  console.log('snapshots', snapshots);
  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div className="flex ">
          <div className="  py-2 px-1  ">
            <span>&laquo;</span>
          </div>
          <div className=" flex items-center mr-1">
            <p>{'10 - 1 - 2023'}</p>
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
            <p>{'11 - 1 - 2023'} </p>
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
