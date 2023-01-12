import { ISnapShort } from '../../models/ISnapShort';
import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
interface IProps {
  snapShots: ISnapShort[];
  getsnapShortDetails: (snapShotId: string) => void;
}
const Pagination: React.FC<IProps> = ({ snapShots, getsnapShortDetails }) => {
  const [snDetails, setSnDetails] = useState(false);
  const snBoxRef: any = useRef();
  const openSearch = () => {
    if (!snDetails) {
      snBoxRef.current.style.width = '25%';
      snBoxRef.current.style.height = '100%';
    }
  };
  const closeSearch = () => {
    snBoxRef.current.style.width = '0';
  };

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div className="flex" onClick={openSearch}>
          {snapShots &&
            snapShots.length > 0 &&
            snapShots.map((snapData: ISnapShort) => {
              return (
                <div key={snapData._id}>
                  <ul className="flex">
                    <li
                      key={snapData._id}
                      onClick={() => {
                        getsnapShortDetails(snapData._id);
                      }}
                    >
                      <div className="flex items-center rounded ">
                        <input
                          type="radio"
                          name="bordered-radio"
                          className="w-3 h-4 cursor-pointer text-blue-600"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              );
            })}
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
            ></FontAwesomeIcon>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Pagination;
