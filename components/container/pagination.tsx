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
            <div className="flex justify-around">
                <div className="flex " onClick={openSearch}>

                    <div className='  py-2 px-1  ' >
                        <span>&laquo;</span>
                    </div>
                    <div className=' flex items-center mr-1'>
                        <p>{"10 - 1 - 2023"}</p>
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
                                                getsnapShortDetails(snapData._id);
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

                    <div className='flex items-center ml-1 '>
                        <p>{"11 - 1 - 2023"}  </p>
                    </div>
                    <div className=' flex items-center ml-1 ' >
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
                        ></FontAwesomeIcon>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Pagination;
