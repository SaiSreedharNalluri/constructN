import { ISnapShort, ISnapShotDeatils } from '../../models/ISnapShort';
import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { getSnapshotDetails } from '../../services/snapshot';
import Moment from 'moment';
interface IProps {
  snapShots: ISnapShort[];
}
const Pagination: React.FC<IProps> = ({ snapShots }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [snapDeatails, setSnapDetails] = useState<ISnapShotDeatils>();
  const snBoxRef: any = useRef();
  const openSearch = () => {
    if (!showDetails) {
      snBoxRef.current.style.width = '25%';
      snBoxRef.current.style.height = '100%';
    }
  };
  const closeSearch = () => {
    snBoxRef.current.style.width = '0';
  };
  const getsnapShortDetails = (snapShotData: ISnapShort) => {
    console.log('e', snapShotData);
    getSnapshotDetails(
      snapShotData.project,
      snapShotData.structure,
      snapShotData._id
    )
      .then((response) => {
        setSnapDetails(response.data.result);
      })
      .catch();
  };
  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div className="flex " onClick={openSearch}>
          <div className="  py-2 px-1  ">
            <span>&laquo;</span>
          </div>
          <div className=" flex items-center mr-1">
            <p>{'10 - 1 - 2023'}</p>
          </div>
          {snapShots &&
            snapShots.length > 0 &&
            snapShots.map((snapData: ISnapShort) => {
              return (
                <div key={snapData._id} className="py-3 px-1">
                  <ul>
                    <li
                      key={snapData._id}
                      onClick={() => {
                        getsnapShortDetails(snapData);
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
        <div
          ref={snBoxRef}
          className={`fixed w-0  bg-white  top-8  right-0 z-10 overflow-x-hidden`}
        >
          <div className="h-6 border-y border-solid border-gray-400">
            <FontAwesomeIcon
              icon={faTimes}
              onClick={closeSearch}
              className="hover:white cursor-pointer ml-2 "
            />
            <div>
              <div>
                <span>SnapShotId :</span>
                {snapDeatails?._id}
              </div>

              <div>
                <span>Project :</span>
                {snapDeatails?.project?.name}
              </div>
              <div>
                <span>Structure :</span>
                {snapDeatails?.structure?.name}
              </div>
              <div>
                <span>CreatedAt :</span>
                {Moment(snapDeatails?.createdAt).format('MMM Do YYYY')}
              </div>
              <div>
                <span>UpdatedAt :</span>
                {Moment(snapDeatails?.updatedAt).format('MMM Do YYYY')}
              </div>
              <div>
                <span>status :</span>
                {snapDeatails?.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Pagination;
